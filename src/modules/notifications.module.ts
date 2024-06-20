import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { NotificationsService } from '../services/notifications.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: '082.hoangtuankiet@gmail.com',
          pass: 'kbva iour ywwl qfrc',
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@dontreplythismail.com>',
      },
    }),
  ],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
