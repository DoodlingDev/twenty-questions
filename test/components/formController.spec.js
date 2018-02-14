/* eslint require-jsdoc: "off" */
import React from "react";
import { FormController } from "../../src/components/formController.js";
import renderer from "react-test-renderer";
import { /*  shallow,  */ mount } from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

const setupProps = {
  title: "test form title",
  description: "this is a test form",
  validate: {
    single: jest.fn(),
    state: {},
  },
  properties: [
    {
      // this name is left with a space specifically to
      // test that names get camelized
      name: "test name",
      type: "object",
      properties: [
        {
          type: "string",
          name: "testString",
        },
      ],
    },
  ],
};

it("renders correctly", () => {
  const render = renderer.create(<FormController {...setupProps} />).toJSON();
  expect(render).toMatchSnapshot();
});

function setup(renderFn, testProps = setupProps) {
  return renderFn(<FormController {...testProps} />);
}

describe("changeValue", () => {
  it("should update when given the correct input", () => {
    const wrapper = setup(mount);
    wrapper.instance().changeValue({
      path: "test.path",
      name: "test_name",
      value: "test value",
    });
    wrapper.update();
    expect(wrapper.state().values).toMatchObject({
      "test.path": "test value",
    });
  });

  it("shouldn't change the state when incorrect input is passed", () => {
    const wrapper = setup(mount);
    wrapper.instance().changeValue({
      path: "test.path",
      name: "test_name",
    });
    wrapper.update();
    expect(wrapper.state().values).not.toMatchObject({
      "test.path": undefined,
    });
  });

  it("should call validate single when typeAhead is true", () => {
    const wrapper = setup(mount);
    wrapper.instance().props.validate.single = jest.fn();
    wrapper.instance().changeValue({
      path: "test.path",
      name: "test_name",
      value: "boop",
    });
    wrapper.update();
    expect(wrapper.instance().props.validate.single).toHaveBeenCalledWith({
      path: "test.path",
      name: "test_name",
      value: "boop",
    });
  });

  it("should not call validate single when typeAhead is false", () => {
    const wrapper = setup(mount, { typeAheadValidation: false, ...setupProps });
    wrapper.instance().props.validate.single = jest.fn();
    wrapper.instance().changeValue({
      path: "test.path",
      name: "test_name",
      value: "boop",
    });
    wrapper.update();
    expect(wrapper.instance().props.validate.single).not.toHaveBeenCalled();
  });
});

describe("registerField", () => {
  it("should register each field when they are rendered", () => {
    const wrapper = setup(mount);
    wrapper.update();
    expect(wrapper.state().fieldRegistry.length).toEqual(2);
    expect(wrapper.state().fieldRegistry).toContain(
      "testFormTitle.testName.testString",
    );
  });

  it("should update with unique paths", () => {
    const wrapper = setup(mount);
    const n = wrapper.state().fieldRegistry.length;
    wrapper.instance().registerField("purple.people.eater");
    wrapper.update();
    expect(wrapper.state().fieldRegistry.length).toEqual(n + 1);
  });

  it("should not update with non-unique paths", () => {
    const wrapper = setup(mount);
    const n = wrapper.state().fieldRegistry.length;
    wrapper.instance().registerField(wrapper.state().fieldRegistry[0]);
    wrapper.update();
    expect(wrapper.state().fieldRegistry.length).toEqual(n);
  });
});

describe("deleteRowValue", () => {
  const arrayValue = {
    "testFormTitle.testName.testArray": {},
    "testFormTitle.testName.testArray.0.a": {},
    "testFormTitle.testName.testArray.0.a.one": "A",
    "testFormTitle.testName.testArray.0.a.two": "B",
    "testFormTitle.testName.testArray.1.a": {},
    "testFormTitle.testName.testArray.1.a.one": "AA",
    "testFormTitle.testName.testArray.1.a.two": "BB",
    "testFormTitle.testName.testArray.2.a": {},
    "testFormTitle.testName.testArray.2.a.one": "AAA",
    "testFormTitle.testName.testArray.2.a.two": "BBB",
    "testFormTitle.testName.testArray.3.a": {},
    "testFormTitle.testName.testArray.3.a.one": "AAAA",
    "testFormTitle.testName.testArray.3.a.two": "BBBB",
  };

  it("should remove the row in question", () => {
    const wrapper = setup(mount);
    wrapper.instance().state.values = { ...arrayValue };
    const valueLength = Object.keys(wrapper.state().values).length;
    wrapper.instance().deleteRowValue({
      path: "testFormTitle.testName.testArray",
      index: 1,
    });
    wrapper.update();
    expect(Object.keys(wrapper.state().values).length).toBe(valueLength - 3);
  });

  it("should preserve data", () => {
    const wrapper = setup(mount);
    wrapper.instance().state.values = { ...arrayValue };
    wrapper.instance().deleteRowValue({
      path: "testFormTitle.testName.testArray",
      index: 1,
    });
    wrapper.update();
    const allCorrect = (function() {
      const values = wrapper.state().values;

      for (let i = 0, l = 3; i < l; i++) {
        if (
          values[`testFormTitle.testName.testArray.${i}.a.one`].length !==
          values[`testFormTitle.testName.testArray.${i}.a.two`].length
        ) return false;

        if (
          !/A+/.test(values[`testFormTitle.testName.testArray.${i}.a.one`]) ||
          !/B+/.test(values[`testFormTitle.testName.testArray.${i}.a.two`])
        ) return false;
      }
      return true;
    })();
    expect(allCorrect).toBeTruthy();
  });

  it("should decrement the numbers properly", () => {
    const wrapper = setup(mount);
    wrapper.instance().state.values = { ...arrayValue };
    wrapper.instance().deleteRowValue({
      path: "testFormTitle.testName.testArray",
      index: 1,
    });
    wrapper.update();
    const hasNoThrees = (function(){
      for (let keyName in wrapper.state().values) {
        if (/3/.test(keyName)) return false;
      }
      return true;
    })();
    expect(hasNoThrees).toBeTruthy();
  });
});

