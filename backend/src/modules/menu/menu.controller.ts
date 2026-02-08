import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';

@ApiTags('Menu')
@Controller('menu')
export class MenuController {
  constructor(private menuService: MenuService) {}

  @Public()
  @Get()
  findPublic() { return this.menuService.findAllPublic(); }

  @Public()
  @Get(':id')
  findById(@Param('id') id: string) { return this.menuService.findById(id); }

  @ApiBearerAuth()
  @Roles(UserRole.Manager)
  @Get('admin/all')
  findAll() { return this.menuService.findAll(); }

  @ApiBearerAuth()
  @Roles(UserRole.Manager)
  @Post()
  create(@Body() dto: CreateMenuItemDto) { return this.menuService.create(dto); }

  @ApiBearerAuth()
  @Roles(UserRole.Manager)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMenuItemDto) { return this.menuService.update(id, dto); }

  @ApiBearerAuth()
  @Roles(UserRole.Manager)
  @Delete(':id')
  remove(@Param('id') id: string) { return this.menuService.remove(id); }
}
