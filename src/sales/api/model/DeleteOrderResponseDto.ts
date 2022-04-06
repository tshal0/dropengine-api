import moment from "moment";
export class DeleteOrderResponseDto {
  message: string = `SalesOrder '${this.id}' has been deleted.`;
  timestamp: Date = moment().toDate();
  constructor(public id: string = `UNDEFINED`) {}
}
