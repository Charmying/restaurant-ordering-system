import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { StoreInfoService } from './store-info.service';
import { CreateStoreInfoDto } from './dto/create-store-info.dto';
import { UpdateStoreInfoDto } from './dto/update-store-info.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';

@ApiTags('Store Info')
@Controller('store-info')
export class StoreInfoController {
  constructor(private storeInfoService: StoreInfoService) {}

  @Public() @Get()
  findAll() { return this.storeInfoService.findAll(); }

  @ApiBearerAuth() @Roles(UserRole.Manager) @Post()
  create(@Body() dto: CreateStoreInfoDto) { return this.storeInfoService.create(dto); }

  @ApiBearerAuth() @Roles(UserRole.Manager) @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStoreInfoDto) { return this.storeInfoService.update(id, dto); }

  @ApiBearerAuth() @Roles(UserRole.Superadmin) @Delete(':id')
  remove(@Param('id') id: string) { return this.storeInfoService.remove(id); }
}
