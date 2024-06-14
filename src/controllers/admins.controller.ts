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
    return await this.adminsService.findAllAdmin();
  }

  @UseGuards(AuthGuard)
  @ResponseMessage()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminsService.findOneAdmin(+id);
  }

  @UseGuards(AuthGuard)
  @ResponseMessage()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    return this.adminsService.updateAdmin(+id, updateAdminDto);
  }

  @UseGuards(AuthGuard)
  @ResponseMessage()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.adminsService.removeAdmin(+id);
  }
}
