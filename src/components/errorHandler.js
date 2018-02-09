// @flow
import React from "react";
import cn from "../utils/className";
// $FlowFixMe
import { filter } from "lodash";

export const ErrorHandler = (props: q20$ErrorHandlerProps) => {
  const validationsData = props.validations || [];
  const errors = filter(validationsData, val => !val.valid);
  const valid = errors.length <= 0 && validationsData.length > 0;

  /**
   * mapErrors
   *   creates the array of errors elements for rendering
   * @return {array} Array of errors
   */
  function mapErrors() {
    return errors.map((err, i) =>
      <li className={cn(props.name, "errorHandler", "errorMessage")} key={`error-${props.path}-${i}`}>
        {err.message}
      </li>
    );
  }

  let renderValidation = null;
  let validityClass = "";
  if (errors.length > 0 && !valid) {
    renderValidation = (
      <ul className={cn(props.name, "errorHandler", "errorList")}>
        {mapErrors()}
      </ul>
    );
    validityClass = "errorData";
  } else if (valid) {
    renderValidation = (
      <span className={cn(props.name, "errorHandler", "validIndicator")}>
        {`${props.label} ✔︎`}
      </span>
    );
    validityClass = "validData";
  }

  return (
    <div className={cn(props.name, "errorHandler", validityClass)}>
      {props.children}
      {renderValidation}
    </div>
  )
};

export default ErrorHandler;
