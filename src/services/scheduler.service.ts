import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { TransactionsService } from './transactions.service';
import { CronJob } from 'cron';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);
  private reservationCronJob: CronJob;
  private transactionCronJob: CronJob;

  constructor(
    @Inject(forwardRef(() => ReservationsService))
    private readonly reservationService: ReservationsService,
    @Inject(forwardRef(() => TransactionsService))
    private readonly transactionService: TransactionsService,
  ) {
    this.reservationCronJob = new CronJob('0 7 * * *', async () => {
      // EVERY_DAY_AT_7AM
      await this.handleReservationCron();
    });

    this.transactionCronJob = new CronJob('0 7 * * *', async () => {
      // EVERY_DAY_AT_7AM
      await this.handleTransactionCron();
    });

    // Starting the cron job automatically from the start
    // this.cronJob.start();
  }

  async handleReservationCron() {
    this.logger.log('Checking for expired reservations...');
    try {
      await this.reservationService.checkExpiredReservations();
      this.logger.log('Expired Reservation checked successfully.');
    } catch (e) {
      this.logger.log('Something went wrong...', e.stack);
    }
  }

  async handleTransactionCron() {
    this.logger.log('Checking for overdue transactions...');
    try {
      await this.transactionService.checkOverdueStatus();
      this.logger.log('Overdue transactions checked successfully.');
    } catch (e) {
      this.logger.log('Something went wrong...', e.stack);
    }
  }

  stopCronJob() {
    this.logger.log('Stopping the cron job...');
    this.transactionCronJob.stop();
    this.reservationCronJob.stop();
    this.logger.log('Cron job stopped.');
  }

  // Method to start the cron job
  startCronJob() {
    this.logger.log('Starting the cron job...');
    this.transactionCronJob.start();
    this.reservationCronJob.start();
  }
}
