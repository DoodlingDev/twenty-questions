// @flow
import React from "react";
import cn from "../../../utils/className";

export const FormNodeString = (props: q20$RenderedNode) => {
  if (process.env.NODE_ENV != "production" && process.env.NODE_ENV != "test") {
    if (!props.label) {
      console.warn(`Consider adding a label to the field ${props.path}. Labels are an important accessibilty feature for screen readers and other assistive devices. If you don't want the label to display, pass this input the "no-label" layoutStyle. Placeholders are not substitutes for label elements.`)
    }
  }
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
            {props.description && (
              <span htmlFor={props.path} className={cn("nodeString", props.name, "description", props.layoutStyle)}>{props.description}</span>
            )}
          </label>
        )}

        {!props.label && props.description && (
          <span htmlFor={props.path} className={cn("nodeString", props.name, "description", props.layoutStyle)}>{props.description}</span>
        )}

        <input
          className={cn("nodeString", props.name, "input", props.layoutStyle)}
          id={props.path}
          type="text"
          value={props.valueManager.values[props.name]}
          placeholder={props.placeholder}
          onChange={event => {
            props.valueManager.update({
              path: props.path,
              name: props.name,
              value: event.target.value,
            });
          }}
        />
      </div>
    );
  }
};

export default FormNodeString;
