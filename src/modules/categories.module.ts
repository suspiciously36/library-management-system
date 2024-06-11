import { Module } from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { CategoriesController } from '../controllers/categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
