/* eslint require-jsdoc: "off" */
import React from "react";
import withValidation from "../../src/components/validator.js";
import {shallow /* mount  */} from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({adapter: new Adapter()});

const defaultFormControllerProps = {
  title: "test form",
};

const oneValidation = {
  name: "row-1",
  properties: [
    {
      type: "string",
      name: "one",
      label: "ONE",
      validates: ["--one"],
    },
    {
      type: "string",
      name: "two",
      label: "TWO",
    },
  ],
};

function setup(renderFn, props) {
  const testPropsWithDefault = Object.assign(props, defaultFormControllerProps);
  const ComponentUnderTest = withValidation("<div></div>");

  return renderFn(<ComponentUnderTest {...testPropsWithDefault} />);
}

describe("internal state after constructor", () => {
  it("should hold a validationList", () => {
    const wrapper = setup(shallow, oneValidation);
    expect(wrapper.state().validationList).toBeTruthy();
  });

  it("validationList should be an object", () => {
    const wrapper = setup(shallow, oneValidation);
    const objectKeys = Object.keys(wrapper.state().validationList);
    expect(typeof wrapper.state().validationList).toEqual("object");
    expect(objectKeys).not.toContain("0");
  });
});

describe("gatherValidations", () => {
  describe("given one non-nested validation and one non-validated", () => {
    it("should return one field to validate", () => {
      const wrapper = setup(shallow, oneValidation);
      const validationList = wrapper.state().validationList;
      expect(Object.keys(validationList).length).toBe(1);
    });

    it("should have the correct shape", () => {
      const wrapper = setup(shallow, oneValidation);
      const validationList = wrapper.state().validationList;
      expect(validationList).toEqual({
        one: {
          type: "string",
          label: "ONE",
          name: "one",
          validates: ["--one"],
        },
      });
    });
  });

  describe("given two sibling validations", () => {
    const twoSiblingsToValidate = {
      name: "parent",
      properties: [
        {
          name: "one",
          type: "string",
          label: "ONE",
          validates: ["--one"],
        },
        {
          name: "two",
          type: "string",
          label: "TWO",
          validates: ["--one", "--two"],
        },
      ],
    };

    it("should return two fields to validate", () => {
      const wrapper = setup(shallow, twoSiblingsToValidate);
      const validationList = wrapper.state().validationList;
      expect(Object.keys(validationList).length).toBe(2);
    });

    it("should be shaped properly", () => {
      const wrapper = setup(shallow, twoSiblingsToValidate);
      const validationList = wrapper.state().validationList;
      expect(validationList).toEqual({
        one: {
          name: "one",
          label: "ONE",
          type: "string",
          validates: ["--one"],
        },
        two: {
          name: "two",
          label: "TWO",
          type: "string",
          validates: ["--one", "--two"],
        },
      });
    });
  });

  describe("given nested properties", () => {
    const nestedProperties = {
      title: "test schema",
      type: "object",
      properties: [
        {
          type: "string",
          name: "one",
          label: "ONE",
          validates: ["--one"],
        },
        {
          type: "object",
          name: "object-1",
          properties: [
            {
              type: "string",
              name: "two",
              label: "TWO",
              validates: ["--two"],
            },
            {
              type: "object",
              name: "object-2",
              properties: [
                {
                  type: "number",
                  name: "three",
                  label: "THREE",
                  validates: ["--one", "--two", "--three"],
                },
              ],
            },
          ],
        },
      ],
    };

    it("should return three fields to validate", () => {
      const wrapper = setup(shallow, nestedProperties);
      const validationList = wrapper.state().validationList;
      expect(Object.keys(validationList).length).toBe(3);
    });

    it("should have the correct shape", () => {
      const wrapper = setup(shallow, nestedProperties);
      const validationList = wrapper.state().validationList;
      expect(validationList).toEqual({
        one: {
          type: "string",
          name: "one",
          label: "ONE",
          validates: ["--one"],
        },
        two: {
          type: "string",
          name: "two",
          label: "TWO",
          validates: ["--two"],
        },
        three: {
          type: "number",
          name: "three",
          label: "THREE",
          validates: ["--one", "--two", "--three"],
        },
      });
    });
  });

  describe("validate single", () => {
    it("should error when passed an invalid validationRule", () => {
      const wrapper = setup(shallow, {
        properties: [
          {
            type: "string",
            name: "one",
            label: "ONE",
            validates: ["godzilla"],
          },
        ],
      });
      try {
        wrapper.props().validate.single({
          name: "one",
          path: "one.one",
          value: "boop",
        });
      } catch (err) {
        expect(err).toBeTruthy();
      }
    });

    it("should create a validation entry in the state when valid", () => {
      const wrapper = setup(shallow, {
        properties: [
          {
            type: "string",
            name: "one",
            label: "ONE",
            validates: ["required"],
          },
        ],
      });
      wrapper.props().validate.single({
        name: "one",
        path: "one.one",
        value: "boop",
      });
      wrapper.update();
      const inputValidationList = wrapper.props().validate.state["one.one"];
      expect(inputValidationList.length).toBe(1);
    });

    it("should create a validation entry in the state when invalid", () => {
      const wrapper = setup(shallow, {
        properties: [
          {
            type: "string",
            name: "one",
            label: "ONE",
            validates: ["required"],
          },
        ],
      });
      wrapper.props().validate.single({
        name: "one",
        path: "one.one",
        value: "",
      });
      wrapper.update();
      const inputValidationList = wrapper.props().validate.state["one.one"];
      expect(inputValidationList.length).toBe(1);
    });

    it("should remove a valid entry for the same validation when new invalid is passed", () => {
      const wrapper = setup(shallow, {
        properties: [
          {
            type: "string",
            name: "one",
            label: "ONE",
            validates: ["required"],
          },
        ],
      });
      wrapper.instance().state.validationState["one.one"] = [
        {
          validation: "required",
          valid: true,
        },
      ];
      wrapper.props().validate.single({
        name: "one",
        path: "one.one",
        value: "",
      });
      wrapper.update();
      const inputValidationList = wrapper.props().validate.state["one.one"];
      expect(inputValidationList[0].valid).toBe(false);
    });

    it("removes an invalid entry for the same validation when new valid is passed", () => {
      const wrapper = setup(shallow, {
        properties: [
          {
            type: "string",
            name: "one",
            label: "ONE",
            validates: ["required"],
          },
        ],
      });
      wrapper.instance().state.validationState["one.one"] = [
        {
          validation: "required",
          valid: false,
        },
      ];
      wrapper.props().validate.single({
        name: "one",
        path: "one.one",
        value: "here now!",
      });
      wrapper.update();
      const inputValidationList = wrapper.props().validate.state["one.one"];
      expect(inputValidationList[0].valid).toBe(true);
    });
  });
});

