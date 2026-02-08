import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../modules/users/schemas/user.schema';
import { Table, TableSchema } from '../modules/tables/schemas/table.schema';
import { SeedService } from './seed.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Table.name, schema: TableSchema },
    ]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
