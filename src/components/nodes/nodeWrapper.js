// @flow
import React from "react";
import ErrorHandler from "../errorHandler";
import LabelAndDescription from "../common/labelAndDescription";
import checkForConditionalRendering from "../../utils/checkForConditionalRendering";
import cn from "../../utils/className";

export const NodeWrapper = (props: q20$RenderedNode) => {
  let nodeContent = checkForConditionalRendering(props);
  return (
    <div className={cn("node", props.type)}>
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
        {props.children}
      </ErrorHandler>
      {nodeContent}
    </div>
  );
};

export default NodeWrapper;
