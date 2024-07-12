import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { reservationData } from '../factories/data/reservation.data';
import { Reservation } from '../entities/reservation.entity';
import { Book } from '../entities/book.entity';
import { Customer } from '../entities/customer.entity';
import { Transaction } from '../entities/transaction.entity';

export default class CreateReservation implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    for (let i = 0; i < reservationData.length; i++) {
      const book = await connection
        .getRepository(Book)
        .findOne({ where: { id: reservationData[i].book_id } });
      const customer = await connection
        .getRepository(Customer)
        .findOne({ where: { id: reservationData[i].customer_id } });

      await factory(Reservation)({ index: i })
        .map(async (reservation: Reservation) => {
          if (book && book.copies_available > 0) {
            book.copies_available -= 1;
          }
          if (reservation.is_fulfilled) {
            customer.reservation_limit += 1;
          }
          await connection.getRepository(Customer).save(customer);
          await connection.getRepository(Book).save(book);
          return reservation;
        })
        .create();
    }
  }
}
