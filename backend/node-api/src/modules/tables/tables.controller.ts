import { Controller, Get, Post, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TablesService } from './tables.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Tables')
@ApiBearerAuth()
@Controller('tables')
export class TablesController {
  constructor(private tablesService: TablesService) {}

  @Get()
  findAll() {
    return this.tablesService.findAll();
  }

  @Post(':tableNumber/activate')
  activate(@Param('tableNumber', ParseIntPipe) n: number) {
    return this.tablesService.activate(n);
  }

  @Post(':tableNumber/checkout')
  startCheckout(@Param('tableNumber', ParseIntPipe) n: number) {
    return this.tablesService.startCheckout(n);
  }

  @Public()
  @Get(':tableNumber/orders')
  getOrders(@Param('tableNumber', ParseIntPipe) n: number) {
    return this.tablesService.getOrders(n);
  }

  @Post(':tableNumber/complete-checkout')
  completeCheckout(@Param('tableNumber', ParseIntPipe) n: number) {
    return this.tablesService.completeCheckout(n);
  }

  @Post(':tableNumber/force-reset')
  forceReset(@Param('tableNumber', ParseIntPipe) n: number) {
    return this.tablesService.forceReset(n);
  }
}
