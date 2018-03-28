/* eslint require-jsdoc: "off" */
import React from "react";
import MultiSelect from "./multiselect";
import renderer from "react-test-renderer";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

function setup(renderFn, testProps = defaultProps) {
  return renderFn(<MultiSelect {...testProps} />);
}

const defaultProps = {
  name: "test_multi",
  options: ["one", "two", "three"],
  path: "path.to.testing_component",
  valueManager: {
    values: {},
    validate: {},
    update: jest.fn(),
  },
};

describe("rendering", () => {
  it("renders correctly", () => {
    const render = renderer.create(<MultiSelect {...defaultProps} />).toJSON();
    expect(render).toMatchSnapshot();
  });

  it("renders correctly with an item checked", () => {
    const oneCheckedProps = {
      ...defaultProps,
      valueManager: {
        values: { "path.to.testing_component": ["two"] },
        validate: {},
        update: jest.fn(),
      },
    };
    const render = renderer.create(<MultiSelect {...oneCheckedProps} />).toJSON();
    expect(render).toMatchSnapshot();
  });
});

describe("updating", () => {
  it("removes item from state if checked -> unchecked", () => {
    const twoCheckedProps = {
      ...defaultProps,
      valueManager: {
        values: { "path.to.testing_component": ["one", "two"] },
        validate: {},
        update: jest.fn(),
      },
    };
    const wrapper = setup(mount, twoCheckedProps);
    wrapper
      .find("input")
      .first()
      .simulate("change", {
        currentTarget: {
          name: "one",
        },
      });
    expect(wrapper.props().valueManager.update.mock.calls[0][0].value).toEqual([
      "two",
    ]);
    wrapper.props().valueManager.update.mockReset();
  });

  it("removes item from state if unchecked -> checked", () => {
    const twoCheckedProps = {
      ...defaultProps,
      valueManager: {
        values: { "path.to.testing_component": ["two", "three"] },
        validate: {},
        update: jest.fn(),
      },
    };
    const wrapper = setup(mount, twoCheckedProps);
    wrapper
      .find("input")
      .first()
      .simulate("change");
    expect(wrapper.props().valueManager.update.mock.calls[0][0].value).toEqual([
      "one",
      "two",
      "three",
    ]);
    wrapper.props().valueManager.update.mockReset();
  });
});
