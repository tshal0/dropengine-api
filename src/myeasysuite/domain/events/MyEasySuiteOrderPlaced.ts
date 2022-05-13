import { IMyEasySuiteOrder } from "../IMyEasySuiteOrder";
import {
  MyEasySuiteOrderEvent,
  MyEasySuiteOrderEventName,
} from "./MyEasySuiteOrderEvent";

export class MyEasySuiteOrderPlaced extends MyEasySuiteOrderEvent<IMyEasySuiteOrder> {
  constructor(aggId: string, details: IMyEasySuiteOrder) {
    super(
      aggId,
      MyEasySuiteOrderPlaced.name,
      MyEasySuiteOrderEventName.OrderPlaced,
      details
    );
  }
}
