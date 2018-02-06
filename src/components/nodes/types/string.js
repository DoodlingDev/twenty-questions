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
          <label htmlFor={props.path} className={cn("node", "string", "label")}>
            {props.label}
          </label>
        )}

        <input
          className={cn("node", "string", "input")}
          id={props.path}
          type="text"
        />
      </div>
    );
  }
};

export default FormNodeString;
