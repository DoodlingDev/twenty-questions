import React from "react";
import cn from "../../../utils/className";
import ErrorHandler from "../../errorHandler";

const StyledBoolean = (props: q20$RenderedNode) => {
  let checkedValue;
  if (props.valueManager.values[props.path] == true) {
    checkedValue = " checked";
  } else {
    checkedValue = "";
  }

  return (
    <div className={cn("node", "boolean")}>
      {props.label && (
        <label
          htmlFor={props.path}
          className={cn("nodeBoolean", props.name, "label", props.layoutStyle)}
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
        <div className={cn("styled-boolean-widget", props.path, "container")}>
          <button
            className={cn(
              "styled-boolean-widget",
              props.path,
              "box",
              checkedValue,
            )}
            name={props.name}
            onClick={event => {
              event.preventDefault();
              props.valueManager.update({
                path: props.path,
                name: props.name,
                value: !props.valueManager.values[props.path],
              });
            }}
          />
        </div>
      </ErrorHandler>
    </div>
  );
};

export default StyledBoolean;
