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

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
    private bookService: BooksService,
    private customerService: CustomerService,
    private notificationService: NotificationsService,
  ) {}
  //CRUD

  async findAllReservations() {
    const reservations = await this.reservationRepository.find();
    if (!reservations) {
      throw new NotFoundException('Reservations not found.');
    }
    return reservations;
  }

  async findOneReservation(id: number) {
    const reservation = await this.findOneReservation(id);
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
    console.log(reservation);

    if (!reservation) {
      throw new NotFoundException('Reservation not found.');
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

    reservation.is_fulfilled = true;
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
    });
    console.log(expiredReservations);

    for (const reservation of expiredReservations) {
      reservation.book.copies_available += 1;
      await this.booksRepository.save(reservation.book);
      await this.reservationRepository.remove(reservation);
    }
  }
}
