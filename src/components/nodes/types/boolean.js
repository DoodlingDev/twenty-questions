// @flow
import React from "react";
import cn from "../../../utils/className";
import ErrorHandler from "../../errorHandler";
import LabelAndDescription from "../../common/labelAndDescription";

export const FormNodeBoolean = (props: q20$RenderedNode) => {
  if (process.env.NODE_ENV != "production" && process.env.NODE_ENV != "test") {
    if (!props.label) {
      console.warn(
        `Consider adding a label to the field ${
          props.path
        }. Labels are an important accessibilty feature for screen readers and other assistive devices. If you don't want the label to display, pass this input the "no-label" layoutStyle. Placeholders are not substitutes for label elements.`,
      );
    }
  }
  const thisValue =
    props.valueManager.values[props.path] || props.defaultValue || false;
  if (props.widget) {
    const downcasedWidgetName = props.widget.toLowerCase();
    let NodeComponent = props.widgets[downcasedWidgetName];
    return <NodeComponent key={`node-${props.path}`} {...props} />;
  } else {
    return (
      <div className={cn("node", "boolean", props.layoutStyle)}>
        <LabelAndDescription
          label={props.label}
          path={props.path}
          name={props.name}
          layoutStyle={props.layoutStyle}
          description={props.description}
        />
        <ErrorHandler
          key={`errorHandler-${props.path}`}
          name={props.name}
          path={props.path}
          value={props.valueManager.values[props.path]}
          label={props.label || props.name}
          validations={props.valueManager.validate[props.path]}
        >
          <input
            key={`${props.path}-input`}
            className={cn(
              "nodeBoolean",
              props.name,
              "input",
              props.layoutStyle,
            )}
            id={props.path}
            type="checkbox"
            checked={thisValue}
            placeholder={props.placeholder}
            onChange={event => {
              props.valueManager.update({
                path: props.path,
                name: props.name,
                value: !thisValue,
              });
            }}
          />
        </ErrorHandler>
      </div>
    );
  }
};

export default FormNodeBoolean;
