import { IsObject, IsNumber, IsBoolean, IsOptional, IsNotEmpty, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import type { LocalizedString } from '../../../common/types/i18n.types';

export class LocalizedStringDto {
  @IsString()
  @IsOptional()
  zh?: string = '';

  @IsString()
  @IsOptional()
  en?: string = '';
}

export class CreateStoreInfoDto {
  @IsObject() @IsNotEmpty() @ValidateNested() @Type(() => LocalizedStringDto) label: LocalizedString;
  @IsObject() @IsNotEmpty() @ValidateNested() @Type(() => LocalizedStringDto) value: LocalizedString;
  @IsOptional() @IsNumber() order?: number = 0;
  @IsOptional() @IsBoolean() isStoreName?: boolean = false;
  @IsOptional() @IsBoolean() isDeletable?: boolean = true;
}
