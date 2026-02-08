import { IsNumber, IsArray, IsString, IsInt, IsOptional, IsNotEmpty, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsString() @IsNotEmpty() menuItemId: string;
  @IsString() @IsNotEmpty() name: string;
  @IsNumber() @Min(0) price: number;
  @IsInt() @Min(1) quantity: number;
  @IsOptional() customization?: Record<string, unknown>;
  @IsNumber() @Min(0) subtotal: number;
}

export class CreateOrderDto {
  @IsInt() @Min(1) tableNumber: number;
  @IsArray() @ValidateNested({ each: true }) @Type(() => OrderItemDto) items: OrderItemDto[];
  @IsNumber() @Min(0) total: number;
  @IsString() @IsNotEmpty() token: string;
}
