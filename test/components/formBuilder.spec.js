import React from "react";
import FormBuilder from "../../src/components/formBuilder";
import renderer from "react-test-renderer";

it("renders correctly", () => {
  const rendered = renderer.create(
    pug`
      FormBuilder(
        schema={
          name: "test builder",
          properties: [],
        }
      )
    `
  ).toJSON();
  expect(rendered).toMatchSnapshot();
});
