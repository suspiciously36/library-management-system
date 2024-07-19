import { Factory, Seeder } from 'typeorm-seeding';
import { Transaction } from '../entities/transaction.entity';
import { Book } from '../entities/book.entity';
import { Connection } from 'typeorm';
import { transactionData } from '../factories/data/transaction.data';

export default class CreateTransaction implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    for (let i = 0; i < transactionData.length; i++) {
      const bookId = transactionData[i].book_id;
      const book = await connection
        .getRepository(Book)
        .findOne({ where: { id: bookId } });

      if (book && book.copies_available > 0) {
        await factory(Transaction)({ index: i })
          .map(async (transaction: Transaction) => {
            book.copies_available -= 1;
            await connection.getRepository(Book).save(book);
            if (transaction.is_returned) {
              book.copies_available += 1;
              await connection.getRepository(Book).save(book);
            }
            return transaction;
          })
          .create();
      }
    }
  }
}
