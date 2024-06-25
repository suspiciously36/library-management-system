import { Controller, Post } from '@nestjs/common';
import { SchedulerService } from '../services/scheduler.service';

@Controller('api/v1/scheduler')
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Post('start')
  startCronJob() {
    this.schedulerService.startCronJob();
    return `Cron job started`;
  }

  @Post('stop')
  stopCronJob() {
    this.schedulerService.stopCronJob();
    return `Cron job stopped`;
  }
}
