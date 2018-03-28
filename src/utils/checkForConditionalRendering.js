import React from "react";
import camelize from "./camelize";
import FormNodeObject from "../components/nodes/types/object";

/**
 * checkForConditionalRendering
 *   Checks the form schema to see if there is a conditional rendering set
 *   for the current node.
 *
 * @param {object} props props for the node component passed through from
 *  parent and parsed from json schema
 * @return {object} Rendered Node component or null if no conditional needed
 */
export default function checkForConditionalRendering(props) {
  if (props.conditional && props.properties && Object.keys(props.properties).includes(props.valueManager.values[props.path])) {
    const property = props.properties[props.valueManager.values[props.path]];
    return(
      <FormNodeObject
        key={`tab-object-${camelize(property.label || property.name)}`}
        name={property.name}
        label={property.label ? property.label : undefined}
        description={property.description}
        type="object"
        path={props.path + "." + property.name}
        properties={property.properties}
        widgets={props.widgets}
        widget={property.widget ? property.widget : undefined}
        valueManager={props.valueManager}
        register={props.register}
      />
    );
  }
  return null;
}
