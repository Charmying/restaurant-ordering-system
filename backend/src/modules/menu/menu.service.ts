import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MenuItem, MenuItemDocument } from './schemas/menu-item.schema';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { EventsService } from '../events/events.service';
import { MenuDomainEvent } from './menu.events';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class MenuService {
  constructor(
    @InjectModel(MenuItem.name)
    private readonly menuItemModel: Model<MenuItemDocument>,
    private readonly eventsService: EventsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  findAllPublic() {
    return this.menuItemModel.find({ available: true }).sort({ categoryOrder: 1, createdAt: -1 });
  }

  findAll() {
    return this.menuItemModel.find().sort({ categoryOrder: 1, createdAt: -1 });
  }

  async findById(id: string) {
    const item = await this.menuItemModel.findById(id);
    if (!item) throw new NotFoundException('Menu item not found');
    return item;
  }

  async create(dto: CreateMenuItemDto) {
    const item = await this.menuItemModel.create(dto);
    this.eventsService.emit(MenuDomainEvent.MenuCreated, { id: item._id, name: item.name });
    return item;
  }

  async update(id: string, dto: UpdateMenuItemDto) {
    const item = await this.menuItemModel.findByIdAndUpdate(id, dto, { new: true, runValidators: true });
    if (!item) throw new NotFoundException('Menu item not found');
    this.eventsService.emit(MenuDomainEvent.MenuUpdated, { id: item._id });
    await this.categoriesService.cleanupEmptyCategories();
    return item;
  }

  async remove(id: string) {
    const item = await this.menuItemModel.findByIdAndDelete(id);
    if (!item) throw new NotFoundException('Menu item not found');
    this.eventsService.emit(MenuDomainEvent.MenuDeleted, { id });
    await this.categoriesService.cleanupEmptyCategories();
  }
}
