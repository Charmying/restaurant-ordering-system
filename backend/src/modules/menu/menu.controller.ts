import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { MenuMigrationService } from './menu-migration.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import type { MigrationResult } from './menu-migration.types';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';

@ApiTags('Menu')
@Controller('menu')
export class MenuController {
  constructor(
    private readonly menuService: MenuService,
    private readonly migrationService: MenuMigrationService
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all available menu items' })
  @ApiResponse({ status: 200, description: 'List of available menu items' })
  async findPublic() {
    return this.menuService.findAllPublic();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get menu item by ID' })
  @ApiResponse({ status: 200, description: 'Menu item details' })
  @ApiResponse({ status: 404, description: 'Menu item not found' })
  async findById(@Param('id') id: string) {
    return this.menuService.findById(id);
  }

  @ApiBearerAuth()
  @Roles(UserRole.Manager, UserRole.Superadmin)
  @Get('admin/all')
  @ApiOperation({ summary: 'Get all menu items (admin)' })
  @ApiResponse({ status: 200, description: 'List of all menu items' })
  async findAll() {
    return this.menuService.findAll();
  }

  @ApiBearerAuth()
  @Roles(UserRole.Superadmin)
  @Post('admin/migrate-to-localized')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Migrate menu items to localized format (one-time)' })
  @ApiResponse({ status: 200, description: 'Migration completed', schema: { properties: { success: { type: 'boolean' }, count: { type: 'number' }, error: { type: 'string' } } } })
  async migrateToLocalized(): Promise<MigrationResult> {
    return this.migrationService.migrateMenuItemsToLocalizedString();
  }

  @ApiBearerAuth()
  @Roles(UserRole.Manager, UserRole.Superadmin)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new menu item' })
  @ApiResponse({ status: 201, description: 'Menu item created' })
  async create(@Body() dto: CreateMenuItemDto) {
    return this.menuService.create(dto);
  }

  @ApiBearerAuth()
  @Roles(UserRole.Manager, UserRole.Superadmin)
  @Put(':id')
  @ApiOperation({ summary: 'Update menu item' })
  @ApiResponse({ status: 200, description: 'Menu item updated' })
  @ApiResponse({ status: 404, description: 'Menu item not found' })
  async update(@Param('id') id: string, @Body() dto: UpdateMenuItemDto) {
    return this.menuService.update(id, dto);
  }

  @ApiBearerAuth()
  @Roles(UserRole.Manager, UserRole.Superadmin)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete menu item' })
  @ApiResponse({ status: 204, description: 'Menu item deleted' })
  @ApiResponse({ status: 404, description: 'Menu item not found' })
  async remove(@Param('id') id: string) {
    return this.menuService.remove(id);
  }
}
