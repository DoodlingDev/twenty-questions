import React from "react";
import ReactDOM from "react-dom";
import Form from "index";

const ExampleApp = props => {
  return <Form
    title="FORM"
    description="This is a form"
    submitButton={<button type="submit">Submit me</button>}
    properties={[
      {
        type: "object",
        name: "form-name",
        label: "A simple form",
        properties: [
          {
            type: "string",
            name: "a_string",
            label: "A String",
            validates: ["required"],
          },
          {
            type: "string",
            name: "b_string",
            label: "B String",
            validates: ["required"],
          },
          {
            type: "array",
            name: "an_array",
            label: "An Array",
            properties: [
              {
                type: "object",
                name: "array_row",
                label: "In Array",
                properties: [
                  {
                    type: "string",
                    name: "c_string",
                    label: "C String",
                    validates: ["required"],
                  }
                ]
              }
            ]
          },
        ],
      },
    ]}
  />
};

ReactDOM.render(
  <ExampleApp />,
  document.getElementById("app-root")
);

