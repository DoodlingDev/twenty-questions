import React from "react";
import FormNodeString from "../../../../src/components/nodes/types/string";
// import { shallow, mount } from "enzyme";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

describe("rendering", () => {
  it("renders string types correctly", () => {
    const render = renderer
      .create(
        <FormNodeString
          name="test_string"
          label="test string"
          path="test_form.test_string"
          title="string title"
          description="A simple String"
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
