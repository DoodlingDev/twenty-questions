/* eslint require-jsdoc: "off" */
import React from "react";
import FormController from "../../src/components/formController.js";
import renderer from "react-test-renderer";
import { shallow, mount } from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

const setupProps = {
  schema: {
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
  },
}

it("renders correctly", () => {
  const render = renderer.create(
    <FormController
      {...setupProps}
    />
  ).toJSON();
  expect(render).toMatchSnapshot();
});

function setup(renderFn, props = setupProps) {
  return renderFn(<FormController {...props}/>);
}

describe("handles import correctly", () => {
  let error;
  const notObjectFirstParam = {
    title: "setup without first param object",
    description: "this should throw an error",
    properties: [
      {
        type: "string",
        name: "blow-up",
        properties: [{}],
      }
    ]
  };
  try {
    setup(shallow, notObjectFirstParam);
  } catch(err) {
    error = err;
  }
  expect(error).toBeTruthy();
});
