import { BadRequestException } from '@nestjs/common';

export class EntityNotFoundException extends BadRequestException {
  constructor(message: string, id: string, error?: string) {
    const response = {
      id: id,
      message: message,
      error: error ?? `ENTITY_NOT_FOUND`,
    };
    super(response, message);
  }
}
