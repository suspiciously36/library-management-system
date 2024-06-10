import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ResponseMessage } from 'src/decorators/responseMessage.decorator';

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ResponseMessage()
  @Post('add')
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  @ResponseMessage()
  @Get()
  async findAll() {
    const categories = await this.categoriesService.findAllCategory();
    if (!categories) {
      throw new NotFoundException('Categories not found!');
    }
    return categories;
  }

  @ResponseMessage()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const category = await this.categoriesService.findOneCategory(+id);
    if (!category) {
      throw new NotFoundException('Category not found!');
    }
    return category;
  }

  @ResponseMessage()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = await this.categoriesService.findOneCategory(+id);
    if (!category) {
      throw new NotFoundException('Category not found!');
    }
    return this.categoriesService.updateCategory(+id, updateCategoryDto);
  }

  @ResponseMessage()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const category = await this.categoriesService.findOneCategory(+id);
    if (!category) {
      throw new NotFoundException('Category not found!');
    }
    return this.categoriesService.removeCategory(+id);
  }
}
