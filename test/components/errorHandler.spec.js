/* eslint require-jsdoc: "off" */
import React from "react";
import ErrorHandler from "../../src/components/errorHandler.js";
import renderer from "react-test-renderer";
import { shallow, mount } from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

const setupProps = {
  name: "test-error",
};

it("renders corrrectly", () => {
  const render = renderer.create(
    <ErrorHandler
      {...setupProps}
    />
  ).toJSON();
  expect(render).toMatchSnapshot();
});
