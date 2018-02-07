/* eslint require-jsdoc: "off" */
import React from "react";
import FormController from "../../src/components/formController.js";
import withValidation from "../../src/components/validator.js";
import renderer from "react-test-renderer";
import { shallow, mount } from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

const defaultFormControllerProps = {
  title: "test form",
}

const oneValidation = {
  schema: {
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
  },
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
  });
});
