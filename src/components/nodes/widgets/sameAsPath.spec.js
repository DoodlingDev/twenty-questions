/* eslint require-jsdoc: "off" */
import React from "react";
import SameAsPath from "./sameAsPath";
import { shallow, mount } from "enzyme";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

const defaultProps = {
  name: "test same",
  path: "to.this.node",
  valueManager: {
    values: {},
  },
  sameAsPath: "path.to.match",
};

function setup(renderFn, testProps = defaultProps) {
  return renderFn(<SameAsPath {...testProps} />);
}

describe("snapshot renders", () => {
  it("renders default correctly", () => {
    const render = renderer.create(<SameAsPath {...defaultProps} />).toJSON();
    expect(render).toMatchSnapshot();
  });

  it("renders with message correctly", () => {
    const propsWithMessage = {
      sameAsPathMessage: "Same as above whatsit",
      ...defaultProps,
    };
    const render = renderer.create(<SameAsPath {...propsWithMessage} />).toJSON();
    expect(render).toMatchSnapshot();
  })
})


describe("onChange", () => {
  it("should toggle its checked state", () => {
    const wrapper = setup(shallow);
    expect(wrapper.state().checked).toBe(false);
    wrapper
      .find("input")
      .first()
      .simulate("change");
    wrapper.update();
    expect(wrapper.state().checked).toBe(true);
    wrapper
      .find("input")
      .first()
      .simulate("change");
    wrapper.update();
    expect(wrapper.state().checked).toBe(false);
  });
});

describe("componentDidUpdate", () => {
  it("should change when matched field changes", () => {
    const wrapper = setup(mount);
    wrapper.setState({ checked: true });
    wrapper.update();
    const newProps = {
      valueManager: {
        update: jest.fn(),
        values: {
          "path.to.match": "hello",
        },
      },
    };
    wrapper.setProps(newProps);
    wrapper.update();
    expect(wrapper.props().valueManager.update).toHaveBeenCalledWith({
      path: defaultProps.path,
      name: defaultProps.name,
      value: newProps.valueManager.values["path.to.match"],
    });
  });

  it("should not change when unchecked", () => {
    const wrapper = setup(mount);
    wrapper.setState({ checked: false });
    wrapper.update();
    const newProps = {
      valueManager: {
        update: jest.fn(),
        values: {
          "path.to.match": "hello",
        },
      },
    };
    wrapper.setProps(newProps);
    wrapper.update();
    expect(wrapper.props().valueManager.update).not.toHaveBeenCalled();
  });
});
