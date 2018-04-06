/* eslint require-jsdoc: "off" */
import React from "react";
import DatePicker from "./datepicker";
import renderer from "react-test-renderer";
// import { /* shallow, */ mount } from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

const setupProps = {
  type: "string",
  name: "test_name",
  path: "path.to.the_test.test_name",
  valueManager: {
    values: {},
    validations: {},
    update: jest.fn(),
  },
};

// it("renders correctly", () => {
//   const ren = renderer.create(<DatePicker {...setupProps} />).toJSON();
//   expect(ren).toMatchSnapshot();
// });

