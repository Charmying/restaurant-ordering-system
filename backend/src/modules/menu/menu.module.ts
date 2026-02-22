import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MenuItem, MenuItemSchema } from './schemas/menu-item.schema';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { CategoriesModule } from '../categories/categories.module';
import { MenuMigrationService } from './menu-migration.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: MenuItem.name, schema: MenuItemSchema }]), CategoriesModule],
  controllers: [MenuController],
  providers: [MenuService, MenuMigrationService],
  exports: [MenuService, MenuMigrationService],
})
export class MenuModule {}
