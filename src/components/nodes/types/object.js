// @flow
import React from "react";
import FormNodeString from "./string";
import FormNodeBoolean from "./boolean";
import FormNodeNumber from "./number";
import FormNodeArray from "./array";
import camelize from "../../../utils/camelize";

export const FormNodeObject = (props: q20$RenderedNode) => {
  const nodeTypes = {
    string: FormNodeString,
    boolean: FormNodeBoolean,
    number: FormNodeNumber,
    array: FormNodeArray,
    object: FormNodeObject,
    "object:nosubmit": FormNodeObject,
  };

  let nodeContent = null;
  if (props.properties) {
    nodeContent = props.properties.map((property: q20$RenderedNode) => {
      if (!Object.keys(nodeTypes).includes(property.type)) {
        throw new Error(
          "FormNode was supplied an invalid type." +
            ` The type ${property.type} is not valid.`,
        );
      }

      const nodePath = `${props.path}.${camelize(property.name)}`;
      if (props.register) {
        props.register(nodePath);
      }
      const NodeComponent = nodeTypes[property.type];
      return (
        <NodeComponent
          key={`node-${nodePath}`}
          path={nodePath}
          widgets={props.widgets}
          valueManager={props.valueManager}
          register={props.register}
          {...property}
        />
      );
    });
  } else {
    throw new Error(
      `The node ${props.name} with type "object" has no properties.`,
    );
  }
  return (
    <div>
      {props.label && <label>{props.label}</label>}

      {props.description && <span>{props.description}</span>}

      {nodeContent}
    </div>
  );
};

export default FormNodeObject;
