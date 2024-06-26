import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { FineService } from '../services/fine.service';
import { CreateFineDto } from '../dto/fines/create-fine.dto';
import { UpdateFineDto } from '../dto/fines/update-fine.dto';
import { ResponseMessage } from '../common/decorators/responseMessage.decorator';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('api/v1/fine')
@UseGuards(AuthGuard)
export class FineController {
  constructor(private readonly fineService: FineService) {}

  @ResponseMessage()
  @Post('calculate/:transaction_id')
  async calculateFine(@Param('transaction_id') transaction_id: number) {
    try {
      const fine = await this.fineService.calculateFine(transaction_id);
      return fine;
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }

  @ResponseMessage()
  @Post('pay/:fine_id')
  async payFine(@Param('fine_id') fine_id: number) {
    try {
      const fine = await this.fineService.payFine(fine_id);
      return fine;
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }

  @Post('add')
  create(@Body() createFineDto: CreateFineDto) {
    return this.fineService.createFine(createFineDto);
  }

  @Get()
  findAll() {
    return this.fineService.findAllFines();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fineService.findOneFine(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFineDto: UpdateFineDto) {
    return this.fineService.updateFine(+id, updateFineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fineService.removeFine(+id);
  }
}
