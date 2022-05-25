import { IMyEasySuiteOrder } from "@myeasysuite/domain/IMyEasySuiteOrder";

export function extractOrderNumber(val: any) {
  let orderNumber = +val;
  if (!isNaN(orderNumber)) return orderNumber;
  const rawOrderNumber = val;
  var matches = rawOrderNumber.match(/(\d+)/);
  return matches ? +matches[0] : 0;
}
