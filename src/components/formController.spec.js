/* eslint require-jsdoc: "off" */
import React from "react";
import { FormController } from "../../src/components/formController.js";
import renderer from "react-test-renderer";
// import { shallow, mount } from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

const setupProps = {
  title: "test form title",
  description: "this is a test form",
  changeValue: () => {},
  deleteRow: () => {},
  values: {},
  validate: {
    single: jest.fn(),
    state: {},
  },
  tabs: {
    tabLabels: [],
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

// function setup(renderFn, testProps = setupProps) {
//   return renderFn(<FormController {...testProps} />);
// }
