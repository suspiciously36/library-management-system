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
import { SchedulerModule } from './modules/scheduler.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { BlacklistModule } from './modules/blacklist.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        logging: true,
        synchronize: true, // Only use true in development
      }),
      inject: [ConfigService],
    }),

    CustomerModule,
    BooksModule,
    AuthorsModule,
    CategoriesModule,
    TransactionsModule,
    AdminsModule,
    AuthModule,
    BlacklistModule,
    FineModule,
    NotificationsModule,
    ReservationsModule,
    SchedulerModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
        outputAs: 'class',
      },
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
