import { IsOptional, IsEnum, IsString } from 'class-validator';

export class ReportsQueryDto {
  @IsOptional() @IsEnum(['today', 'week', 'month', 'custom', 'all']) period?: string = 'today';
  @IsOptional() @IsString() startDate?: string;
  @IsOptional() @IsString() endDate?: string;
}
