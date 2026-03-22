import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StoreInfo, StoreInfoDocument } from './schemas/store-info.schema';
import { CreateStoreInfoDto } from './dto/create-store-info.dto';
import { UpdateStoreInfoDto } from './dto/update-store-info.dto';

@Injectable()
export class StoreInfoService {
  constructor(
    @InjectModel(StoreInfo.name)
    private readonly model: Model<StoreInfoDocument>,
  ) {}

  findAll() {
    return this.model.find().sort({ order: 1 });
  }

  create(dto: CreateStoreInfoDto) {
    return this.model.create({
      label: dto.label,
      value: dto.value,
      order: dto.order ?? 0,
      isStoreName: dto.isStoreName ?? false,
      isDeletable: dto.isDeletable ?? true,
    });
  }

  async update(id: string, dto: UpdateStoreInfoDto) {
    const existing = await this.model.findById(id);
    if (!existing) throw new NotFoundException('Store info not found');

    const updatePayload: Partial<UpdateStoreInfoDto> = {};
    if (dto.label !== undefined) updatePayload.label = dto.label;
    if (dto.value !== undefined) updatePayload.value = dto.value;

    const doc = await this.model.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    });

    return doc;
  }

  async remove(id: string) {
    const result = await this.model.deleteOne({
      _id: id,
      isDeletable: true,
    });

    if (result.deletedCount === 0) {
      const exists = await this.model.exists({ _id: id });
      if (!exists) throw new NotFoundException('Store info not found');
      throw new ForbiddenException('This item cannot be deleted');
    }
  }
}
