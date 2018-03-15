import React from "react";
import FormNodeObject from "./object";
// import { shallow, mount } from "enzyme";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

it("renders correctly", () => {
  const render = renderer
    .create(
      <FormNodeObject
        name="test-name"
        type="object"
        path="the.path.test-name"
        valueManager={{
          update: () => {},
          values: {},
          errors: {},
        }}
        properties={[]}
      />,
    )
    .toJSON();
  expect(render).toMatchSnapshot();
});
