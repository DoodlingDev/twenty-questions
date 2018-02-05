import React from "react";
import FormController from "../../src/components/formController.js";
import renderer from "react-test-renderer";

it("renders correctly", () => {
  const render = renderer.create(
    <FormController
    />
  ).toJSON();
  expect(render).toMatchSnapshot();
});
