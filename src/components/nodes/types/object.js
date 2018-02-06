// @flow
import React from "react";
import FormNode from "../../formNode";

export const FormNodeObject = (props: q20$RenderedNode) => {
  let nodeContent = null;
  if (props.properties) {
    nodeContent = props.properties.map((property: q20$Node) => {
      return (
        <FormNode
          key={`node-${props.path}.${property.name}`}
          path={`${props.path}`}
          widgets={props.widgets}
          valueManager={props.valueManager}
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
