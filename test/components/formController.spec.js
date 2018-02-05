import React from "react";
import FormController from "../../src/components/formController.js";
import renderer from "react-test-renderer";

it("renders correctly", () => {
  const render = renderer.create(
  pug`FormController(
    schema={
      title: "Test Form",
      description: "This is a test Form",
      properties: [{}],
    })`
  ).toJSON();
  expect(render).toMatchSnapshot();
});
