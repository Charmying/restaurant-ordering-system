import { IsString, IsNumber, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateStoreInfoDto {
  @IsString() @IsNotEmpty() label: string;
  @IsString() @IsNotEmpty() value: string;
  @IsOptional() @IsNumber() order?: number = 0;
  @IsOptional() @IsBoolean() isStoreName?: boolean = false;
  @IsOptional() @IsBoolean() isDeletable?: boolean = true;
}
