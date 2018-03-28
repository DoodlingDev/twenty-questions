import checkForConditionalRendering from "./checkForConditionalRendering";

describe("conditional display", () => {
  const testArgs = {
    path: "test",
    name: "test_thing",
    label: "test thing",
    valueManager: {
      values: {
        "test": "value value",
      },
    },
    properties: {
      "value value": {
        name: "child name",
        label: "child label"
      },
    },
    conditional: true,
  };

  it("should render when all conditions are met", () => {
    const renders = checkForConditionalRendering(testArgs);
    expect(renders).not.toBeNull();
  });

  it("should not render conditional when flag is falsy", () => {
    const withNull = checkForConditionalRendering({
      ...testArgs,
      conditional: null,
    });
    expect(withNull).toBeNull();
    const withFalse = checkForConditionalRendering({
      ...testArgs,
      conditional: false,
    });
    expect(withFalse).toBeNull();
    expect(checkForConditionalRendering({})).toBeNull();
  });

  it("should not render conditional when flag is truthy but not true", () => {
    const flagTrue = {
      ...testArgs,
      conditional: "yes",
    };
    expect(checkForConditionalRendering(flagTrue)).toBeNull();
  });

  it("should not render if properties is undefined", () => {
    const propUndefined = {
      ...testArgs,
      properties: undefined,
    };
    expect(checkForConditionalRendering(propUndefined)).toBeNull();
  });

  it("should not render if value doesn't match a property", () => {
    const noMatch = {
      ...testArgs,
      valueManager: {
        values: {
          "nothing": "to see here",
        },
      },
    };
    expect(checkForConditionalRendering(noMatch)).toBeNull();
  });
});
