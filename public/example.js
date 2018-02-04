import React from "react";
import ReactDOM from "react-dom";
import Form from "index";

const ExampleApp = (props) => {
  return pug`
    Form(
      schema = {}
    )
  `;
};

ReactDOM.render(
  pug`ExampleApp`,
  document.getElementById("app-root")
);

