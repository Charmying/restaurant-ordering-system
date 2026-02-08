import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import * as QRCode from 'qrcode';
import { Table, TableDocument } from './schemas/table.schema';
import { Order, OrderDocument } from '../orders/schemas/order.schema';
import { TableStatus } from './enums/table-status.enum';
import { OrderStatus } from '../orders/enums/order-status.enum';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class TablesService {
  constructor(
    @InjectModel(Table.name) private tableModel: Model<TableDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private eventsGateway: EventsGateway,
    private configService: ConfigService,
  ) {}

  findAll() {
    return this.tableModel.find().sort({ tableNumber: 1 });
  }

  async activate(tableNumber: number) {
    const table = await this.tableModel.findOne({ tableNumber });
    if (!table) throw new NotFoundException('Table not found');
    if (table.status !== TableStatus.Available) throw new BadRequestException('Table is not available');

    const token = uuidv4();
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const qrCodeUrl = `${frontendUrl}/order?table=${tableNumber}&token=${token}`;
    const qrCodeImage = await QRCode.toDataURL(qrCodeUrl);

    Object.assign(table, {
      status: TableStatus.Occupied,
      qrCodeToken: token,
      qrCodeUrl,
      qrCodeImage,
      totalAmount: 0,
      orderItems: [],
    });

    await table.save();
    this.eventsGateway.emit('table:activated', { tableNumber });
    return table;
  }

  async startCheckout(tableNumber: number) {
    const table = await this.tableModel.findOne({ tableNumber });
    if (!table) throw new NotFoundException('Table not found');
    if (table.status !== TableStatus.Occupied) throw new BadRequestException('Table is not occupied');

    const orders = await this.orderModel.find({
      tableNumber,
      token: table.qrCodeToken,
      status: OrderStatus.Served,
    });

    table.status = TableStatus.Checkout;
    table.totalAmount = orders.reduce((sum, o) => sum + o.total, 0);
    table.orderItems = orders.map(o => o._id);

    await table.save();
    this.eventsGateway.emit('table:checkoutStarted', { tableNumber });
    return table;
  }

  async getOrders(tableNumber: number) {
    const table = await this.tableModel.findOne({ tableNumber });
    if (!table) throw new NotFoundException('Table not found');
    if (!table.qrCodeToken) return [];

    return this.orderModel
      .find({
        tableNumber,
        token: table.qrCodeToken,
        status: { $in: [OrderStatus.Pending, OrderStatus.Served] },
      })
      .sort({ createdAt: -1 });
  }

  async completeCheckout(tableNumber: number) {
    const table = await this.tableModel.findOne({ tableNumber });
    if (!table) throw new NotFoundException('Table not found');
    if (table.status !== TableStatus.Checkout) {
      throw new BadRequestException('Table is not in checkout');
    }

    await this.orderModel.updateMany(
      {
        tableNumber,
        token: table.qrCodeToken,
        status: OrderStatus.Served,
      },
      {
        status: OrderStatus.Completed,
        completedAt: new Date(),
      },
    );

    Object.assign(table, {
      status: TableStatus.Available,
      qrCodeToken: '',
      qrCodeUrl: '',
      qrCodeImage: '',
      totalAmount: 0,
      orderItems: [],
    });

    await table.save();
    this.eventsGateway.emit('table:checkoutCompleted', { tableNumber });
    return table;
  }

  async forceReset(tableNumber: number) {
    const table = await this.tableModel.findOne({ tableNumber });
    if (!table) throw new NotFoundException('Table not found');

    Object.assign(table, {
      status: TableStatus.Available,
      qrCodeToken: '',
      qrCodeUrl: '',
      qrCodeImage: '',
      totalAmount: 0,
      orderItems: [],
    });

    await table.save();
    this.eventsGateway.emit('table:forceReset', { tableNumber });
    return table;
  }
}
