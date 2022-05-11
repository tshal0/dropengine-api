import moment from "moment";
import { v4 as uuidv4 } from "uuid";

export abstract class DomainEvent<T> {
  constructor(
    aggType: string,
    aggId: string,
    evType: string,
    evName: string,
    details: T,
    evVer: string,
    aggVer?: number | undefined
  ) {
    this.eventId = uuidv4();
    this.timestamp = moment().toDate();

    this.eventName = evName;
    this.eventType = evType;
    this.eventVersion = evVer;

    this.aggregateType = aggType;
    this.aggregateId = aggId;
    this.aggregateVersion = aggVer;
    this.details = details;
  }
  public eventId: string;
  public eventName: string;
  public eventType: string;
  public eventVersion: string;
  public details: T;
  public aggregateType: string;
  public aggregateId: string;
  public aggregateVersion?: number | undefined;
  public timestamp: Date;
}
