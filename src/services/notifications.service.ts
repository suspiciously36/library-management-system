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

  async sendOnTimeNotification(to: string): Promise<void> {
    const subject = 'Library Fine Notification';
    const content = `You have return the book just on time, thank you for choosing us.`;
    await this.mailerService.sendMail({ to, subject, text: content });
  }

  async sendPaymentConfirmation(to: string, fine_fee: number): Promise<void> {
    const subject = 'Payment Confirmation';
    const content = `You have successfully paid ${fine_fee} of overdue fee. Thank you!`;
    await this.mailerService.sendMail({ to, subject, text: content });
  }

  async sendBookReserveNotification(
    to: string,
    book_name: string,
  ): Promise<void> {
    const subject = `Book Reserved`;
    const content = `You have successfully reserved book named ${book_name} from the library, you have 7 days to confirm and borrow the book.`;
    await this.mailerService.sendMail({ to, subject, text: content });
  }

  async sendExpiredReservationNotification(
    to: string,
    book_name: string,
  ): Promise<void> {
    const subject = `Reservation expired`;
    const content = `Your reservation of book named ${book_name} is expired after 7 days, if you want to make a reservation again, please wait after 3 days from today.`;
    await this.mailerService.sendMail({ to, subject, text: content });
  }

  async sendFulfillConfirmation(to: string, book_name: string): Promise<void> {
    const subject = `Book Borrowed`;
    const content = `You have successfully borrowed book named ${book_name} from the library. Thank you.`;
    await this.mailerService.sendMail({ to, subject, text: content });
  }

  async sendReservationCancelConfirmation(
    to: string,
    book_name: string,
  ): Promise<void> {
    const subject = `Reservation cancelled`;
    const content = `You have successfully cancel reservation of book named ${book_name}.`;
    await this.mailerService.sendMail({ to, subject, text: content });
  }

  async sendOverdueNotification(
    to: string,
    book_name: string,
    days: number,
  ): Promise<void> {
    const subject = `Overdue Notification`;
    const content = `Your issuance of book named ${book_name} is already overdue for ${days} day(s), please check your transaction, pay the fine fee and make a return `;
    await this.mailerService.sendMail({ to, subject, text: content });
  }
}