describe("validate all", () => {
  it("passes as valid when all validations pass", () => {
    const wrapper = setup(shallow, {
      properties: [
        {
          type: "object",
          name: "object",
          properties: [
            {
              type: "string",
              name: "one",
              path: "object.one",
              label: "ONE",
              validates: ["required"],
            },
            {
              type: "string",
              name: "two",
              path: "object.two",
              label: "TWO",
              validates: ["required"],
            },
          ],
        },
      ],
    });
    const result = wrapper.props().validate.all(
      {
        "object.one": "1",
        "object.two": "2",
      },
      ["object.one", "object.two"],
    );
    expect(result).toBe(true);
  });

  it("fails when all validations fail", () => {
    const wrapper = setup(shallow, {
      properties: [
        {
          type: "object",
          name: "object",
          properties: [
            {
              type: "string",
              name: "one",
              path: "object.one",
              label: "ONE",
              validates: ["required"],
            },
            {
              type: "string",
              name: "two",
              path: "object.two",
              label: "TWO",
              validates: ["required"],
            },
          ],
        },
      ],
    });
    const result = wrapper.props().validate.all(
      {
        "object.one": "",
        "object.two": "",
      },
      ["object.one", "object.two"],
    );
    expect(result).toBe(false);
  });

  it("fails when only some validations fail", () => {
    const wrapper = setup(shallow, {
      properties: [
        {
          type: "object",
          name: "object",
          properties: [
            {
              type: "string",
              name: "one",
              path: "object.one",
              label: "ONE",
              validates: ["required"],
            },
            {
              type: "string",
              name: "two",
              path: "object.two",
              label: "TWO",
              validates: ["required"],
            },
          ],
        },
      ],
    });
    const result = wrapper.props().validate.all(
      {
        "object.one": "1",
        "object.two": "",
      },
      ["object.one", "object.two"],
    );
    expect(result).toBe(false);
  });

  it("fails when a required field doesn't exist and hasn't been touched yet", () => {
    const wrapper = setup(shallow, {
      properties: [
        {
          type: "object",
          name: "object",
          properties: [
            {
              type: "string",
              name: "one",
              path: "object.one",
              label: "ONE",
              validates: ["required"],
            },
            {
              type: "string",
              name: "two",
              path: "object.two",
              label: "TWO",
              validates: ["required"],
            },
          ],
        },
      ],
    });
    const result = wrapper.props().validate.all(
      {
        "object.one": "1",
      },
      ["object.one", "object.two"],
    );
    expect(result).toBe(false);
  });
});
