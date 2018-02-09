// @flow
import React from "react";
import FormNodeObject from "./nodes/types/object";
import FormNodeString from "./nodes/types/string";

export const FormNode = (props: q20$Node) => {
  const { type, path, ...carryThroughProps } = props;
  const nodePath = `${path}.${props.name}`;
  switch (type) {
    case "object":
      return <FormNodeObject
        key={"formNode-"+nodePath}
        path={nodePath}
        {...carryThroughProps}
      />

    case "boolean":
      if (props.register) {props.register(nodePath);}
      break;

    case "string":
      if (props.register) {props.register(nodePath);}
      return <FormNodeString
        key={"formNode-"+nodePath}
        path={nodePath}
        {...carryThroughProps}
      />

    case "array":
      if (props.register) {props.register(nodePath);}
      break;

    case "number":
      if (props.register) {props.register(nodePath);}
      break;

    default:
      throw new Error(
      "FormNode was supplied an invalid type." +
      ` The type ${props.type} is not valid.`,
      );
  }
};

export default FormNode;
