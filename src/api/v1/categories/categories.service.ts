import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category: Category = new Category();
    category.name = createCategoryDto.name;
    return this.categoryRepository.save(category);
  }

  findAllCategory(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  findOneCategory(id: number) {
    return this.categoryRepository.findOneBy({ id });
  }

  updateCategory(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category: Category = new Category();
    category.name = updateCategoryDto.name;
    category.id = id;
    return this.categoryRepository.save(category);
  }

  removeCategory(id: number) {
    return this.categoryRepository.delete({ id });
  }
}
