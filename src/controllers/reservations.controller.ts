import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReservationsService } from '../services/reservations.service';
import { UpdateReservationDto } from '../dto/reservations/update-reservation.dto';
import { Reservation } from '../entities/reservation.entity';
import { ResponseMessage } from '../common/decorators/responseMessage.decorator';

@Controller('api/v1/reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @ResponseMessage()
  @Post('create')
  create(
    @Body('customer_id') customer_id: number,
    @Body('book_id') book_id: number,
  ): Promise<Reservation> {
    return this.reservationsService.createReservation(customer_id, book_id);
  }

  @ResponseMessage()
  @Delete('cancel/:id')
  remove(@Param('id') id: string) {
    return this.reservationsService.cancelReservation(+id);
  }

  @ResponseMessage()
  @Patch('fulfill/:id')
  fulfill(@Param('id') id: string) {
    return this.reservationsService.fulfillReservation(+id);
  }

  @ResponseMessage()
  @Get()
  findAll() {
    return this.reservationsService.findAllReservations();
  }

  @ResponseMessage()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOneReservation(+id);
  }

  @ResponseMessage()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationsService.updateReservation(
      +id,
      updateReservationDto,
    );
  }
}
