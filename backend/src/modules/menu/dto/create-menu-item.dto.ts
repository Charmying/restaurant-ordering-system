import { IsString, IsNumber, IsArray, IsBoolean, IsOptional, IsNotEmpty, IsEnum, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CustomFieldType } from '../enums/custom-field-type.enum';

export class LocalizedStringDto {
  @IsString()
  @IsNotEmpty()
  zh!: string;

  @IsString()
  @IsNotEmpty()
  en!: string;
}

export class CustomFieldOptionDto {
  @ValidateNested()
  @Type(() => LocalizedStringDto)
  label!: LocalizedStringDto;

  @IsNumber()
  @Min(0)
  price: number;
}

export class CustomFieldDto {
  @ValidateNested()
  @Type(() => LocalizedStringDto)
  name!: LocalizedStringDto;

  @IsEnum(CustomFieldType)
  type: CustomFieldType;

  @IsOptional()
  @IsBoolean()
  required?: boolean = false;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomFieldOptionDto)
  options: CustomFieldOptionDto[];
}

export class CreateMenuItemDto {
  @ValidateNested()
  @Type(() => LocalizedStringDto)
  name!: LocalizedStringDto;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedStringDto)
  description?: LocalizedStringDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  category?: string[] = [];

  @IsOptional()
  @IsNumber()
  categoryOrder?: number = 0;

  @IsOptional()
  @IsString()
  image?: string = '';

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomFieldDto)
  customFields?: CustomFieldDto[] = [];

  @IsOptional()
  @IsBoolean()
  available?: boolean = true;
}
