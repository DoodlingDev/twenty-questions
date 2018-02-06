// @flow
import React from "react";
import cn from "../../../utils/className";

export const FormNodeString = (props: q20$RenderedNode) => {
  if (props.widget) {
    // return props.widgets[props.widget]({...props});
    const WidgetTag = props.widgets[props.widget];
    return <WidgetTag
             {...props}
           />
  } else {
    return (
      <div className={cn("node", "string")}>
        {props.label && (
          <label htmlFor={props.path} className={cn("nodeString", props.name, "label", props.layoutStyle)}>
            {props.label}
          </label>
        )}

        {props.description && (
          <span htmlFor={props.path} className={cn("nodeString", props.name, "description", props.layoutStyle)}>{props.description}</span>
        )}

        <input
          className={cn("nodeString", props.name, "input", props.layoutStyle)}
          id={props.path}
          type="text"
        />
      </div>
    );
  }
};

export default FormNodeString;
