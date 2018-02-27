/* eslint require-jsdoc: "off" */
import React from "react";
import FormNodeNumber from "../../../../src/components/nodes/types/number";
import { /* shallow, */ mount } from "enzyme";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

const defaultTestProps = {
  name: "test_number",
  path: "test.test_number",
  valueManager: {
    values: {
      "test.test_number": false,
    },
    validate: {},
    update: jest.fn(),
  },
  register: jest.fn(),
  label: "test number",
  description: "this is a test number",
};

function setup(renderFn, testProps = defaultTestProps) {
  return renderFn(<FormNodeNumber {...testProps}/>);
}

describe("rendering", () => {
  it("renders string types correctly", () => {
    const render = renderer.create(
      <FormNodeNumber
        name="test_number"
        path="test.test_number"
        valueManager={{
          values: {
            "test.test_boolean": false,
          },
          validate: {}
        }}
        register={() => {}}
        label="test number"
        description="this is a test number"
      />
    ).toJSON();
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
