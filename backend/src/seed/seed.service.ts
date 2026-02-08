import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../modules/users/schemas/user.schema';
import { Table, TableDocument } from '../modules/tables/schemas/table.schema';
import { TableStatus } from 'src/modules/tables/enums/table-status.enum';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Table.name) private tableModel: Model<TableDocument>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    await this.seedTables();
    await this.seedSuperAdmin();
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
    if (existing) return;

    await this.userModel.create({
      username: 'Charmy',
      password: 'Charmying',
      role: 'superadmin',
    });
    this.logger.log('Seeded superadmin user');
  }
}
