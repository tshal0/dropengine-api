import moment from "moment";

export function getDefaultEndDate(): any {
  return moment().endOf("day").toDate();
}

export function getDefaultStartDate(): any {
  return moment().subtract(30, "days").startOf("day").toDate();
}
