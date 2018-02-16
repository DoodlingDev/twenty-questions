/* eslint require-jsdoc: "off" */
import React from "react";
import ErrorHandler from "../../src/components/errorHandler.js";
import renderer from "react-test-renderer";
import {/* shallow, */ mount} from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({adapter: new Adapter()});

const setupProps = {
  name: "test-error",
};

function setup(renderFn, testProps) {
  return renderFn(<ErrorHandler {...testProps} />);
}

it("renders corrrectly before error exists", () => {
  const render = renderer.create(<ErrorHandler {...setupProps} />).toJSON();
  expect(render).toMatchSnapshot();
});

it("renders correctly when validation fails", () => {
  const render = renderer
    .create(
      <ErrorHandler
        validations={[
          {
            valid: false,
            message: "This validation failed!",
          },
        ]}
        {...setupProps}
      />,
    )
    .toJSON();
  expect(render).toMatchSnapshot();
});

it("renders correctly when validation passes w/o label", () => {
  const render = renderer
    .create(
      <ErrorHandler
        validations={[
          {
            valid: true,
          },
        ]}
        {...setupProps}
      />,
    )
    .toJSON();
  expect(render).toMatchSnapshot();
});

it("renders correctly when validation passes w/ label", () => {
  const render = renderer
    .create(
      <ErrorHandler
        label="test Label"
        validations={[
          {
            valid: true,
          },
        ]}
        {...setupProps}
      />,
    )
    .toJSON();
  expect(render).toMatchSnapshot();
});

describe("is valid or error", () => {
  it("does nothing when no validation or error exists", () => {
    const wrapper = setup(mount, {
      name: "test",
    });

    for (let i = 0, l = wrapper.children().length; i < l; i++) {
      expect(
        wrapper
          .children()
          .at(i)
          .props().className,
      ).not.toMatch("validIndicator");
      expect(
        wrapper
          .children()
          .at(i)
          .props().className,
      ).not.toMatch("errorList");
    }
  });

  it("renders valid when exists", () => {
    const wrapper = setup(mount, {
      name: "test",
      validations: [
        {
          valid: true,
        },
      ],
    });

    let hasValid = false;
    let hasError = false;
    for (let i = 0, l = wrapper.children().length; i < l; i++) {
      if (
        wrapper
          .children()
          .at(i)
          .props()
          .className.match(/validData/)
      ) {
        hasValid = true;
      }
      if (
        wrapper
          .children()
          .at(i)
          .props()
          .className.match(/errorData/)
      ) {
        hasError = true;
      }
    }
    expect(hasValid).toBe(true);
    expect(hasError).toBe(false);
  });

  it("renders error when exists", () => {
    const wrapper = setup(mount, {
      name: "test",
      validations: [
        {
          valid: false,
          message: "is false",
        },
      ],
    });

    let hasValid = false;
    let hasError = false;
    for (let i = 0, l = wrapper.children().length; i < l; i++) {
      if (
        wrapper
          .children()
          .at(i)
          .props()
          .className.match(/validData/)
      ) {
        hasValid = true;
      }
      if (
        wrapper
          .children()
          .at(i)
          .props()
          .className.match(/errorData/)
      ) {
        hasError = true;
      }
    }
    expect(hasValid).toBe(false);
    expect(hasError).toBe(true);
  });

  it("renders error when exists && valid exists", () => {
    const wrapper = setup(mount, {
      name: "test",
      validations: [
        {
          valid: false,
          message: "is false",
        },
        {
          valid: true,
        },
      ],
    });

    let hasValid = false;
    let hasError = false;
    for (let i = 0, l = wrapper.children().length; i < l; i++) {
      if (
        wrapper
          .children()
          .at(i)
          .props()
          .className.match(/validData/)
      ) {
        hasValid = true;
      }
      if (
        wrapper
          .children()
          .at(i)
          .props()
          .className.match(/errorData/)
      ) {
        hasError = true;
      }
    }
    expect(hasValid).toBe(false);
    expect(hasError).toBe(true);
  });

  it("renders two errors when two exist", () => {
    const wrapper = setup(mount, {
      name: "test",
      validations: [
        {
          valid: false,
          message: "hiphopopotamus",
        },
        {
          valid: false,
          message: "rhymenoceros",
        },
      ],
    });
    expect(wrapper.find("li").length).toBe(2);
  });
});
