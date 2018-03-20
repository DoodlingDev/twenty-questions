/* eslint require-jsdoc: "off" */
import React from "react";
import OnFocus from "./onFocus";
import { /* shallow,*/ mount } from "enzyme";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

const defaultTestProps = {
  name: "test_onfocus",
  path: "test_path",
  properties: [
    {
      type: "string",
      name: "test_string",
    },
  ],
  valueManager: {
    values: {},
    validate: {},
  },
};

function setup(renderFn, testProps = defaultTestProps) {
  return renderFn(<OnFocus {...testProps} />);
}

describe("rendering", () => {
  it("renders correctly", () => {
    const render = renderer.create(<OnFocus {...defaultTestProps} />).toJSON();
    expect(render).toMatchSnapshot();
  });
});

describe("mounted component", () => {
  it("should render the label view by default", () => {
    const wrapper = setup(mount);
    expect(wrapper.find("input").length < 1).toBe(true);
  });

  it("should render the label view if unfocused", () => {
    const wrapper = setup(mount);
    wrapper.state.focused = false;
    wrapper.update();
    expect(wrapper.find("input").length < 1).toBe(true);
  });

  it("should render the inputs view if focused", () => {
    const wrapper = setup(mount);
    wrapper.setState({ focused: true });
    wrapper.update();
    expect(wrapper.find("input").length < 1).toBe(false);
  });
});

describe("with existing data", () => {
  const existingDataProps = {
    name: "test_onfocus",
    path: "test_path",
    properties: [
      {
        type: "string",
        name: "test_string",
      },
    ],
    valueManager: {
      values: {
        "test_path.test_string": "existing data",
      },
      validate: {},
    },
  };

  it("should render the input view", () => {
    const wrapper = setup(mount, existingDataProps);
    expect(wrapper.find("input").length >= 1).toBe(true);
  });
});
