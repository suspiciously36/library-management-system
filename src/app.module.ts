import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerModule } from './modules/customer.module';
import { BooksModule } from './modules/books.module';
import { AuthorsModule } from './modules/authors.module';
import { CategoriesModule } from './modules/categories.module';
import { TransactionsModule } from './modules/transactions.module';
import { AdminsModule } from './modules/admins.module';
import { AuthModule } from './modules/auth.module';
import { FineModule } from './modules/fine.module';
import { NotificationsModule } from './modules/notifications.module';
import { ReservationsModule } from './modules/reservations.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerController } from './controllers/scheduler.controller';
import { SchedulerModule } from './modules/scheduler.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      // type: 'postgres',
      // host: 'localhost',
      // port: 5432,
      // password: 'Hiimtuankiet36',
      // username: 'postgres',
      // entities: [Customer, Book, Author, Category, Transaction, Admin],
      // database: 'library_management_database',
      // synchronize: true,
      // logging: true,
      type: 'sqlite',
      database: 'db/sql',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      logging: true,
      synchronize: true,
    }),
    CustomerModule,
    BooksModule,
    AuthorsModule,
    CategoriesModule,
    TransactionsModule,
    AdminsModule,
    AuthModule,
    FineModule,
    NotificationsModule,
    ReservationsModule,
    ScheduleModule.forRoot(),
    SchedulerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
