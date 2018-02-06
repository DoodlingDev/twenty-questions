// @flow
import React from "react";

export const FormNodeString = (props: q20$RenderedNode) => {
  return (
    <div>
      {props.label &&
        <label htmlFor={props.path}>{props.label}</label>
      }

      <input id={props.path} type="text"></input>
    </div>
  );
};

export default FormNodeString;
