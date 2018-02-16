// @flow
import React from "react";
import withValueManager from "./valueManager";
import FormNodeObject from "./nodes/types/object";
import getWidgets from "../utils/getWidgets";
import withValidation from "./validator";
import ErrorHandler from "./errorHandler";
import camelize from "../utils/camelize";

/**
 * FormController
 *   master component for twenty-questions. Responsible for rendering
 *   the first object from the passed in schema, as well as being
 *   wrapped with other components that handle state and validation.
 * @return {Component} rendered React Component
 */
export const FormController = ({
  widgets,
  widget,
  title,
  description,
  properties,
  label,
  validate,
  deleteRow,
  values,
  changeValue,
  registerField,
  typeAheadValidation = true,
  errorHandlerComponent = ErrorHandler,
}: q20$FormControllerProps) => {
  return (
    <form>
      <h2>{title}</h2>
      {description && <h3>{description}</h3>}

      <FormNodeObject
        key={`top-object-${camelize(title)}`}
        name={camelize(title)}
        label={label ? label : undefined}
        description={description}
        type={"object"}
        path={`${camelize(title)}`}
        properties={properties}
        widgets={getWidgets(widgets)}
        widget={widget ? widget : undefined}
        valueManager={{
          update: changeParams => {
            changeValue(changeParams, () => {
              if (typeAheadValidation) {
                validate.single(changeParams);
              }
            });
          },
          values: values,
          validate: validate.state,
          deleteRow: changeParams => {
            validate.deleteRow(changeParams);
            deleteRow(changeParams);
          },
        }}
        register={registerField}
      />
    </form>
  );
};

export default withValueManager(withValidation(FormController));
