/* eslint require-jsdoc: "off" */
import React from "react";
import withTabbedNavigation from "./tabbedNavigation";
import { shallow /* mount */ } from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

const setupProps = {
  properties: [
    {
      label: "one",
    },
    {
      label: "two",
    },
    {
      label: "three",
    },
  ],
};

function setup(renderFn, testProps = setupProps) {
  const ComponentUnderTest = withTabbedNavigation("<div />");
  return renderFn(<ComponentUnderTest {...testProps} />);
}

describe("On Mount", () => {
  it("reads length correctly", () => {
    const wrapper = setup(shallow);
    expect(wrapper.state().tabLength).toBe(2);
  });

  it("starts at activeIndex 0", () => {
    const wrapper = setup(shallow);
    expect(wrapper.state().activeIndex).toBe(0);
  });

  it("has all the labels", () => {
    const wrapper = setup(shallow);
    expect(wrapper.state().labelArray.length).toBe(3);
  });
});

describe("methods", () => {
  it("increments by one", () => {
    const wrapper = setup(shallow);
    wrapper.props().tabs.nextTab();
    wrapper.update();
    expect(wrapper.state().activeIndex).toBe(1);
  });

  it("decrements by one", () => {
    const wrapper = setup(shallow);
    wrapper.setState({ activeIndex: 2 });
    wrapper.props().tabs.prevTab();
    wrapper.update();
    expect(wrapper.state().activeIndex).toBe(1);
  });

  it("does not go below zero", () => {
    const wrapper = setup(shallow);
    wrapper.props().tabs.prevTab();
    wrapper.update();
    expect(wrapper.state().activeIndex).toBe(0);
  });

  it("does not go past length", () => {
    const wrapper = setup(shallow);
    wrapper.setState({ activeIndex: 2 });
    wrapper.update();
    wrapper.props().tabs.nextTab();
    wrapper.update();
    expect(wrapper.state().activeIndex).toBe(2);
  });

  it("sets to the passed active index", () => {
    const wrapper = setup(shallow);
    expect(wrapper.state().activeIndex).toBe(0);
    wrapper.props().tabs.setTab(2);
    wrapper.update();
    expect(wrapper.state().activeIndex).toBe(2);
  });
});
