/* eslint require-jsdoc: "off" */
import React from "react";
import FormNodeArray from "../../../../src/components/nodes/types/array";
import { /* shallow, */ mount } from "enzyme";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

describe("rendering", () => {
  it("renders array types correctly", () => {
    const render = renderer
      .create(
        <FormNodeArray
          name="test_array"
          label="test array"
          path="test_form.test_array"
          title="array title"
          description="A simple array"
          properties={[
            {
              type: "object",
              properties: [
                {
                  type: "string",
                  name: "test string",
                },
              ],
            },
          ]}
          valueManager={{
            update: () => {},
            values: {},
            validate: {},
          }}
        />,
      )
      .toJSON();
    expect(render).toMatchSnapshot();
  });
});

const defaultProps = {
  name: "test_array",
  label: "test array",
  path: "test_form.test_array",
  title: "array title",
  description: "the title",
  properties: [
    {
      type: "object",
      name: "child",
      properties: [
        {
          type: "string",
          name: "test-string",
        },
      ],
    },
  ],
  valueManager: {
    update: jest.fn(),
    values: {},
    validate: {},
    deleteRow: jest.fn(),
  },
};

function setup(renderFn, testProps = defaultProps) {
  return renderFn(<FormNodeArray {...testProps} />);
}

// It's kind of gross, but I didn't find a more elegant
// solution to this async setState call's updating the
// component on loading with no values to begin with.
//
// ..that is, without changing the component just to fit
// the test case.
// hence the setTimeout.
describe("# of rows", () => {
  describe("given no values", () => {
    it("adds one row", () => {
      const wrapper = setup(mount);
      expect(wrapper.props().valueManager.update.mock.calls[0]).toEqual([{
        path: "test_form.test_array.0.child",
        name: "child",
        value: {},
      }]);
      wrapper.props().valueManager.update.mockClear()
    });
  });

  describe("given one values", () => {
    it("renders one row", () => {
      const oneValue = { ...defaultProps };
      oneValue.valueManager.values = {
        "test_form.test_array.0.child": {},
      };
      const wrapper = setup(mount, oneValue);
      expect(wrapper.find("FormNodeObject").length).toBe(1);
    });
  });

  describe("given four values", () => {
    it("renders one row", () => {
      const fourValues = { ...defaultProps };
      fourValues.valueManager.values = {
        "test_form.test_array.0.child": {},
        "test_form.test_array.1.child": {},
        "test_form.test_array.2.child": {},
        "test_form.test_array.3.child": {},
      };
      const wrapper = setup(mount, fourValues);
      expect(wrapper.find("FormNodeObject").length).toBe(4);
    });
  });

  describe("adding rows", () => {
    it("given one adds one", () => {
      const oneValue = { ...defaultProps };
      oneValue.valueManager.values = {
        "test_form.test_array.0.child": {},
      };
      const wrapper = setup(mount, oneValue);
      wrapper.find("button[type='add']").simulate("click");
      expect(wrapper.props().valueManager.update.mock.calls[0]).toEqual([{
        path: "test_form.test_array.1.child",
        name: "child",
        value: {},
      }]);
      wrapper.props().valueManager.update.mockClear()
    });

    it("given multiple, adds one", () => {
      const oneValue = { ...defaultProps };
      oneValue.valueManager.values = {
        "test_form.test_array.0.child": {},
        "test_form.test_array.1.child": {},
        "test_form.test_array.2.child": {},
      };
      const wrapper = setup(mount, oneValue);
      wrapper.find("button[type='add']").simulate("click");
      expect(wrapper.props().valueManager.update.mock.calls[0]).toEqual([{
        path: "test_form.test_array.3.child",
        name: "child",
        value: {},
      }]);
      wrapper.props().valueManager.update.mockClear()
    });
  });

  describe("deleting rows", () => {
    it("should delete only one row on button", () => {
      const oneValue = { ...defaultProps };
      oneValue.valueManager.values = {
        "test_form.test_array.0.child": {},
        "test_form.test_array.1.child": {},
        "test_form.test_array.2.child": {},
      };
      const wrapper = setup(mount, oneValue);
      wrapper.find("button[type='delete']").first().simulate("click");
      expect(wrapper.props().valueManager.deleteRow.mock.calls[0]).toEqual([{
        path: "test_form.test_array",
        index: 0,
      }]);
      wrapper.props().valueManager.update.mockClear()
    });

    it("should not delete the last input", () => {
      const oneValue = { ...defaultProps };
      oneValue.valueManager.values = {
        "test_form.test_array.0.child": {},
      };
      const wrapper = setup(mount, oneValue);
      wrapper.find("button[type='delete']").simulate("click");
      wrapper.update();
      expect(wrapper.find("FormNodeObject").length).toBe(1);
      wrapper.props().valueManager.update.mockClear();
    });
  });
});
