import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../entities/admin.entity';
import * as bcrypt from 'bcrypt';
import { CreateAdminDto } from 'src/dto/admins/create-admin.dto';
import { UpdateAdminDto } from 'src/dto/admins/update-admin.dto';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminsRepository: Repository<Admin>,
  ) {}
  findOrCreateAdmin(createAdminDto: CreateAdminDto): Promise<Admin> {
    const admin: Admin = new Admin();
    admin.email = createAdminDto.email;
    admin.password = bcrypt.hashSync(createAdminDto.password, 10);
    admin.username = createAdminDto.username;

    return this.adminsRepository
      .upsert([admin], ['email'])
      .then((insertResult) => {
        const insertAdminId = insertResult.identifiers[0].id;
        return this.adminsRepository.findOneBy(insertAdminId);
      });
  }
  async findAllAdmin(): Promise<Admin[]> {
    const admins = this.adminsRepository.find();
    if (!admins) {
      throw new NotFoundException('Admins not found!');
    }
    return admins;
  }

  findOneUsername(username: string) {
    return this.adminsRepository.findOneBy({ username });
  }

  async findOneAdmin(id: number) {
    const admin = await this.adminsRepository.findOneBy({ id });
    if (!admin) {
      throw new NotFoundException('Admin not found!');
    }
    return admin;
  }

  async updateAdmin(
    id: number,
    updateAdminDto: UpdateAdminDto,
  ): Promise<Admin> {
    const admin = await this.findOneAdmin(id);
    if (!admin) {
      throw new NotFoundException('Admin not found!');
    }
    admin.email = updateAdminDto.email;
    admin.username = updateAdminDto.username;
    admin.password = bcrypt.hashSync(updateAdminDto.password, 10);
    return this.adminsRepository.save(admin);
  }

  async removeAdmin(id: number) {
    const admin = await this.findOneAdmin(id);
    if (!admin) {
      throw new NotFoundException('Admin not found!');
    }
    return this.adminsRepository.delete({ id });
  }
}
