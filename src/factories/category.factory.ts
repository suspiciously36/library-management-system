import { define } from 'typeorm-seeding';
import { Category } from '../entities/category.entity';
import { categoryData } from './data/category.data';

define(Category, (_, context: { index: number }) => {
  const category = new Category();
  category.name = categoryData[context.index].name;
  return category;
});
