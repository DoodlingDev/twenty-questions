import React from "react";
import cn from "../../utils/className";

type Props = {
  label: string,
  path: string,
  name: string,
  layoutStyle: string,
  description: string,
};

const LabelAndDescription = (props: Props) => {
  return (
    <div
      className={cn(
        "node",
        props.name,
        "labelAndDescription",
        props.layoutStyle,
      )}
    >
      {props.label && (
        <label
          htmlFor={props.path}
          className={cn("node", props.name, "label", props.layoutStyle)}
        >
          {props.label}
          {props.description && (
            <span
              htmlFor={props.path}
              className={cn(
                "node",
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
            className={cn("node", props.name, "description", props.layoutStyle)}
          >
            {props.description}
          </span>
        )}
    </div>
  );
};

export default LabelAndDescription;
