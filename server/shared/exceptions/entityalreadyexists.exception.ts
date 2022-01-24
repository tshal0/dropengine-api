import { BadRequestException } from '@nestjs/common';

export class EntityAlreadyExistsException extends BadRequestException {
  constructor(message: string, id: string) {
    var response = {
      id: id,
      message: message,
      error: `ENTITY_ALREADY_EXISTS`,
    };
    super(response, message);
  }
}
