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
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { AuthGuard } from '../auth/auth.guard';
import { ResponseMessage } from 'src/decorators/responseMessage.decorator';

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
    const transactions = this.transactionsService.findAllTransaction();
    if (!transactions) {
      throw new NotFoundException('Transactions not found!');
    }
    return transactions;
  }

  @UseGuards(AuthGuard)
  @ResponseMessage()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const transaction = this.transactionsService.findOneTransaction(+id);
    if (!transaction) {
      throw new NotFoundException('Transaction not found!');
    }
    return transaction;
  }

  @UseGuards(AuthGuard)
  @ResponseMessage()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    const transaction = this.transactionsService.findOneTransaction(+id);
    if (!transaction) {
      throw new NotFoundException('Transaction not found!');
    }
    return this.transactionsService.updateTransaction(
      +id,
      updateTransactionDto,
    );
  }

  @UseGuards(AuthGuard)
  @ResponseMessage()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const transaction = this.transactionsService.findOneTransaction(+id);
    if (!transaction) {
      throw new NotFoundException('Transaction not found!');
    }
    return this.transactionsService.removeTransaction(+id);
  }
}
