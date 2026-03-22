import { IsInt, Min } from 'class-validator';

export class CreateServiceCallDto {
  @IsInt() @Min(1) tableNumber: number;
}
