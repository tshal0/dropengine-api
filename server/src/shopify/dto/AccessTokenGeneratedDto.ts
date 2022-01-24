import { UUID } from '@shared/domain/ValueObjects';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class AccessTokenGeneratedDto {
  access_token: string;
  scope: string;
}
