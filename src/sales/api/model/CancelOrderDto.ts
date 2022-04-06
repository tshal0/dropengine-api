export class CancelOrderRequesterDto {
  name: string;
  email: string;
}

export class CancelOrderDto {
  cancelledAt: Date;
  requestedBy: CancelOrderRequesterDto;
}
