// @flow
import React from "react";
import cn from "../../../utils/className";
import NodeWrapper from "../nodeWrapper";

export const FormNodeString = (props: q20$RenderedNode) => {
  if (process.env.NODE_ENV != "production" && process.env.NODE_ENV != "test") {
    if (!props.label) {
      console.warn(
        `Consider adding a label to the field ${
          props.path
        }. Labels are an important accessibilty feature for screen readers and other assistive devices. If you don't want the label to display, pass this input the "no-label" layoutStyle. Placeholders are not substitutes for label elements.`,
      );
    }
  }
  if (props.widget) {
    const downcasedWidgetName = props.widget.toLowerCase();
    const WidgetTag = props.widgets[downcasedWidgetName];
    return <NodeWrapper {...props}><WidgetTag {...props} /></NodeWrapper>;
  } else {
    return (
      <NodeWrapper {...props} >
        <input
          key={`${props.path}-input`}
          className={cn("nodeString", props.name, "input", props.layoutStyle)}
          id={props.path}
          type="text"
          value={props.valueManager.values[props.path] || ""}
          placeholder={props.placeholder}
          onChange={event => {
            props.valueManager.update({
              path: props.path,
              name: props.name,
              value: event.target.value,
            });
          }}
        />
      </NodeWrapper>
    );
  }
};

export default FormNodeString;
