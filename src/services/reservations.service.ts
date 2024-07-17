import {
  ConflictException,
  ForbiddenException,
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
      throw new NotFoundException('Reservations not found');
    }
    const total = reservations.length;
    return { reservations, total };
  }

  async findOneReservation(id: number) {
    const reservation = await this.reservationRepository.findOneBy({ id });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }
    return reservation;
  }

  async updateReservation(
    id: number,
    updateReservationDto: UpdateReservationDto,
  ) {
    // Handle Blacklisted Customer
    const blacklistedCustomer = await this.customersRepository.findOne({
      where: {
        id: updateReservationDto.customer_id,
        is_blacklisted: true,
      },
    });

    if (blacklistedCustomer) {
      throw new ForbiddenException(
        'This customer is blacklisted due to unpaid fines for more than 14 days, cannot create Reservation',
      );
    }

    // Handle cooldown penalty Customer
    const penaltyCustomer = await this.customersRepository.findOne({
      where: {
        id: updateReservationDto.customer_id,
        reservation_cooldown_timestamp: MoreThan(new Date().getTime()),
      },
    });

    if (penaltyCustomer) {
      throw new ForbiddenException(
        'This customer is on a cooldown penalty for book reservation.',
      );
    }

    const reservation = await this.findOneReservation(id);
    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    const customer = await this.customersRepository.findOne({
      where: { id: updateReservationDto.customer_id },
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const book = await this.booksRepository.findOne({
      where: { id: updateReservationDto.book_id },
    });
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    reservation.customer_id = updateReservationDto.customer_id;
    reservation.book_id = updateReservationDto.book_id;
    reservation.is_fulfilled = updateReservationDto.is_fulfilled;
    return this.reservationRepository.save(reservation);
  }

  async deleteReservation(reservation_id: number) {
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservation_id },
      relations: ['book'],
    });
    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }
    if (reservation.is_fulfilled) {
      throw new ForbiddenException(
        'The reservation is fulfilled, you might not want to delete',
      );
    }
    reservation.book.copies_available += 1;
    await this.booksRepository.save(reservation.book);

    return this.reservationRepository.delete(reservation_id);
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
      throw new ForbiddenException(
        'This customer was unable to make a reservation due to a waiting time penalty since the previous reservation expired',
      );
    }

    // Handle Blacklisted Customer
    const blacklistedCustomer = await this.customersRepository.findOne({
      where: {
        id: customer_id,
        is_blacklisted: true,
      },
    });

    if (blacklistedCustomer) {
      throw new ForbiddenException(
        'This customer is blacklisted due to unpaid fines for more than 14 days, cannot create Reservation',
      );
    }

    // Handle normal Reservation
    const book = await this.bookService.findOneBook(book_id);

    const customer = await this.customerService.findOneCustomer(customer_id);

    if (!customer.reservation_limit) {
      throw new ForbiddenException(
        'This customer reached the reservation limit, cannot reserve more books',
      );
    }

    if (!book) {
      throw new NotFoundException(`Book not found`);
    }

    if (book.copies_available > 0) {
      book.copies_available -= 1;
      await this.booksRepository.save(book);
      const reservation = this.reservationRepository.create({
        book,
        customer,
        expire_at: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week expiration timer
      });

      //Decreasing customer's reservation_limit
      customer.reservation_limit -= 1;
      this.customersRepository.save(customer);

      // Sending mail notif
      await this.notificationService.sendBookReserveNotification(
        customer.email,
        book.title,
      );
      return await this.reservationRepository.save(reservation);
    } else {
      throw new ConflictException(
        'All copies of the book are already reserved',
      );
    }
  }

  async cancelReservation(reservation_id: number): Promise<void> {
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservation_id },
      relations: ['book', 'customer'],
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }
    if (reservation.is_fulfilled) {
      throw new ConflictException(
        'This reservation is already fulfilled, cannot cancel',
      );
    }

    reservation.book.copies_available += 1;
    reservation.customer.reservation_limit += 1;

    // Sending mail notif
    await this.notificationService.sendReservationCancelConfirmation(
      reservation.customer.email,
      reservation.book.title,
    );

    // Saving data
    await this.booksRepository.save(reservation.book);
    await this.customersRepository.save(reservation.customer);
    await this.reservationRepository.remove(reservation);
  }

  async fulfillReservation(reservation_id: number) {
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservation_id },
      relations: ['book', 'customer'],
    });
    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (reservation.is_fulfilled) {
      throw new ConflictException('This reservation is already borrowed');
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

    // Adding customer's reservation_limit cause fulfilled
    reservation.customer.reservation_limit += 1;
    await this.customersRepository.save(reservation.customer);

    // Sending mail notif
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
      reservation.customer.reservation_limit += 1;
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
