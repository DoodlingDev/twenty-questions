// @flow
import React from "react";
import FormNode from "../../formNode";

export const FormNodeObject = (props: q20$RenderedNode) => {
  let nodeContent = null;
  if (props.properties) {
    nodeContent = props.properties.map((property: q20$Node) => {
      return (
        <FormNode
          key={`${props.path}.${property.name}`}
          label={property.label ? property.label : undefined}
          description={property.description}
          name={property.name}
          type={property.type}
          widget={property.widget}
          properties={property.properties}
          path={`${props.path}.${property.name}`}
          widgets={props.widgets}
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
