import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceCall, ServiceCallSchema } from './schemas/service-call.schema';
import { ServiceCallsService } from './service-calls.service';
import { ServiceCallsController } from './service-calls.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: ServiceCall.name, schema: ServiceCallSchema }])],
  controllers: [ServiceCallsController],
  providers: [ServiceCallsService],
})
export class ServiceCallsModule {}
