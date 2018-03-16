/* eslint require-jsdoc: "off" */
import React from "react";
import OnFocus from "./onFocus";
import /* shallow,  mount */ "enzyme";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

const defaultTestProps = {

};

function setup(renderFn, testProps = defaultTestProps) {
  return renderFn(<OnFocus {...testProps} />);
}

describe("rendering", () => {
  it("renders correctly", () => {
    const render = renderer.create(<OnFocus />).toJSON();
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
  })

  it("should render the inputs view if focused", () => {
    const wrapper = setup(mount);
    wrapper.state.focused = true;
    wrapper.update();
    expect(wrapper.find("input").length < 1).toBe(false);
  })
});

