import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { TransactionsService } from './transactions.service';
import { CronJob } from 'cron';
import { BlacklistService } from './blacklist.service';
import { FineService } from './fine.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);
  private reservationExpireCronJob: CronJob;
  private transactionCronJob: CronJob;
  private blacklistCronJob: CronJob;
  private fineCronJob: CronJob;

  constructor(
    @Inject(forwardRef(() => ReservationsService))
    private readonly reservationService: ReservationsService,
    @Inject(forwardRef(() => TransactionsService))
    private readonly transactionService: TransactionsService,
    @Inject(forwardRef(() => BlacklistService))
    private readonly blacklistService: BlacklistService,
    @Inject(forwardRef(() => FineService))
    private readonly fineService: FineService,
  ) {
    // EVERY_DAY_AT_7AM
    this.reservationExpireCronJob = new CronJob('0 7 * * *', async () => {
      await this.handleReservationExpireCron();
    });

    // EVERY_DAY_AT_7AM
    this.transactionCronJob = new CronJob('0 7 * * *', async () => {
      await this.handleTransactionCron();
    });

    // EVERY_HOUR
    this.blacklistCronJob = new CronJob('0 * * * *', async () => {
      await this.handleBlacklistCron();
    });

    // EVERY_DAY_AT_MIDNIGHT
    this.fineCronJob = new CronJob('* * * * *', async () => {
      await this.handleFineUpdateCron();
    });

    // Starting the cron job automatically from the start
    // this.cronJob.start();
  }

  async handleReservationExpireCron() {
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

  async handleBlacklistCron() {
    this.logger.log('Checking for blacklist status...');
    try {
      await this.blacklistService.checkAndUpdateBlacklistStatus();
      this.logger.log('Blacklist status checked and updated successfully.');
    } catch (e) {
      this.logger.log('Something went wrong...', e.stack);
    }
  }

  async handleFineUpdateCron() {
    this.logger.log('Checking and updating Fines...');
    try {
      await this.fineService.dailyFineUpdater();
      this.logger.log('Fines status checked and updated successfully.');
    } catch (e) {
      this.logger.log('Something went wrong...', e.stack);
    }
  }

  stopCronJob() {
    this.logger.log('Stopping the cron job...');
    this.transactionCronJob.stop();
    this.reservationExpireCronJob.stop();
    this.blacklistCronJob.stop();
    this.fineCronJob.stop();
    this.logger.log('Cron job stopped.');
  }

  // Method to start the cron job
  startCronJob() {
    this.logger.log('Starting the cron job...');
    this.transactionCronJob.start();
    this.reservationExpireCronJob.start();
    this.blacklistCronJob.start();
    this.fineCronJob.start();
  }
}
