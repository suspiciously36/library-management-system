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
import { AuthorsService } from '../services/authors.service';
import { CreateAuthorDto } from './../dto/authors/create-author.dto';
import { UpdateAuthorDto } from './../dto/authors/update-author.dto';
import { ResponseMessage } from 'src/common/decorators/responseMessage.decorator';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('api/v1/authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @UseGuards(AuthGuard)
  @ResponseMessage()
  @Post('add')
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorsService.createAuthor(createAuthorDto);
  }

  @ResponseMessage()
  @Get()
  findAll() {
    return this.authorsService.findAllAuthor();
  }

  @ResponseMessage()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.authorsService.findOneAuthor(+id);
  }

  @UseGuards(AuthGuard)
  @ResponseMessage()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ) {
    return this.authorsService.updateAuthor(+id, updateAuthorDto);
  }

  @ResponseMessage()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.authorsService.removeAuthor(+id);
  }
}
