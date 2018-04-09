import React from "react";
import cn from "../../../utils/className";

const StyledBoolean = (props: q20$RenderedNode) => {
  let checkedValue;
  if (props.valueManager.values[props.path] == true) {
    checkedValue = " checked";
  } else {
    checkedValue = "";
  }

  return (
    <div className={cn("node", "boolean")}>
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
    </div>
  );
};

export default StyledBoolean;
