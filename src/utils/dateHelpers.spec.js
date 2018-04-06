import * as dateHelpers from "./dateHelpers";
import moment from "moment";

describe("currentDateAsISOString", () => {
  it("should end up in ISOString format", () => {
    const dateResult = dateHelpers.currentDateAsISOString();
    expect(dateResult).toMatch(/\d{4}-\d{2}-.+:.+..+/);
  });
});

describe("momentToISOString", () => {
  it("should convert a moment object to its ISO string counterpart", () => {
    const mockMoment = {
      _isAMomentObject: true,
      _d: {
        toISOString: () => "2018-03-29T19:53:35.819Z",
      }
    };
    const dateResult = dateHelpers.momentToISOString(mockMoment);
    expect(dateResult).toEqual("2018-03-29T19:53:35.819Z");
  });

  it("should return argument if not a moment object", () => {
    const dateResult = dateHelpers.momentToISOString("2018-04-06T19:11:11.190Z");
    expect(dateResult).toEqual("2018-04-06T19:11:11.190Z");
  });
});

describe("datePickerValue", () => {
  it("should not change already formatted dates", () => {
    const dateResult = dateHelpers.datePickerValue("2018-03-29");
    expect(dateResult).toEqual("2018-03-29");
  });

  it("should convert moment string to the default date format", () => {
    const dateResult = dateHelpers.datePickerValue("2018-04-06T19:11:11.190Z");
    expect(dateResult).toEqual("2018-04-06");
  });
});

describe("onlyMomentJS", () => {
  it("should convert to moment object", () => {
    const rubrick = moment("2018-04-06T19:11:11.190Z");
    const dateResult = dateHelpers.onlyMomentJS("2018-04-06T19:11:11.190Z");
    expect(dateResult).toEqual(rubrick)
  });

  it("should not convert to moment object when string is not correctly formatted", () => {
    const dateResult = dateHelpers.onlyMomentJS("May 2, 1992");
    expect(dateResult).toEqual(null);
  });

  it("should return null if string is not a date", () => {
    const dateResult = dateHelpers.onlyMomentJS("purple");
    expect(dateResult).toEqual(null);
  });

  it("should return null if not passed a string", () => {
    const dateResult = dateHelpers.onlyMomentJS({});
    expect(dateResult).toEqual(null);
  });
});
