import { Type } from "class-transformer";
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from "class-validator";

export class SortQueryDto {
  @IsNumber()
  @IsIn([-1, 1])
  @Type(() => Number)
  dir: number;
  @IsNotEmpty()
  by: string;
}

export class VariantQueryDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  $page: number = 0;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  $size: number = 100;

  @IsOptional()
  @IsIn(["ASC", "DESC"])
  @Type(() => String)
  $sortDir?: string;
  @IsOptional()
  $sortBy?: string;

  @IsOptional()
  productType?: string;
}
