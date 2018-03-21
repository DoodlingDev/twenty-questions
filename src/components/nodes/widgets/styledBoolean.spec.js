/* eslint require-jsdoc: "off" */
import React from "react";
import StyledBoolean from "./styledBoolean";
import { /* shallow, */ mount } from "enzyme";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

const defaultProps = {
  name: "testBool",
  path: "this.test.path",
  valueManager: {
    values: {},
    validate: {},
    update: jest.fn(),
  },
};

describe("rendering", () => {
  it("renders correctly", () => {
    const render = renderer
      .create(<StyledBoolean {...defaultProps} />)
      .toJSON();
    expect(render).toMatchSnapshot();
  });
});

function setup(renderFn, testProps = defaultProps) {
  return renderFn(<StyledBoolean {...testProps} />);
}

describe("checked and unchecked styles", () => {
  it("has checked in the class name when value is true", () => {
    const checkedProps = {
      name: "testBool",
      path: "this.test.path",
      valueManager: {
        values: {
          "this.test.path": true,
        },
        validate: {},
      },
    };
    const wrapper = setup(mount, checkedProps);
    expect(
      / checked/.test(
        wrapper
          .find("button")
          .first()
          .props().className,
      ),
    ).toBe(true);
  });

  it("doesn't have checked class name when value is false", () => {
    const unCheckedProps = {
      name: "testBool",
      path: "this.test.path",
      valueManager: {
        values: {
          "this.test.path": false,
        },
        validate: {},
      },
    };
    const wrapper = setup(mount, unCheckedProps);
    expect(
      / checked/.test(
        wrapper
          .find("button")
          .first()
          .props().className,
      ),
    ).toBe(false);
  });
});

describe("click behavior", () => {
  it("properly calls update when there is no existing value", () => {
    const wrapper = setup(mount);
    wrapper
      .find("button")
      .first()
      .simulate("click");
    expect(wrapper.props().valueManager.update.mock.calls[0]).toMatchObject([
      {
        path: "this.test.path",
        name: "testBool",
        value: true,
      },
    ]);
  });

  it("properly calls update when value is true", () => {
    const checkedProps = {
      name: "testBool",
      path: "this.test.path",
      valueManager: {
        values: {
          "this.test.path": true,
        },
        validate: {},
        update: jest.fn(),
      },
    };
    const wrapper = setup(mount, checkedProps);
    wrapper
      .find("button")
      .first()
      .simulate("click");
    expect(wrapper.props().valueManager.update.mock.calls[0]).toMatchObject([
      {
        path: "this.test.path",
        name: "testBool",
        value: false,
      },
    ]);
  });

  it("properly calls update when value is false", () => {
    const checkedProps = {
      name: "testBool",
      path: "this.test.path",
      valueManager: {
        values: {
          "this.test.path": false,
        },
        validate: {},
        update: jest.fn(),
      },
    };
    const wrapper = setup(mount, checkedProps);
    wrapper
      .find("button")
      .first()
      .simulate("click");
    expect(wrapper.props().valueManager.update.mock.calls[0]).toMatchObject([
      {
        path: "this.test.path",
        name: "testBool",
        value: true,
      },
    ]);
  });
});
