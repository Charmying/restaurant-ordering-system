import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { Table, TableDocument } from '../tables/schemas/table.schema';
import { EventsGateway } from '../events/events.gateway';
import { CreateOrderDto } from './dto/create-order.dto';
import { ReportsQueryDto } from './dto/reports-query.dto';
import { OrderStatus } from './enums/order-status.enum';
import { TableStatus } from '../tables/enums/table-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Table.name) private tableModel: Model<TableDocument>,
    private eventsGateway: EventsGateway,
  ) {}

  async create(dto: CreateOrderDto) {
    const table = await this.tableModel.findOne({ tableNumber: dto.tableNumber });
    if (!table || table.status !== TableStatus.Occupied || table.qrCodeToken !== dto.token) throw new BadRequestException('Invalid table or token');

    const order = await this.orderModel.create({ ...dto, status: OrderStatus.Pending });
    this.eventsGateway.emit('order:created', order);
    return order;
  }

  findPending() {
    return this.orderModel.find({ status: OrderStatus.Pending }).sort({ createdAt: 1 });
  }

  findServed() {
    return this.orderModel.find({ status: OrderStatus.Served }).sort({ createdAt: 1 });
  }

  findAll() {
    return this.orderModel.find().sort({ createdAt: -1 });
  }

  async markServed(id: string) {
    const order = await this.orderModel.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== OrderStatus.Pending) throw new BadRequestException('Only pending orders can be served');

    order.status = OrderStatus.Served;
    await order.save();

    this.eventsGateway.emit('order:served', order);
    return order;
  }

  async complete(id: string) {
    const order = await this.orderModel.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== OrderStatus.Served) throw new BadRequestException('Only served orders can be completed');

    order.status = OrderStatus.Completed;
    order.completedAt = new Date();
    await order.save();

    this.eventsGateway.emit('order:completed', order);
    return order;
  }

  async cancel(id: string) {
    const order = await this.orderModel.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    if (order.status === OrderStatus.Completed) throw new BadRequestException('Completed orders cannot be cancelled');

    order.status = OrderStatus.Cancelled;
    await order.save();

    this.eventsGateway.emit('order:cancelled', order);
    return order;
  }

  async getReports(query: ReportsQueryDto) {
    const dateFilter = this.buildDateFilter(query);

    const [orders, summary] = await Promise.all([
      this.orderModel.find({ status: OrderStatus.Completed, ...dateFilter }).sort({ completedAt: -1 }),

      this.orderModel.aggregate([
        { $match: { status: OrderStatus.Completed, ...dateFilter } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$total' },
            totalOrders: { $sum: 1 },
            avgOrderValue: { $avg: '$total' },
          },
        },
      ]),
    ]);

    return {
      orders,
      summary: summary[0] ?? {
        totalRevenue: 0,
        totalOrders: 0,
        avgOrderValue: 0,
      },
    };
  }

  resetAll() {
    return this.orderModel.deleteMany({}).then(() => ({
      message: 'All orders reset',
    }));
  }

  private buildDateFilter(query: ReportsQueryDto): Record<string, unknown> {
    const now = new Date();

    switch (query.period) {
      case 'today':
        return {
          completedAt: {
            $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
          },
        };
      case 'week':
        return { completedAt: { $gte: new Date(now.getTime() - 7 * 86400000) } };
      case 'month':
        return { completedAt: { $gte: new Date(now.getTime() - 30 * 86400000) } };
      case 'custom':
        if (!query.startDate || !query.endDate) return {};
        return {
          completedAt: {
            $gte: new Date(query.startDate),
            $lte: new Date(query.endDate),
          },
        };
      default:
        return {};
    }
  }
}
