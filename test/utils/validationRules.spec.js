import * as validationRules from "../../src/utils/validationRules";

describe("required", () => {
  it("should pass when value exists", () => {
    const validResult = validationRules.required({
      path: "one.one",
      name: "one",
      label: "ONE",
      value: "here!",
    });
    expect(validResult.valid).toBe(true);
  });

  it("should pass when the value is zero", () => {
    const validResult = validationRules.required({
      path: "one.one",
      name: "one",
      label: "ONE",
      value: 0,
    });
    expect(validResult.valid).toBe(true);
  });

  it("should pass when the value is false", () => {
    const validResult = validationRules.required({
      path: "one.one",
      name: "one",
      label: "ONE",
      value: false,
    });
    expect(validResult.valid).toBe(true);
  });

  it("should fail when value is empty string", () => {
    const invalidResult = validationRules.required({
      path: "one.one",
      name: "one",
      label: "ONE",
      value: "",
    });
    expect(invalidResult.valid).toBe(false);
  });

  it("should fail when value is undefined", () => {
    const invalidResult = validationRules.required({
      path: "one.one",
      name: "one",
      label: "ONE",
    });
    expect(invalidResult.valid).toBe(false);
  });

  it("should fail when value is null", () => {
    const invalidResult = validationRules.required({
      path: "one.one",
      name: "one",
      label: "ONE",
      value: null,
    });
    expect(invalidResult.valid).toBe(false);
  });
});
