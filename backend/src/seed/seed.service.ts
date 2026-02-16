import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../modules/users/schemas/user.schema';
import { Table, TableDocument } from '../modules/tables/schemas/table.schema';
import { StoreInfo, StoreInfoDocument } from '../modules/store-info/schemas/store-info.schema';
import { TableStatus } from 'src/modules/tables/enums/table-status.enum';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Table.name) private tableModel: Model<TableDocument>,
    @InjectModel(StoreInfo.name) private storeInfoModel: Model<StoreInfoDocument>,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    await this.seedTables();
    await this.seedSuperAdmin();
    await this.seedStoreName();
  }

  private async seedTables() {
    const count = await this.tableModel.countDocuments();
    if (count > 0) return;

    const tables = Array.from({ length: 10 }, (_, i) => ({
      tableNumber: i + 1,
      status: TableStatus.Available,
    }));
    await this.tableModel.insertMany(tables);
    this.logger.log('Seeded 10 tables');
  }

  private async seedSuperAdmin() {
    const existing = await this.userModel.findOne({ role: 'superadmin' });
    const username = this.configService.get<string>('SUPERADMIN_USERNAME', 'Charmy');
    const password = this.configService.get<string>('SUPERADMIN_PASSWORD', 'Charmying');
    const shouldReset = this.configService.get<boolean>('RESET_SUPERADMIN', false);

    if (existing && !shouldReset) return;

    if (existing) {
      existing.username = username;
      existing.password = password;
      await existing.save();
      this.logger.log('Reset superadmin user credentials');
      return;
    }

    await this.userModel.create({
      username,
      password,
      role: 'superadmin',
    });
    this.logger.log('Seeded superadmin user');
  }

  private async seedStoreName() {
    const existing = await this.storeInfoModel.findOne({ isStoreName: true });
    if (existing) return;

    await this.storeInfoModel.create({
      label: '店名',
      value: '餐廳點餐系統',
      order: 0,
      isStoreName: true,
      isDeletable: false,
    });
    this.logger.log('Seeded default store name');
  }
}
