import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import * as bcrypt from 'bcrypt';

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

  findAllAdmin(): Promise<Admin[]> {
    return this.adminsRepository.find();
  }

  findOneUsername(username: string) {
    return this.adminsRepository.findOneBy({ username });
  }

  findOneAdmin(id: number) {
    return this.adminsRepository.findOneBy({ id });
  }

  updateAdmin(id: number, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    const admin: Admin = new Admin();
    admin.email = updateAdminDto.email;
    admin.username = updateAdminDto.username;
    admin.password = bcrypt.hashSync(updateAdminDto.password, 10);
    admin.id = id;
    return this.adminsRepository.save(admin);
  }

  removeAdmin(id: number) {
    return this.adminsRepository.delete({ id });
  }
}
