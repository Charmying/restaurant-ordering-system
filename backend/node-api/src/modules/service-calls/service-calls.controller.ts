import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ServiceCallsService } from './service-calls.service';
import { CreateServiceCallDto } from './dto/create-service-call.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';

@ApiTags('Service Calls')
@Controller('service-calls')
export class ServiceCallsController {
  constructor(private readonly serviceCallsService: ServiceCallsService) {}

  @Public()
  @Post()
  create(@Body() dto: CreateServiceCallDto) {
    return this.serviceCallsService.create(dto);
  }

  @ApiBearerAuth()
  @Roles(UserRole.Employee)
  @Get('pending')
  findPending() {
    return this.serviceCallsService.findPending();
  }

  @ApiBearerAuth()
  @Roles(UserRole.Employee)
  @Put(':id/handle')
  handle(@Param('id') id: string) {
    return this.serviceCallsService.handle(id);
  }
}
