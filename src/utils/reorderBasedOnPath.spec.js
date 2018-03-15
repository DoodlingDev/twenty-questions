import reorderBasedOnPath from "../../src/utils/reorderBasedOnPath";

describe("reorderBasedOnPath", () => {
  const arrayValue = {
    "testFormTitle.testName.testArray": {},
    "testFormTitle.testName.testArray.0.a": {},
    "testFormTitle.testName.testArray.0.a.one": "A",
    "testFormTitle.testName.testArray.0.a.two": "B",
    "testFormTitle.testName.testArray.2.a": {},
    "testFormTitle.testName.testArray.2.a.one": "AAA",
    "testFormTitle.testName.testArray.2.a.two": "BBB",
    "testFormTitle.testName.testArray.3.a": {},
    "testFormTitle.testName.testArray.3.a.one": "AAAA",
    "testFormTitle.testName.testArray.3.a.two": "BBBB",
  };

  it("should preserve data", () => {
    const result = reorderBasedOnPath({
      path: "testFormTitle.testName.testArray",
      state: arrayValue,
    });

    const allCorrect = (function() {
      for (let i = 0, l = arrayValue.length; i < l; i++) {
        if (
          result[`testFormTitle.testName.testArray.${i}.a.one`].length !==
          result[`testFormTitle.testName.testArray.${i}.a.two`].length
        )
          return false;

        if (
          !/A+/.test(result[`testFormTitle.testName.testArray.${i}.a.one`]) ||
          !/B+/.test(result[`testFormTitle.testName.testArray.${i}.a.two`])
        )
          return false;
      }
      return true;
    })();
    expect(Object.keys(result).length).toBe(Object.keys(arrayValue).length);
    expect(allCorrect).toBeTruthy();
  });

  it("should decrement the numbers properly", () => {
    const result = reorderBasedOnPath({
      path: "testFormTitle.testName.testArray",
      state: arrayValue,
    });
    const hasNoThrees = (function() {
      for (let keyName in result) {
        if (/3/.test(keyName)) return false;
      }
      return true;
    })();
    expect(Object.keys(result).length).toBe(Object.keys(arrayValue).length);
    expect(hasNoThrees).toBeTruthy();
  });

  it("should not remmove any rows if there are no gaps", () => {
    const arrayValue = {
      "testFormTitle.testName.testArray": {},
      "testFormTitle.testName.testArray.0.a": {},
      "testFormTitle.testName.testArray.0.a.one": "A",
      "testFormTitle.testName.testArray.0.a.two": "B",
      "testFormTitle.testName.testArray.1.a": {},
      "testFormTitle.testName.testArray.1.a.one": "AAA",
      "testFormTitle.testName.testArray.1.a.two": "BBB",
      "testFormTitle.testName.testArray.2.a": {},
      "testFormTitle.testName.testArray.2.a.one": "AAAA",
      "testFormTitle.testName.testArray.2.a.two": "BBBB",
    };
    const result = reorderBasedOnPath({
      path: "testFormTitle.testName.testArray",
      state: arrayValue,
    });
    expect(Object.keys(result).length).toBe(Object.keys(arrayValue).length);
  });

  it("should remove a duplicate row if it exists after reorder", () => {
    const arrayValue = {
      "testFormTitle.testName.testArray": {},
      "testFormTitle.testName.testArray.1.a": {},
      "testFormTitle.testName.testArray.1.a.one": "AAA",
      "testFormTitle.testName.testArray.1.a.two": "BBB",
      "testFormTitle.testName.testArray.2.a": {},
      "testFormTitle.testName.testArray.2.a.one": "AAAA",
      "testFormTitle.testName.testArray.2.a.two": "BBBB",
    };
    const result = reorderBasedOnPath({
      path: "testFormTitle.testName.testArray",
      state: arrayValue,
    });
    expect(Object.keys(result).length).toBe(Object.keys(arrayValue).length);
  });
});
