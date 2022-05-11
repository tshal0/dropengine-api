import moment from "moment";
import { v4 as uuidv4 } from "uuid";


export abstract class DomainEvent<T> {
  constructor(
    aggType: string,
    aggId: string,
    evType: string,
    evName: string,
    details: T
  ) {
    this.eventId = uuidv4();
    this.timestamp = moment().toDate();

    this.eventName = evName;
    this.eventType = evType;
    this.aggregateType = aggType;
    this.aggregateId = aggId;
    this.details = details;
  }
  public eventId: string;
  public eventName: string;
  public eventType: string;
  public details: T;
  public aggregateType: string;
  public aggregateId: string;
  public timestamp: Date;
}
