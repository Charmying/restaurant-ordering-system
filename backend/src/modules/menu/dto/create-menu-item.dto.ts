import { IsString, IsNumber, IsArray, IsBoolean, IsOptional, IsNotEmpty, IsEnum, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CustomFieldType } from '../enums/custom-field-type.enum';

export class CustomFieldOptionDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsNumber()
  @Min(0)
  price: number;
}

export class CustomFieldDto {
  @IsString()
  @IsNotEmpty()
  name: string;

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
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  description?: string = '';

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
