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
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/v1/transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Post('issue')
  createIssueTransaction(
    @Body() transactionData: Partial<Transaction>,
  ): Promise<Transaction> {
    return this.transactionsService.createIssueTransaction(transactionData);
  }

  @Patch('return/:id')
  createReturnTransaction(
    @Param('id', ParseIntPipe) id: string,
    @Body('return_date') returnData: Date,
  ): Promise<Transaction> {
    return this.transactionsService.createReturnTransaction(id, returnData);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.transactionsService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(+id, updateTransactionDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(+id);
  }
}
