import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ResponseMessage } from 'src/decorators/responseMessage.decorator';

@Controller('api/v1/customer')
@UseGuards(AuthGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('add')
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.findOrCreateCustomer(createCustomerDto);
  }

  @ResponseMessage()
  @Get()
  async findAll() {
    const customers = await this.customerService.findAllCustomer();
    if (!customers) {
      throw new NotFoundException('Customers not found!');
    }
    return customers;
  }

  @ResponseMessage()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const customer = await this.customerService.findOneCustomer(+id);
    if (!customer) {
      throw new NotFoundException('Customer not found!');
    }
    return customer;
  }

  @ResponseMessage()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    const customer = await this.customerService.findOneCustomer(+id);
    if (!customer) {
      throw new NotFoundException('Customer not found!');
    }
    return this.customerService.updateCustomer(+id, updateCustomerDto);
  }

  @ResponseMessage()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const customer = await this.customerService.findOneCustomer(+id);
    if (!customer) {
      throw new NotFoundException('Customer not found!');
    }
    return this.customerService.removeCustomer(+id);
  }
}
