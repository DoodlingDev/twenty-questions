import arrangeValues from "../../src/utils/arrangeValues";

const testValues = {
  "apple.orange.banana": "fruit",
  "celery.broccoli": "vegetable",
  "one.two.three": 123,
  "one.two.three.four.five": 12345,
  thisIsTrue: true,
  thisIsFalse: false,
  "in.an.array": {},
  "in.an.array.0.indexed": "zero indexed",
  "in.an.array.1.indexed": "one indexed",
  "in.aDifferent._array": {},
  "in.aDifferent._array.0.object": {},
  "in.aDifferent._array.0.object.string": "string",
  "in.aDifferent._array.0.object.number": 0,
  "in.aDifferent._array.1.object": {},
  "in.aDifferent._array.1.object.string": "string",
  "in.aDifferent._array.1.object.number": 1,
  "in.aDifferent._array.2.object": {},
  "in.aDifferent._array.2.object.string": "string",
  "in.aDifferent._array.2.object.number": 2,
};

describe("arrangeValues", () => {
  it("returns flat records for endpoint only values", () => {
    const shape = [
      {
        name: "banana",
        validates: undefined,
      },
      {
        name: "three",
        validates: undefined,
      },
      {
        name: "thisIsFalse",
        validates: undefined,
      },
    ];
    const result = arrangeValues({ values: testValues, submitShape: shape });
    expect(Object.keys(result).length).toBe(3);
    let foundNested = false;
    for (let key in result) {
      if (typeof result[key] === "object") {
        foundNested = true;
      }
    };
    expect(foundNested).toBe(false);
  });

  it("returns records structured correctly for arrays", () => {
    const shape = [
      {
        name: "_array",
        validates: undefined,
        type: "array",
        children: [
          {
            name: "string",
            validates: undefined,
          },
          {
            name: "number",
            validates: undefined,
          },
        ],
      },
    ];
    const result = arrangeValues({ values: testValues, submitShape: shape });
    expect(Object.keys(result).length).toBe(1);
    expect(result[Object.keys(result)[0]].length).toBe(3);
  });

  it("returns keys as single field names not paths", () => {
    const shape = [
      {
        name: "banana",
        validates: undefined,
      },
      {
        name: "three",
        validates: undefined,
      },
      {
        name: "thisIsFalse",
        validates: undefined,
      },
    ];
    const result = arrangeValues({ values: testValues, submitShape: shape });
    const noDotsCheck = /\./;
    let foundDots = false;
    Object.keys(result).forEach(name => {
      if (noDotsCheck.test(name)) {
        foundDots = true;
      }
    });
    expect(foundDots).toBe(false);
  });
});
