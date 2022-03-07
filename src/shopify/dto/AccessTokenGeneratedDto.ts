import { UUID } from '@shared/domain/valueObjects';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class AccessTokenGeneratedDto {
  access_token: string;
  scope: string;
}
