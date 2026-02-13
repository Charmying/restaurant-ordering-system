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
    const existing = doc?.categories ?? [];
    const derived = await this.buildOrderedCategories();

    if (!existing.length && !derived.length) return [];
    if (!derived.length) return existing;

    const merged = this.mergeCategories(existing, derived);

    if (merged.length !== existing.length) {
      await this.categoryOrderModel.findOneAndUpdate(
        {},
        { categories: merged },
        { new: true, upsert: true },
      );
    }

    return merged;
  }

  async updateOrder(dto: UpdateCategoryOrderDto): Promise<string[]> {
    const derived = await this.buildOrderedCategories();
    const merged = this.mergeCategories(dto.categories, derived);

    const doc = await this.categoryOrderModel.findOneAndUpdate(
      {},
      { categories: merged },
      { new: true, upsert: true },
    );

    const bulkOps = merged.map((category, index) => ({
      updateMany: {
        filter: { category },
        update: { categoryOrder: index },
      },
    }));

    if (bulkOps.length > 0) await this.menuItemModel.bulkWrite(bulkOps);
    return doc.categories;
  }

  async syncFromMenuItems(): Promise<string[]> {
    const ordered = await this.buildOrderedCategories();

    if (ordered.length) {
      await this.categoryOrderModel.findOneAndUpdate(
        {},
        { categories: ordered },
        { new: true, upsert: true },
      );
    }

    return ordered;
  }

  private async buildOrderedCategories(): Promise<string[]> {
    const items = await this.menuItemModel
      .find({}, { category: 1, categoryOrder: 1, name: 1 })
      .sort({ categoryOrder: 1, name: 1 })
      .lean();

    const ordered: string[] = [];
    const seen = new Set<string>();

    for (const item of items) {
      for (const category of item.category ?? []) {
        if (!category || seen.has(category)) continue;
        seen.add(category);
        ordered.push(category);
      }
    }

    return ordered;
  }

  private mergeCategories(primary: string[], secondary: string[]): string[] {
    const merged = [...primary];
    const seen = new Set(primary);
    for (const category of secondary) {
      if (!category || seen.has(category)) continue;
      seen.add(category);
      merged.push(category);
    }
    return merged;
  }
}
