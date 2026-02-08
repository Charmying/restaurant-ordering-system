import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ReportsQueryDto } from './dto/reports-query.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';


@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Public() @Post()
  create(@Body() dto: CreateOrderDto) { return this.ordersService.create(dto); }

  @ApiBearerAuth() @Get('pending')
  findPending() { return this.ordersService.findPending(); }

  @ApiBearerAuth() @Get('served')
  findServed() { return this.ordersService.findServed(); }

  @ApiBearerAuth() @Roles(UserRole.Manager) @Get('reports')
  getReports(@Query() query: ReportsQueryDto) { return this.ordersService.getReports(query); }

  @ApiBearerAuth() @Get()
  findAll() { return this.ordersService.findAll(); }

  @ApiBearerAuth() @Put(':id/serve')
  markServed(@Param('id') id: string) { return this.ordersService.markServed(id); }

  @ApiBearerAuth() @Put(':id/complete')
  complete(@Param('id') id: string) { return this.ordersService.complete(id); }

  @ApiBearerAuth() @Put(':id/cancel')
  cancel(@Param('id') id: string) { return this.ordersService.cancel(id); }

  @ApiBearerAuth() @Roles(UserRole.Superadmin) @Post('reset')
  resetAll() { return this.ordersService.resetAll(); }
}
