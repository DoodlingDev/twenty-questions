// @flow
import React from "react";
import withValueManager from "./valueManager";
import FormNodeObject from "./nodes/types/object";
import getWidgets from "../utils/getWidgets";
import withValidation from "./validator";
import ErrorHandler from "./errorHandler";
import camelize from "../utils/camelize";
import withTabbedNavigation from "./tabbedNavigation";

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
  submitFn,
  submitValues,
  tabs,
  fieldRegistry,
  submitButton = <button type="submit">Submit</button>,
  typeAheadValidation = true,
  errorHandlerComponent = ErrorHandler,
}: q20$FormControllerProps) => {
  function mapProperties() {
    return properties.map(property => {
      console.log(tabs.tabLabels);
      return (
        <FormNodeObject
          key={`top-object-${camelize(title)}`}
          name={camelize(title)}
          label={label ? label : undefined}
          description={description}
          type={"object"}
          path={`${camelize(title)}`}
          properties={property.properties}
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
      );
    });
  }

  const tabButtons = (() => {
    return tabs.tabLabels.map((label, index) => {
      return <button
        key={label}
        onClick={event => {
          event.preventDefault();
          tabs.setTab(index);
        }}
        >
          {label}
        </button>
    });
  })()

  return (
    <form>
      {tabs.tabbed && tabButtons}

      {title && <h2>{title}</h2>}
      {description && <h3>{description}</h3>}

      {mapProperties()[tabs.activeTab]}
      {React.cloneElement(submitButton, {
        onClick: event => {
          event.preventDefault();
          if (validate.all(values, fieldRegistry)) {
            submitFn(submitValues());
          }
        },
      })}
    </form>
  );
};

export default withTabbedNavigation(
  withValueManager(withValidation(FormController)),
);
