// @flow
import React from "react";
import FormNodeString from "./string";
import FormNodeBoolean from "./boolean";
import FormNodeNumber from "./number";
//import FormNodeArray from "./array";

export const FormNodeObject = (props: q20$RenderedNode) => {
  if (props.register) {
    props.register(props.path);
  }
  const nodeTypes = {
    string: FormNodeString,
    boolean: FormNodeBoolean,
    number: FormNodeNumber,
    // array: FormNodeArray,
    object: FormNodeObject,
  };

  let nodeContent = null;
  if (props.properties) {
    nodeContent = props.properties.map((property: q20$Node) => {
      if (!Object.keys(nodeTypes).includes(property.type)) {
        throw new Error(
          "FormNode was supplied an invalid type." +
            ` The type ${property.type} is not valid.`,
        );
      }

      const nodePath = `${props.path}.${property.name}`;
      if (props.register) {
        props.register(nodePath);
      }
      const NodeComponent = nodeTypes[property.type];
      return (
        <NodeComponent
          key={`node-${props.path}.${property.name}`}
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
