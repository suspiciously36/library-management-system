import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from '../dto/categories/create-category.dto';
import { UpdateCategoryDto } from '../dto/categories/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const existingCategory = await this.categoryRepository.findOne({
      where: {
        name: createCategoryDto.name,
      },
    });
    if (existingCategory) {
      throw new ConflictException('Category with this name already exists');
    }
    const category: Category = new Category();
    category.name = createCategoryDto.name;
    return this.categoryRepository.save(category);
  }

  async findAllCategory(): Promise<{ categories: Category[]; total: number }> {
    const categories = await this.categoryRepository.find();
    if (!categories || !categories.length) {
      throw new NotFoundException('Categories not found');
    }
    const total = categories.length;
    return { categories, total };
  }

  async findOneCategory(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async updateCategory(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOneCategory(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    const existingCategory = await this.categoryRepository.findOne({
      where: {
        name: updateCategoryDto.name,
      },
    });
    if (existingCategory) {
      throw new ConflictException('Category with this name already exists');
    }
    category.name = updateCategoryDto.name;
    return this.categoryRepository.save(category);
  }

  async removeCategory(id: number) {
    const category = await this.findOneCategory(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return this.categoryRepository.delete({ id });
  }
}
