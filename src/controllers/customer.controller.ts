import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CustomerService } from '../services/customer.service';
import { ResponseMessage } from 'src/common/decorators/responseMessage.decorator';
import { CreateCustomerDto } from 'src/dto/customers/create-customer.dto';
import { UpdateCustomerDto } from 'src/dto/customers/update-customer.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('api/v1/customers')
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
    return await this.customerService.findAllCustomer();
  }

  @ResponseMessage()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.customerService.findOneCustomer(+id);
  }

  @ResponseMessage()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.updateCustomer(+id, updateCustomerDto);
  }

  @ResponseMessage()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.customerService.removeCustomer(+id);
  }
}
