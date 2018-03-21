// @flow
import React from "react";
import cn from "../../../utils/className";
import ErrorHandler from "../../errorHandler";

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
    let NodeComponent = props.widgets[props.widget];
    return <NodeComponent key={`node-${props.path}`} {...props} />;
    // do a thing with a widget
  } else {
    return (
      <div className={cn("node", "boolean")}>
        {props.label && (
          <label
            htmlFor={props.path}
            className={cn(
              "nodeBoolean",
              props.name,
              "label",
              props.layoutStyle,
            )}
          >
            {props.label}
            {props.description && (
              <span
                htmlFor={props.path}
                className={cn(
                  "nodeBoolean",
                  props.name,
                  "description",
                  props.layoutStyle,
                )}
              >
                {props.description}
              </span>
            )}
          </label>
        )}

        {!props.label &&
          props.description && (
            <span
              htmlFor={props.path}
              className={cn(
                "nodeBoolean",
                props.name,
                "description",
                props.layoutStyle,
              )}
            >
              {props.description}
            </span>
          )}

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
