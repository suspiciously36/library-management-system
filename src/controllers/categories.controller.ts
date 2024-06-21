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
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto } from '../dto/categories/create-category.dto';
import { UpdateCategoryDto } from '../dto/categories/update-category.dto';
import { ResponseMessage } from 'src/common/decorators/responseMessage.decorator';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(AuthGuard)
  @ResponseMessage()
  @Post('add')
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  @ResponseMessage()
  @Get()
  async findAll() {
    return await this.categoriesService.findAllCategory();
  }

  @ResponseMessage()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.categoriesService.findOneCategory(+id);
  }

  @UseGuards(AuthGuard)
  @ResponseMessage()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.updateCategory(+id, updateCategoryDto);
  }

  @UseGuards(AuthGuard)
  @ResponseMessage()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.categoriesService.removeCategory(+id);
  }
}
