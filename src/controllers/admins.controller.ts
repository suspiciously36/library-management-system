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
import { AdminsService } from '../services/admins.service';
import { ResponseMessage } from 'src/common/decorators/responseMessage.decorator';
import { CreateAdminDto } from 'src/dto/admins/create-admin.dto';
import { UpdateAdminDto } from 'src/dto/admins/update-admin.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('api/v1/admins')
@UseGuards(AuthGuard)
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @ResponseMessage()
  @Post('add')
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminsService.createAdmin(createAdminDto);
  }

  @ResponseMessage()
  @Get()
  async findAll() {
    return await this.adminsService.findAllAdmin();
  }

  @ResponseMessage()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminsService.findOneAdmin(+id);
  }

  @ResponseMessage()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    return this.adminsService.updateAdmin(+id, updateAdminDto);
  }

  @ResponseMessage()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.adminsService.removeAdmin(+id);
  }
}
