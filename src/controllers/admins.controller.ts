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
import { AdminsService } from '../services/admins.service';
import { ResponseMessage } from 'src/common/decorators/responseMessage.decorator';
import { CreateAdminDto } from 'src/dto/admins/create-admin.dto';
import { UpdateAdminDto } from 'src/dto/admins/update-admin.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('api/v1/admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @ResponseMessage()
  @Post('add')
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminsService.findOrCreateAdmin(createAdminDto);
  }

  @UseGuards(AuthGuard)
  @ResponseMessage()
  @Get()
  async findAll() {
    const admins = await this.adminsService.findAllAdmin();
    if (!admins) {
      throw new NotFoundException('Admins not found!');
    }
    return admins;
  }

  @UseGuards(AuthGuard)
  @ResponseMessage()
  @Get(':id')
  findOne(@Param('id') id: string) {
    const admin = this.adminsService.findOneAdmin(+id);
    if (!admin) {
      throw new NotFoundException('Admin not found!');
    }
    return admin;
  }

  @UseGuards(AuthGuard)
  @ResponseMessage()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    const admin = await this.adminsService.findOneAdmin(+id);
    if (!admin) {
      throw new NotFoundException('Admin not found!');
    }
    return this.adminsService.updateAdmin(+id, updateAdminDto);
  }

  @UseGuards(AuthGuard)
  @ResponseMessage()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const admin = await this.adminsService.findOneAdmin(+id);
    if (!admin) {
      throw new NotFoundException('Admin not found!');
    }
    return this.adminsService.removeAdmin(+id);
  }
}
