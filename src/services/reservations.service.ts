import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateReservationDto } from '../dto/reservations/update-reservation.dto';
import { Reservation } from '../entities/reservation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { BooksService } from './books.service';
import { CustomerService } from './customer.service';
import { Book } from '../entities/book.entity';
import { NotificationsService } from './notifications.service';
import { TransactionsService } from './transactions.service';
import { Customer } from '../entities/customer.entity';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,
    private bookService: BooksService,
    private customerService: CustomerService,
    private notificationService: NotificationsService,
    private transactionService: TransactionsService,
  ) {}
  //CRUD

  async findAllReservations(): Promise<{
    reservations: Reservation[];
    total: number;
  }> {
    const reservations = await this.reservationRepository.find();
    if (!reservations || !reservations.length) {
      throw new NotFoundException('Reservations not found.');
    }
    const total = reservations.length;
    return { reservations, total };
  }

  async findOneReservation(id: number) {
    const reservation = await this.reservationRepository.findOneBy({ id });
    console.log(reservation);

    if (!reservation) {
      throw new NotFoundException('Reservation not found.');
    }
    return reservation;
  }

  async updateReservation(
    id: number,
    updateReservationDto: UpdateReservationDto,
  ) {
    const reservation = await this.findOneReservation(id);
    if (!reservation) {
      throw new NotFoundException('Reservation not found.');
    }
    reservation.customer_id = updateReservationDto.customer_id;
    reservation.book_id = updateReservationDto.book_id;
    reservation.is_fulfilled = updateReservationDto.is_fulfilled;
    return this.reservationRepository.save(reservation);
  }

  // Business Logic
  async createReservation(
    book_id: number,
    customer_id: number,
  ): Promise<Reservation> {
    // Handle Reservation cooldown
    const penaltyCustomer = await this.customersRepository.findOne({
      where: {
        id: customer_id,
        reservation_cooldown_timestamp: MoreThan(new Date().getTime()),
      },
    });

    if (penaltyCustomer) {
      throw new ConflictException(
        'This customer cannot make a book reservation due to cooldown penalty for last reservation expiration',
      );
    }

    // Handle normal Reservation
    const book = await this.bookService.findOneBook(book_id);

    const customer = await this.customerService.findOneCustomer(customer_id);

    if (!book) {
      throw new NotFoundException(`Book with id = ${book_id} not found.`);
    }

    if (book.copies_available > 0) {
      book.copies_available -= 1;
      await this.booksRepository.save(book);
      const reservation = this.reservationRepository.create({
        book,
        customer,
        expire_at: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week expiration timer
      });
      await this.notificationService.sendBookReserveNotification(
        customer.email,
        book.title,
      );
      return await this.reservationRepository.save(reservation);
    } else {
      throw new ConflictException(
        'All copies of the books are already reserved.',
      );
    }
  }

  async cancelReservation(reservation_id: number): Promise<void> {
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservation_id },
      relations: ['book', 'customer'],
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found.');
    }
    if (reservation.is_fulfilled) {
      throw new ConflictException(
        'This reservation is already fulfilled, cannot cancel.',
      );
    }

    reservation.book.copies_available += 1;

    await this.notificationService.sendReservationCancelConfirmation(
      reservation.customer.email,
      reservation.book.title,
    );
    await this.booksRepository.save(reservation.book);
    await this.reservationRepository.remove(reservation);
  }

  async fulfillReservation(reservation_id: number) {
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservation_id },
      relations: ['book', 'customer'],
    });
    if (!reservation) {
      throw new NotFoundException('Reservation not found.');
    }

    if (reservation.is_fulfilled) {
      throw new ConflictException('This reservation is already borrowed.');
    }

    reservation.is_fulfilled = true;

    reservation.book.copies_available += 1;
    await this.booksRepository.save(reservation.book);
    // +1 cause createIssue above already -1 book

    const transactionData = {
      book_id: reservation.book.id,
      customer_id: reservation.customer.id,
      issued_date: reservation.updated_at,
      due_date: new Date(new Date().setDate(new Date().getDate() + 7)),
    };

    if (reservation.is_fulfilled) {
      await this.transactionService.createIssueTransaction(transactionData);
    }

    await this.notificationService.sendFulfillConfirmation(
      reservation.customer.email,
      reservation.book.title,
    );
    await this.reservationRepository.save(reservation);
  }

  async checkExpiredReservations(): Promise<void> {
    const now = new Date();
    const expiredReservations = await this.reservationRepository.find({
      where: { expire_at: LessThan(now), is_fulfilled: false },
      relations: ['book', 'customer'],
    });

    for (const reservation of expiredReservations) {
      reservation.book.copies_available += 1;
      reservation.customer.reservation_cooldown_timestamp =
        now.getTime() + 3 * 24 * 60 * 60 * 1000;
      await this.booksRepository.save(reservation.book);
      await this.customersRepository.save(reservation.customer);
      await this.reservationRepository.remove(reservation);
      await this.notificationService.sendExpiredReservationNotification(
        reservation.customer.email,
        reservation.book.title,
      );
    }
  }
}
