import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { CreateCustomerDto } from 'src/dto/customers/create-customer.dto';
import { UpdateCustomerDto } from 'src/dto/customers/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async findOrCreateCustomer(
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

  async findAllCustomer(): Promise<{ customers: Customer[]; total: number }> {
    const customers = await this.customerRepository.find();
    if (!customers || !customers.length) {
      throw new NotFoundException('Customers not found.');
    }
    const total = customers.length;
    return { customers, total };
  }

  async findOneCustomer(id: number) {
    const customer = await this.customerRepository.findOneBy({ id });
    if (!customer) {
      throw new NotFoundException('Customer not found.');
    }

    return customer;
  }

  async updateCustomer(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const customer = await this.customerRepository.findOneBy({ id });
    if (!customer) {
      throw new NotFoundException('Customer not found.');
    }
    customer.name = updateCustomerDto.name;
    customer.phone = updateCustomerDto.phone;
    customer.address = updateCustomerDto.address;
    customer.email = updateCustomerDto.email;
    return this.customerRepository.save(customer);
  }

  async removeCustomer(id: number) {
    const customer = await this.customerRepository.findOneBy({ id });
    if (!customer) {
      throw new NotFoundException('Customer not found.');
    }
    return this.customerRepository.delete({ id });
  }
}
