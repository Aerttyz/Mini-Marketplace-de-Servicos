import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600)
  findAll() {
    return this.categoriesService.findAll();
  }
}
