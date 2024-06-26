import { Controller, Post, UseGuards } from '@nestjs/common';
import { SchedulerService } from '../services/scheduler.service';
import { ResponseMessage } from '../common/decorators/responseMessage.decorator';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('api/v1/scheduler')
@UseGuards(AuthGuard)
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @ResponseMessage()
  @Post('start')
  startCronJob() {
    this.schedulerService.startCronJob();
    return `Cron job started`;
  }

  @ResponseMessage()
  @Post('stop')
  stopCronJob() {
    this.schedulerService.stopCronJob();
    return `Cron job stopped`;
  }
}
