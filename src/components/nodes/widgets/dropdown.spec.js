/* eslint require-jsdoc: "off" */
import React from "react";
import Dropdown from "./dropdown";
import { mount } from /* mount */ "enzyme";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

const defaultProps = {
  label: "test label",
  path: "this.test.dropdown",
  name: "test_dropdown",
  valueManager: {
    values: {},
    validate: {},
    update: jest.fn(),
  },
  options: [
    "hello",
    "world"
  ],
};

describe("rendering", () => {
  it("renders correctly", () => {
    const render = renderer.create(<Dropdown {...defaultProps}/>).toJSON();
    expect(render).toMatchSnapshot();
  });

  it("renders correctly with no options supplied", () => {
    const noOptionsProps = {
      label: "test label",
      path: "this.test.dropdown",
      name: "test_dropdown",
      valueManager: {
        values: {},
        validate: {},
      },
    };
    const render = renderer.create(<Dropdown {...noOptionsProps}/>).toJSON();
    expect(render).toMatchSnapshot();
  });

  it("renders correctly with no label supplied", () => {
    const noLabelProps = {
      path: "this.test.dropdown",
      name: "test_dropdown",
      valueManager: {
        values: {},
        validate: {},
      },
      options: [
        "hello",
        "world"
      ],
    };
    const render = renderer.create(<Dropdown {...noLabelProps}/>).toJSON();
    expect(render).toMatchSnapshot();
  });
});

function setup(renderFn, testProps = defaultProps) {
  return renderFn(<Dropdown {...testProps}/>);
}

describe("interactions", () => {
  it("should use valueManager to update on change", () => {
    const wrapper = setup(mount);
    const event = {
      target: {
        value: "selected text",
      },
    };
    wrapper.find("select").first().simulate("change", event);
    expect(wrapper.props().valueManager.update.mock.calls[0]).toMatchObject(
      [ { path: "this.test.dropdown",
          name: "test_dropdown",
          value: "selected text" } ]
    );
  });
});



