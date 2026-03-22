import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreInfo, StoreInfoSchema } from './schemas/store-info.schema';
import { StoreInfoService } from './store-info.service';
import { StoreInfoController } from './store-info.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: StoreInfo.name, schema: StoreInfoSchema }])],
  controllers: [StoreInfoController],
  providers: [StoreInfoService],
})
export class StoreInfoModule {}
