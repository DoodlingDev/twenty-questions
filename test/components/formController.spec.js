/* eslint require-jsdoc: "off" */
import React from "react";
import {
  FormController,
} from "../../src/components/formController.js";
import renderer from "react-test-renderer";
import { /*  shallow,  */mount } from "enzyme";
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

describe("registerField", () => {});

describe("deleteRowValue", () => {});
//
// function setup(renderFn, props = setupProps) {
//   return renderFn(<FormController {...props}/>);
// }
//
// describe("handles import correctly", () => {
//   let error;
//   const notObjectFirstParam = {
//     title: "setup without first param object",
//     description: "this should throw an error",
//     properties: [
//       {
//         type: "string",
//         name: "blow-up",
//         properties: [{}],
//       }
//     ]
//   };
//   try {
//     setup(shallow, notObjectFirstParam);
//   } catch(err) {
//     error = err;
//   }
//   expect(error).toBeTruthy();
// });
