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
  "in.an.object": {},
  "in.an.object.object1": "one",
  "in.an.object.object2": "two",
  "in.another.objectType": {},
  "in.another.objectType.childObject": {},
  "in.another.objectType.childObject.object1": "one",
  "in.another.objectType.childObject.object2": "two",
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
    }
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

  it("returns object properties correctly", () => {
    const shape = [
      {
        name: "object",
        validates: undefined,
        type: "object",
        children: [
          {
            name: "object1",
            validates: undefined,
          },
          {
            name: "object2",
            validates: undefined,
          },
        ],
      },
    ];
    const result = arrangeValues({ values: testValues, submitShape: shape });
    console.log(result);
    expect(Object.keys(result).length).toBe(1);
    expect(Object.keys(result["object"]).length).toBe(2);
  });

  it("returns proper objects even when double nested", () => {
    const shape = [
      {
        name: "objectType",
        validates: undefined,
        type: "object",
        children: [
          {
            name: "childObject",
            validates: undefined,
            type: "object",
            children: [
              {
                name: "object1",
                validates: undefined,
              },
              {
                name: "object2",
                validates: undefined,
              },
            ],
          },
        ],
      },
    ];
    const result = arrangeValues({ values: testValues, submitShape: shape });
    expect(result).toMatchObject({
      objectType: {
        childObject: {
          object1: "one",
          object2: "two",
        },
      },
    });
  });
});
