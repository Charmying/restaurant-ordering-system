import { PartialType } from '@nestjs/swagger';
import { CreateStoreInfoDto } from './create-store-info.dto';

export class UpdateStoreInfoDto extends PartialType(CreateStoreInfoDto) {}
