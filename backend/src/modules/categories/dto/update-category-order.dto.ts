import { IsArray, IsString, ArrayMinSize } from 'class-validator';

export class UpdateCategoryOrderDto {
  @IsArray() @IsString({ each: true }) @ArrayMinSize(1)
  categories: string[];
}
