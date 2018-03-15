/* eslint require-jsdoc: "off" */
import React from "react";
import FormNodeBoolean from "../../../../src/components/nodes/types/boolean";
import { /* shallow, */ mount } from "enzyme";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

const defaultTestProps = {
  name: "test_boolean",
  path: "test.test_boolean",
  valueManager: {
    values: {
      "test.test_boolean": false,
    },
    validate: {},
    update: jest.fn(),
  },
  register: jest.fn(),
  label: "test boolean",
  description: "this is a test boolean",
};

function setup(renderFn, testProps = defaultTestProps) {
  return renderFn(<FormNodeBoolean {...testProps} />);
}

describe("rendering", () => {
  it("renders string types correctly", () => {
    const render = renderer
      .create(
        <FormNodeBoolean
          name="test_boolean"
          path="test.test_boolean"
          valueManager={{
            values: {
              "test.test_boolean": false,
            },
            validate: {},
          }}
          register={() => {}}
          label="test boolean"
          description="this is a test boolean"
        />,
      )
      .toJSON();
    expect(render).toMatchSnapshot();
  });
});

describe("change actions", () => {
  it("should properly call on update", () => {
    const wrapper = setup(mount);
    wrapper.find("input").simulate("change");
    expect(wrapper.props().valueManager.update.mock.calls.length).toBe(1);
  });
});
