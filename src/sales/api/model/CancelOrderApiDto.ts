import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, ValidateNested } from "class-validator";

export class CancelOrderRequesterApiDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  email: string;
}

export class CancelOrderApiDto {
  @IsNotEmpty()
  @IsDate()
  cancelledAt: Date;
  @Type(() => CancelOrderRequesterApiDto)
  @ValidateNested()
  @IsNotEmpty()
  requestedBy: CancelOrderRequesterApiDto;
}
