// @flow
import React from "react";
import FormNode from "./formNode";

type q20$FormBuilderProps = {
  title?: string,
  description?: string,
  properties: q20$Node[],
};

export const FormBuilder = (props: q20$FormBuilderProps) => {
  const formContent = props.properties.map((property: q20$Node) => {
    return (
      <FormNode
        title={property.title}
        description={property.title}
        name={property.name}
        type={property.type}
        properties={property.properties}
      />
    );
  });
  return formContent;
};

export default FormBuilder;
