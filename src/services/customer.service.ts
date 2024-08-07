import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async createCustomer(
    createCustomerDto: CreateCustomerDto,
  ): Promise<Customer> {
    const existingCustomer = await this.customerRepository.findOne({
      where: [
        { email: createCustomerDto.email },
        { phone: createCustomerDto.phone },
      ],
    });

    if (existingCustomer) {
      throw new ConflictException(
        'Customer with this email/phone already exists',
      );
    }

    const customer: Customer = new Customer();
    customer.name = createCustomerDto.name;
    customer.phone = createCustomerDto.phone;
    customer.address = createCustomerDto.address;
    customer.email = createCustomerDto.email;
    customer.reservation_cooldown_timestamp =
      createCustomerDto.reservation_cooldown_timestamp;
    customer.reservation_limit = createCustomerDto.reservation_limit;

    return this.customerRepository.save(customer);
  }

  async findAllCustomer(): Promise<{ customers: Customer[]; total: number }> {
    const customers = await this.customerRepository.find();
    if (!customers || !customers.length) {
      throw new NotFoundException('Customers not found');
    }
    const total = customers.length;
    return { customers, total };
  }

  async findOneCustomer(id: number) {
    const customer = await this.customerRepository.findOneBy({ id });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async updateCustomer(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const customer = await this.customerRepository.findOneBy({ id });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    if (updateCustomerDto.email && updateCustomerDto.phone) {
      const existingCustomer = await this.customerRepository.findOne({
        where: [
          { email: updateCustomerDto.email },
          { phone: updateCustomerDto.phone },
        ],
      });

      if (existingCustomer) {
        throw new ConflictException(
          'Customer with this email/phone already exists',
        );
      }
    }

    customer.name = updateCustomerDto.name;
    customer.phone = updateCustomerDto.phone;
    customer.address = updateCustomerDto.address;
    customer.email = updateCustomerDto.email;
    customer.reservation_cooldown_timestamp =
      updateCustomerDto.reservation_cooldown_timestamp;
    customer.reservation_limit = updateCustomerDto.reservation_limit;
    customer.is_blacklisted = updateCustomerDto.is_blacklisted;
    return this.customerRepository.save(customer);
  }

  async removeCustomer(id: number) {
    const customer = await this.customerRepository.findOneBy({ id });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return this.customerRepository.delete({ id });
  }
}
