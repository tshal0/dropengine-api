import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, ValidateNested } from "class-validator";

export class CancelOrderRequesterDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  email: string;
}

export class CancelOrderDto {
  @IsNotEmpty()
  @IsDate()
  cancelledAt: Date;
  @Type(() => CancelOrderRequesterDto)
  @ValidateNested()
  @IsNotEmpty()
  requestedBy: CancelOrderRequesterDto;
}
