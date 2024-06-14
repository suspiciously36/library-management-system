import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { TransactionsService } from '../services/transactions.service';
import { Transaction } from '../entities/transaction.entity';
import { ResponseMessage } from 'src/common/decorators/responseMessage.decorator';
import { CreateTransactionDto } from 'src/dto/transactions/create-transaction.dto';
import { UpdateTransactionDto } from 'src/dto/transactions/update-transaction.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('api/v1/transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(AuthGuard)
  @ResponseMessage()
  @Post('add')
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.createTransaction(createTransactionDto);
  }

  @Post('issue')
  @ResponseMessage()
  createIssueTransaction(
    @Body() transactionData: Partial<Transaction>,
  ): Promise<Transaction> {
    return this.transactionsService.createIssueTransaction(transactionData);
  }

  @Patch('return/:id')
  @ResponseMessage()
  createReturnTransaction(
    @Param('id', ParseIntPipe) id: string,
    @Body('return_date') returnData: Date,
  ): Promise<Transaction> {
    return this.transactionsService.createReturnTransaction(id, returnData);
  }

  @UseGuards(AuthGuard)
  @ResponseMessage()
  @Get()
  async findAll() {
    return this.transactionsService.findAllTransaction();
  }

  @UseGuards(AuthGuard)
  @ResponseMessage()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.transactionsService.findOneTransaction(+id);
  }

  @UseGuards(AuthGuard)
  @ResponseMessage()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.updateTransaction(
      +id,
      updateTransactionDto,
    );
  }

  @UseGuards(AuthGuard)
  @ResponseMessage()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.transactionsService.removeTransaction(+id);
  }
}
