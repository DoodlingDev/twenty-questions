import React from "react";
import FormController from "../../src/components/formController.js";
import renderer from "react-test-renderer";

it("renders correctly", () => {
  const render = renderer.create(
    <FormController
      schema={{
        title: "test form title",
        description: "this is a test form",
          properties: [
            {
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
      }}
    />
  ).toJSON();
  expect(render).toMatchSnapshot();
});
