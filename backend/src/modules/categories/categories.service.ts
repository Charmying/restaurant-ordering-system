import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryOrder, CategoryOrderDocument } from './schemas/category-order.schema';
import { MenuItem, MenuItemDocument } from '../menu/schemas/menu-item.schema';
import { UpdateCategoryOrderDto } from './dto/update-category-order.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(CategoryOrder.name)
    private readonly categoryOrderModel: Model<CategoryOrderDocument>,
    @InjectModel(MenuItem.name)
    private readonly menuItemModel: Model<MenuItemDocument>,
  ) {}

  async getOrder(): Promise<string[]> {
    const doc = await this.categoryOrderModel.findOne().lean();
    return doc?.categories ?? [];
  }

  async updateOrder(dto: UpdateCategoryOrderDto): Promise<string[]> {
    const doc = await this.categoryOrderModel.findOneAndUpdate(
      {},
      { categories: dto.categories },
      { new: true, upsert: true },
    );

    const bulkOps = dto.categories.map((category, index) => ({
      updateMany: {
        filter: { category },
        update: { categoryOrder: index },
      },
    }));

    if (bulkOps.length > 0) await this.menuItemModel.bulkWrite(bulkOps);
    return doc.categories;
  }
}
