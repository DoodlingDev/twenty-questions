import React from "react";
import FormNode from "../src/components/formNode";
import { shallow, mount } from "enzyme";
import renderer from "react-test-renderer";
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe("rendering", () => {
  it("renders string types correctly", () => {
    const render = renderer.create(
      <FormNode
        type="string"
        name="test_string"
        title="string title"
        description="A simple String"
        valueManager={{
          update: () => {},
          values: {},
          validate: {},
        }}
      />
    ).toJSON();
    expect(render).toMatchSnapshot();
  });
});
