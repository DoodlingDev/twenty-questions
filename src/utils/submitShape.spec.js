import submitShape from "../../src/utils/submitShape";

describe("createShapeMap", () => {
  it("should return a submit-type object for each endpoint type", () => {
    let testShape = [
      {
        type: "string",
        name: "test_string",
        label: "Test String",
      },
      {
        type: "number",
        name: "test_number",
        label: "Test Number",
      },
      {
        type: "boolean",
        name: "test_bool",
        label: "Test Boolean",
      },
    ];
    const result = submitShape(testShape);
    expect(result.length).toBe(3);
  });

  it("maintains array structure", () => {
    const testShape = [
      {
        type: "array",
        name: "test_array",
        label: "Test Array",
        properties: [
          {
            type: "string",
            name: "test_string_a",
            label: "Test String A",
          },
          {
            type: "string",
            name: "test_string_b",
            label: "Test String B",
          },
        ],
      },
    ];
    const result = submitShape(testShape);
    expect(result.length).toBe(1);
    expect(result[0].type).toEqual("array");
    expect(result[0].children.length).toBe(2);
  });

  it("handles arrays with options instead of props", () => {
    const testShape = [
      {
        type: "array",
        name: "test_array",
        label: "Test Array",
        options: ["one", "two"],
      },
    ];
    const result = submitShape(testShape);
    expect(result[0]).toMatchObject({
      name: "test_array",
      validates: [],
      type: "array",
    });
  });

  it("maintains object structure unless :nosubmit", () => {
    const testShape = [
      {
        type: "object:nosubmit",
        name: "test_object",
        label: "Test Label",
        properties: [
          {
            type: "string",
            name: "inner_string",
          },
          {
            type: "string",
            name: "inner_string_a",
          },
          {
            type: "string",
            name: "inner_string_b",
          },
        ],
      },
      {
        type: "object",
        name: "test_object_with_children",
        label: "With Children",
        properties: [
          {
            type: "string",
            label: "String",
            name: "string_a",
          },
          {
            type: "string",
            label: "String",
            name: "string_b",
          },
        ],
      },
    ];
    const result = submitShape(testShape);
    expect(result.length).toBe(4);
    let objectResult;
    for (let i = 0, l = result.length; i < l; i++) {
      if (result[i].type === "object") {
        objectResult = result[i];
        break;
      }
    }
    expect(objectResult.children.length).toBe(2);
  });
});
