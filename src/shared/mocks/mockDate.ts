import moment from "moment";

export const nowStr = "2021-01-01T00:00:00.000Z";
export const spyOnDate = () => {
  jest.useFakeTimers();
  jest
    .spyOn(global.Date, "now")
    .mockImplementation(() => new Date(nowStr).valueOf());
  jest.setSystemTime(new Date(nowStr));
};
export const now = new Date(nowStr);
