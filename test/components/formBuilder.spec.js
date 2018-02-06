import React from "react";
import FormBuilder from "../../src/components/formBuilder";
import { shallow, mount } from "enzyme";
import renderer from "react-test-renderer";
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

function setup(renderFn) {
  return renderFn(
    pug`
      FormBuilder(
        schema={
          name: "test-builder",
          properties: [{
          type: "object",
            name: "test-name",
          }],
        }
      )
    `
  )
}

it("renders correctly", () => {
  const rendered = renderer.create(
    pug`
      FormBuilder(
        schema={
          name: "test-builder",
          properties: [{
          type: "object",
            name: "test-name",
          }],
        }
      )
    `
  ).toJSON();
  expect(rendered).toMatchSnapshot();
});

describe("properties to children", () => {
  it("creates the proper path for its children", () => {
    const wrapper = setup(mount);
    const firstNode = wrapper.find("FormNode").first();
    expect(firstNode.props()).toHaveProperty("path", "test-builder.test-name");
  });

});
