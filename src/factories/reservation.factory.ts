import { define } from 'typeorm-seeding';
import { Book } from '../entities/book.entity';
import { Customer } from '../entities/customer.entity';
import { Reservation } from '../entities/reservation.entity';
import { reservationData } from './data/reservation.data';

define(
  Reservation,
  (_, context: { index: number; book: Book; customer: Customer }) => {
    const reservation = new Reservation();
    reservation.book_id = reservationData[context.index].book_id;
    reservation.customer_id = reservationData[context.index].customer_id;
    reservation.expire_at = reservationData[context.index].expire_at;
    reservation.is_fulfilled = reservationData[context.index].is_fulfilled;
    reservation.book = context.book;
    reservation.customer = context.customer;

    return reservation;
  },
);
