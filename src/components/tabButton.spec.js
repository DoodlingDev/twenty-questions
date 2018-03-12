/* eslint require-jsdoc: "off" */
import React from "react";
import TabButton from "./tabButton";;
import { /* shallow,  mount */ } from "enzyme";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

describe("rendering", () => {
  it("renders array types correctly", () => {
    const render = renderer
      .create(
        <TabButton

        />
      )
      .toJSON();
    expect(render).toMatchSnapshot();
  });
});
