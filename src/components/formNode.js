// @flow
import React from "react";
import FormNodeString from "./nodes/types/string";

export const FormNode = (props: q20$Node) => {
  switch (props.type) {
    case "object":
      break;

    case "boolean":
      break;

    case "string":
        return <FormNodeString
          name={props.name}
          path={`${props.path}.${props.name}`}
          label={props.label}
          description={props.description}
          widget={props.widget}
          widgets={props.widgets}
        />

    case "array":
      break;

    case "number":
      break;

    default:
      throw new Error(
      `FormNode was supplied an invalid type.
      The type ${props.type} is not valid.`,
      );
  }
};

export default FormNode;
