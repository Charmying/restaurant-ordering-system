import { Controller, Get, Put, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { UpdateCategoryOrderDto } from './dto/update-category-order.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Get('order')
  getOrder() {
    return this.categoriesService.getOrder();
  }

  @ApiBearerAuth()
  @Roles(UserRole.Manager)
  @Put('order')
  updateOrder(@Body() dto: UpdateCategoryOrderDto) {
    return this.categoriesService.updateOrder(dto);
  }
}
