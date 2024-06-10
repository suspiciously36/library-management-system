import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  findOrCreateCustomer(
    createCustomerDto: CreateCustomerDto,
  ): Promise<Customer> {
    const customer: Customer = new Customer();
    customer.name = createCustomerDto.name;
    customer.phone = createCustomerDto.phone;
    customer.address = createCustomerDto.address;
    customer.email = createCustomerDto.email;
    // customer.gender = createCustomerDto.gender;

    return this.customerRepository
      .upsert([customer], ['email'])
      .then((insertResult) => {
        const insertedCustomerId = insertResult.identifiers[0].id;
        return this.customerRepository.findOneBy(insertedCustomerId);
      });
  }

  findAllCustomer(): Promise<Customer[]> {
    return this.customerRepository.find();
  }

  findOneCustomer(id: number) {
    return this.customerRepository.findOneBy({ id });
  }

  updateCustomer(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const customer: Customer = new Customer();
    customer.name = updateCustomerDto.name;
    customer.phone = updateCustomerDto.phone;
    customer.address = updateCustomerDto.address;
    customer.email = updateCustomerDto.email;
    customer.id = id;
    return this.customerRepository.save(customer);
  }

  removeCustomer(id: number) {
    return this.customerRepository.delete({ id });
  }
}
