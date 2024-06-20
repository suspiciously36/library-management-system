import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { fineData } from '../factories/data/fine.data';
import { Fine } from '../entities/fine.entity';
import { Transaction } from '../entities/transaction.entity';
import { Book } from '../entities/book.entity';
import { dateTypeTransformer } from '../common/utils/dateType.transformer';

export default class CreateFine implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    for (let i = 0; i < fineData.length; i++) {
      const transactionId = fineData[i].transaction_id;
      const transaction = await connection
        .getRepository(Transaction)
        .findOne({ where: { id: transactionId } });
      const book = await connection
        .getRepository(Book)
        .findOne({ where: { id: transaction.book_id } });
      await factory(Fine)({ index: i })
        .map(async (fine: Fine) => {
          if (book && book.copies_available > 0) {
            book.copies_available += 1;
            await connection.getRepository(Book).save(book);
          }
          if (!transaction.is_returned) {
            transaction.is_returned = true;
          }

          const dueDate = dateTypeTransformer(transaction.due_date);
          const dueDateTS = Math.floor(dueDate.getTime());
          const returnDate = new Date(
            dueDateTS + fine.overdue_days * (1000 * 60 * 60 * 24),
          );
          transaction.return_date = returnDate;
          if (!fine.overdue_days) {
            transaction.return_date = transaction.due_date;
          }
          fine.overdue_fee = fine.overdue_days * 10000;
          await connection.getRepository(Transaction).save(transaction);
          return fine;
        })
        .create();
    }
  }
}
