import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
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
  private readonly logger = new Logger(MenuService.name);

  constructor(
    @InjectModel(MenuItem.name)
    private readonly menuItemModel: Model<MenuItemDocument>,
    private readonly eventsService: EventsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async findAllPublic() {
    try {
      return await this.menuItemModel.find({ available: true }).sort({ categoryOrder: 1, createdAt: -1 }).lean().exec();
    } catch (error) {
      this.logger.error('Failed to find public menu items', error);
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.menuItemModel.find().sort({ categoryOrder: 1, createdAt: -1 }).lean().exec();
    } catch (error) {
      this.logger.error('Failed to find all menu items', error);
      throw error;
    }
  }

  async findById(id: string) {
    this.validateMongoId(id);

    try {
      const item = await this.menuItemModel.findById(id).lean().exec();
      if (!item) throw new NotFoundException('Menu item not found');

      return item;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to find menu item by ID: ${id}`, error);
      throw error;
    }
  }

  async create(dto: CreateMenuItemDto) {
    this.validateCreateDto(dto);

    try {
      const item = await this.menuItemModel.create(dto);

      this.eventsService.emit(MenuDomainEvent.MenuCreated, {
        id: item._id,
        name: item.name,
      });

      return item;
    } catch (error) {
      this.logger.error('Failed to create menu item', error);
      throw error;
    }
  }

  async update(id: string, dto: UpdateMenuItemDto) {
    this.validateMongoId(id);

    try {
      const item = await this.menuItemModel.findByIdAndUpdate(id, dto, { new: true, runValidators: true }).exec();
      if (!item) throw new NotFoundException('Menu item not found');

      this.eventsService.emit(MenuDomainEvent.MenuUpdated, { id: item._id });

      if (dto.category) {
        await this.categoriesService.cleanupEmptyCategories();
      }

      return item;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to update menu item: ${id}`, error);
      throw error;
    }
  }

  async remove(id: string) {
    this.validateMongoId(id);

    try {
      const item = await this.menuItemModel.findByIdAndDelete(id).exec();
      if (!item) throw new NotFoundException('Menu item not found');

      this.eventsService.emit(MenuDomainEvent.MenuDeleted, { id });

      await this.categoriesService.cleanupEmptyCategories();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to delete menu item: ${id}`, error);
      throw error;
    }
  }

  private validateMongoId(id: string): void {
    if (!id || id.length !== 24 || !/^[0-9a-f]{24}$/i.test(id)) throw new BadRequestException('Invalid menu item ID format');
  }

  private validateCreateDto(dto: CreateMenuItemDto): void {
    if (!dto.name?.zh?.trim()) throw new BadRequestException('Menu item name (zh) is required');
    if (!dto.name?.en?.trim()) throw new BadRequestException('Menu item name (en) is required');
    if (typeof dto.price !== 'number' || dto.price <= 0) throw new BadRequestException('Menu item price must be greater than 0');
  }
}
