// @flow
import React from "react";
import FormNode from "./formNode";

export const FormBuilder = ({schema, ...props}: {schema: Schema, props: any}) => {
  const nodeArray = schema.properties.map(property => {
    return pug`
      FormNode(
        key=schema.name + "." + property.name,
        path=schema.name + "." + property.name,
        schema=property,
        ...props
      )
    `;
  });
  return nodeArray;
};

export default FormBuilder;
