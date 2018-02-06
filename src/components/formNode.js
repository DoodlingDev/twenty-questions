// @flow
import React from "react";

export const FormNode = (props: q20$Node) => {
  switch (props.type) {
    case "object":

    case "boolean":

    case "string":

    case "array":

    case "number":

    default:
      throw new Error(
      `FormNode was supplied an invalid type.
      The type ${props.type} is not valid.`,
      );
  }
};

export default FormNode;
