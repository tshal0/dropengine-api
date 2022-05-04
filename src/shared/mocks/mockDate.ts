import moment from "moment";

export const nowStr = "2021-01-01T00:00:00.000Z";
export const spyOnDate = () => {
  jest
    .spyOn(global.Date, "now")
    .mockImplementation(() => new Date(nowStr).valueOf());
};
export const now = new Date(nowStr);
