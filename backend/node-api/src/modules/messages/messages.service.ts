import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { EventsGateway } from '../events/events.gateway';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { UserRole } from '../users/enums/user-role.enum';
import { ROLE_HIERARCHY } from '../../common/constants/role-hierarchy';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name)
    private readonly model: Model<MessageDocument>,
    private readonly eventsGateway: EventsGateway,
  ) {}

  findAll() {
    return this.model.find().sort({ isPinned: -1, createdAt: -1 });
  }

  async create(content: string, user: JwtPayload) {
    const msg = await this.model.create({
      content,
      userId: user.userId,
      username: user.username,
    });

    this.eventsGateway.emit('newMessage', msg);
    return msg;
  }

  async update(id: string, content: string, userId: string) {
    const result = await this.model.findOneAndUpdate(
      { _id: id, userId },
      { content },
      { new: true },
    );

    if (!result) throw new ForbiddenException('Can only edit own messages');
    this.eventsGateway.emit('messageUpdated', result);
    return result;
  }

  async setPinned(id: string, isPinned: boolean) {
    const msg = await this.model.findByIdAndUpdate(
      id,
      { isPinned },
      { new: true },
    );

    if (!msg) throw new NotFoundException('Message not found');
    this.eventsGateway.emit('messagePinned', msg);
    return msg;
  }

  async remove(id: string, user: JwtPayload) {
    const canForceDelete = ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY[UserRole.Manager];
    const result = await this.model.deleteOne({
      _id: id,
      ...(canForceDelete ? {} : { userId: user.userId }),
    });

    if (result.deletedCount === 0) throw new ForbiddenException('Not authorized to delete this message');
    this.eventsGateway.emit('messageDeleted', { id });
  }

  async removeAll(user: JwtPayload) {
    if (user.role !== UserRole.Superadmin) throw new ForbiddenException('Only superadmin can delete all messages');
    await this.model.deleteMany({});
    this.eventsGateway.emit('allMessagesDeleted', {});
    return { message: 'All messages deleted' };
  }
}
