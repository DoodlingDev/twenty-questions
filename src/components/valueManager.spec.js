/* eslint require-jsdoc: "off" */
import React from "react";
import withValueManager from "../../src/components/valueManager";
import { shallow, mount } from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

const setupProps = {
  title: "test form title",
  description: "this is a test form",
  properties: [
    {
      // this name is left with a space specifically to
      // test that names get camelized
      name: "test name",
      type: "object",
      properties: [
        {
          type: "string",
          name: "testString",
        },
      ],
    },
  ],
};

function setup(renderFn, testProps = setupProps) {
  const ComponentUnderTest = withValueManager("<div></div>");
  return renderFn(<ComponentUnderTest {...testProps} />);
}

describe("changeValue", () => {
  it("should update when given the correct input", () => {
    const wrapper = setup(shallow);
    wrapper.instance().changeValue({
      path: "test.path",
      name: "test_name",
      value: "test value",
    });
    wrapper.update();
    expect(wrapper.state().values).toMatchObject({
      "test.path": "test value",
    });
  });

  it("shouldn't change the state when incorrect input is passed", () => {
    const wrapper = setup(shallow);
    wrapper.instance().changeValue({
      path: "test.path",
      name: "test_name",
    });
    wrapper.update();
    expect(wrapper.state().values).not.toMatchObject({
      "test.path": undefined,
    });
  });

  it("should call callback after changing", () => {
    const wrapper = setup(shallow);
    const mockCallback = jest.fn();
    wrapper.instance().changeValue(
      {
        path: "test.path",
        name: "test_name",
        value: "boop",
      },
      mockCallback,
    );
    wrapper.update();
    // timeout is for the async actions taking place here to complete
    setTimeout(() => {
      expect(mockCallback).toHaveBeenCalledWith({
        path: "test.path",
        name: "test_name",
        value: "boop",
      });
    }, 10);
  });
});

describe("registerField", () => {
  it("should store paths in the registry thru registerField", () => {
    const wrapper = setup(shallow);
    wrapper.instance().registerField("testFormTitle.testName.testString");
    wrapper.instance().registerField("testFormTitle.testName.testArray");
    expect(wrapper.state().fieldRegistry.length).toEqual(2);
    expect(wrapper.state().fieldRegistry).toContain(
      "testFormTitle.testName.testString",
    );
  });

  it("should update with unique paths", () => {
    const wrapper = setup(shallow);
    const n = wrapper.state().fieldRegistry.length;
    wrapper.instance().registerField("purple.people.eater");
    wrapper.update();
    expect(wrapper.state().fieldRegistry.length).toEqual(n + 1);
  });

  it("should not update with non-unique paths", () => {
    const wrapper = setup(shallow);
    wrapper.instance().registerField("testFormTitle.testName.testString");
    wrapper.update();
    const n = wrapper.state().fieldRegistry.length;
    wrapper.instance().registerField(wrapper.state().fieldRegistry[0]);
    wrapper.update();
    expect(wrapper.state().fieldRegistry.length).toEqual(n);
  });
});

describe("deleteRowValue", () => {
  const arrayValue = {
    "testFormTitle.testName.testArray": {},
    "testFormTitle.testName.testArray.0.a": {},
    "testFormTitle.testName.testArray.0.a.one": "A",
    "testFormTitle.testName.testArray.0.a.two": "B",
    "testFormTitle.testName.testArray.1.a": {},
    "testFormTitle.testName.testArray.1.a.one": "AA",
    "testFormTitle.testName.testArray.1.a.two": "BB",
    "testFormTitle.testName.testArray.2.a": {},
    "testFormTitle.testName.testArray.2.a.one": "AAA",
    "testFormTitle.testName.testArray.2.a.two": "BBB",
    "testFormTitle.testName.testArray.3.a": {},
    "testFormTitle.testName.testArray.3.a.one": "AAAA",
    "testFormTitle.testName.testArray.3.a.two": "BBBB",
  };

  it("should remove the row in question", () => {
    const wrapper = setup(shallow);
    wrapper.instance().state.values = { ...arrayValue };
    const valueLength = Object.keys(wrapper.state().values).length;
    wrapper.instance().deleteRowValue({
      path: "testFormTitle.testName.testArray",
      index: 1,
    });
    wrapper.update();
    expect(Object.keys(wrapper.state().values).length).toBe(valueLength - 3);
  });

  it("should preserve data", () => {
    const wrapper = setup(shallow);
    wrapper.instance().state.values = { ...arrayValue };
    wrapper.instance().deleteRowValue({
      path: "testFormTitle.testName.testArray",
      index: 1,
    });
    wrapper.update();
    const allCorrect = (function() {
      const values = wrapper.state().values;

      for (let i = 0, l = 3; i < l; i++) {
        if (!values[`testFormTitle.testName.testArray.${i}.a.one`]) continue;
        if (
          values[`testFormTitle.testName.testArray.${i}.a.one`].length !==
          values[`testFormTitle.testName.testArray.${i}.a.two`].length
        )
          return false;

        if (
          !/A+/.test(values[`testFormTitle.testName.testArray.${i}.a.one`]) ||
          !/B+/.test(values[`testFormTitle.testName.testArray.${i}.a.two`])
        )
          return false;
      }
      return true;
    })();
    expect(allCorrect).toBeTruthy();
  });

  it("should decrement the numbers properly", () => {
    const wrapper = setup(shallow);
    wrapper.instance().state.values = { ...arrayValue };
    wrapper.instance().deleteRowValue({
      path: "testFormTitle.testName.testArray",
      index: 1,
    });
    wrapper.update();
    const hasNoThrees = (function() {
      for (let keyName in wrapper.state().values) {
        if (/3/.test(keyName)) return false;
      }
      return true;
    })();
    expect(hasNoThrees).toBeTruthy();
  });
});
