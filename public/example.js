import React from "react";
import ReactDOM from "react-dom";
import Form from "index";

const ExampleApp = props => {
  return <Form
    schema={{
      title: "This is a form",
      description: "Please treat this like a form",
      properties: [
        {
          // type: "object",
          // name: "form-name",
          // label: "A simple form",
          // description: "Please, a form sir",
          // properties: [
          //   {
              type: "string",
              name: "a_string",
              title: "A String",
              description: "A simple string",
            // }
          // ]
        }
      ],
    }}
  />
};

ReactDOM.render(
  <ExampleApp />,
  document.getElementById("app-root")
);

