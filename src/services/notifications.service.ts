import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  constructor(private mailerService: MailerService) {}
  async sendFineNotification(to: string, fine_fee: number): Promise<void> {
    const subject = 'Library Fine Notification';
    const content = `You have an outstanding fine fee of ${fine_fee}, please pay it asap.`;
    await this.mailerService.sendMail({ to, subject, text: content });
  }

  async sendPaymentConfirmation(to: string, fine_fee: number): Promise<void> {
    const subject = 'Payment Confirmation';
    const content = `You have successfully paid ${fine_fee} of overdue fee. Thank you!`;
    await this.mailerService.sendMail({ to, subject, text: content });
  }
}
