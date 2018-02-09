// @flow
import React from "react";
import FormNodeObject from "./nodes/types/object";
import FormNodeString from "./nodes/types/string";

export const FormNode = (props: q20$Node) => {
  const nodePath = `${props.path}.${props.name}`;
  switch (props.type) {
    case "object":
      return <FormNodeObject
          name={props.name}
          key={"formNode-"+nodePath}
          path={nodePath}
          label={props.label}
          description={props.description}
          widget={props.widget}
          widgets={props.widgets}
          properties={props.properties}
          valueManager={props.valueManager}
          register={props.register}
        />

    case "boolean":
      if (props.register) {props.register(nodePath);}
      break;

    case "string":
      if (props.register) {props.register(nodePath);}
        return <FormNodeString
          key={"formNode-"+nodePath}
          name={props.name}
          path={nodePath}
          label={props.label}
          description={props.description}
          widget={props.widget}
          widgets={props.widgets}
          valueManager={props.valueManager}
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
