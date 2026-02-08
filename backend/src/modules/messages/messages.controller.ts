import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';

@ApiTags('Messages')
@ApiBearerAuth()
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  findAll() {
    return this.messagesService.findAll();
  }

  @Post()
  create(@Body() dto: CreateMessageDto, @CurrentUser() user: JwtPayload) {
    return this.messagesService.create(dto.content, user);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateMessageDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.messagesService.update(id, dto.content, userId);
  }

  @Roles(UserRole.Manager)
  @Put(':id/pin')
  pin(@Param('id') id: string) {
    return this.messagesService.setPinned(id, true);
  }

  @Roles(UserRole.Manager)
  @Put(':id/unpin')
  unpin(@Param('id') id: string) {
    return this.messagesService.setPinned(id, false);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.messagesService.remove(id, user);
  }

  @Roles(UserRole.Superadmin)
  @Delete('all')
  removeAll(@CurrentUser() user: JwtPayload) {
    return this.messagesService.removeAll(user);
  }
}
