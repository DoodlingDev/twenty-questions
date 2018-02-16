import React, { Component } from "react";
import gatherValidations from "../utils/gatherValidations";
import * as builtInValidationRules from "../utils/validationRules";
import { filter } from "lodash";
import camelize from "../utils/camelize";
import reorderBasedOnPath, {
  deleteSelectedRowFromValues,
} from "../utils/reorderBasedOnPath";
/* eslint react/prop-types: "off" */

/**
 * Validator
 *   HOC component to be wrapped around FormController that encapsulates
 *   the handling of validations logic away from the controller component.
 *
 * @param {FormController} FormControllerComponent
 * @return {ReactClass} Validator. HOC component to wrap FormController
 */
export default function withValidation(FormControllerComponent) {
  return class Validator extends Component {
    /**
     * constructor
     *   class constructor
     * @param {object} props
     */
    constructor(props) {
      super(props);
      const customValidationRules = props.validationRules || {};
      this.validateSingle = this.validateSingle.bind(this);
      this.validateAll = this.validateAll.bind(this);
      this.addValidResult = this.addValidResult.bind(this);
      this.addErrorResult = this.addErrorResult.bind(this);
      this.checkStateForErrors = this.checkStateForErrors.bind(this);
      this.deleteValidationResultRow = this.deleteValidationResultRow.bind(
        this,
      );

      this.state = {
        validationList: gatherValidations(props.properties),
        validationRules: Object.assign(
          customValidationRules,
          builtInValidationRules,
        ),
        validationState: {},
      };
    }

    /**
     * validateSingle
     *   Runs a validation on a single change. changeData is passed in from
     *   the form and contains value, name, and path.
     *   - If there is no entry for the input's name in the validationList,
     *   it returns right away without any action.
     *   - Calls to the specified validation rule, and handles the response
     *   object either error or valid.
     * @param {q20$ValidationData} changeData the change object as sent up
     *   from the input entry.
     */
    validateSingle(changeData) {
      const validationListEntry = this.state.validationList[changeData.name];
      if (!validationListEntry) {
        return; // if there is no validation rule, we don't care
      }
      validationListEntry.validates.forEach(validationRule => {
        if (this.state.validationRules[validationRule] === undefined) {
          throw Error(
            `The property ${changeData.name} at ${changeData.path} ` +
              "is registered in the Validator with an invalid validation " +
              `rule: ${validationRule}. Check the form schema for mistakes, ` +
              "or if it is a custom validation, that it is being passed to " +
              "the Validator properly.",
          );
        } else {
          const validationResult = this.state.validationRules[validationRule]({
            label: this.state.validationList[changeData.name].label,
            ...changeData,
          });
          if (validationResult.valid) {
            this.addValidResult(validationResult);
          } else {
            this.addErrorResult(validationResult);
          }
        }
      });
    }

    /**
     * validateAll
     *   Checks validations on all fields in the formValues.
     *   - Iterates through the validationList and matches any fields in the form values
     *   whose paths contain the name of the field being validated.
     *   - If an entry in the form values is found matching the validation entry,
     *   it will be passed through the validateSingle function.
     *   - At the end, the validationState is checked for any entries where valid === false.
     *   If there are no failing validity objects, returns true to indicate all validations
     *   have passed.
     *
     * @param {q20$FormValues} formValues the entire state of the values in the form
     *   from the FormController
     * @param {string[]} registry field registry from FromController
     * @return {boolean} Pass/Fail
     */
    validateAll(formValues, registry) {
      // iterate the validationList
      const validationEntryKeys = Object.keys(this.state.validationList);
      validationEntryKeys.forEach(fieldValidationConfigName => {
        const fieldValidationConfig = this.state.validationList[
          fieldValidationConfigName
        ];
        const nameCheck = fieldValidationConfig.name;
        const nameCheckRegExp = new RegExp(`(^|\.)${nameCheck}($|\.)`);
        //
        // for each, comb the values
        registry.forEach(registeredPath => {
          if (nameCheckRegExp.test(registeredPath)) {
            //
            // any value path that matches the field name (dot to dot)
            //   gets its validations run
            this.validateSingle({
              path: registeredPath,
              name: fieldValidationConfig.name,
              value: formValues[registeredPath],
            });
          }
        });
      });
      return this.checkStateForErrors();
    }

    /**
     * checkStateForErrors
     *   iterates the validationState and returns false if it finds any
     *   failing validation objects.
     * @return {boolean} true if there are no errors
     */
    checkStateForErrors() {
      const validationStateEntryKeys = Object.keys(this.state.validationState);
      let isCompletelyValid = true;
      for (let i = 0, l = validationStateEntryKeys.length; i < l; i++) {
        const validationStateEntry = this.state.validationState[
          validationStateEntryKeys[i]
        ];
        if (isCompletelyValid === false) return false;
        validationStateEntry.forEach(validationEntry => {
          if (validationEntry.valid === false) {
            isCompletelyValid = false;
          }
        });
      }
      return isCompletelyValid;
    }

    /**
     * deleteValidationResultRow
     *   Removes all validation entries whose paths match the given path and
     *   cointain the given index.
     *   Fields with higher number indexes are shifted down to keep 0, 1, 2+
     *   ordering in tact
     *   Updates to the validationState with new index order
     * @param {string} path path of the array field that is deleting a line,
     *   from the beginning to the index.
     * @param {number} index index of the row being removed
     *
     */
    deleteValidationResultRow({ path, index }) {
      this.setState(oldState => {
        const valueState = { ...oldState.validationState };
        const valueAfterDelete = deleteSelectedRowFromValues({
          path: path,
          index: index,
          state: valueState,
        });

        const newValueState = reorderBasedOnPath({
          path: path,
          index: index,
          state: valueAfterDelete,
        });
        const newState = { ...oldState };
        newState.validationState = newValueState;
        return newState;
      });
    }

    /**
     * addValidResult
     *   - Removes any reference to the current input path's listing
     *   in validatioNState if the validation name matches. i.e. if an
     *   error for "required" exists, this would erase that.
     *   - Then adds the validation result object into the validationState
     *
     * @param {q20$ValidResult} result the validation result object
     *   passed from the validation rule function via validate process
     */
    addValidResult(result) {
      this.setState(oldState => {
        let newState = Object.assign(oldState, {});
        const currentInputValidationState =
          newState.validationState[result.path];

        newState.validationState[result.path] = currentInputValidationState
          ? []
          : filter(
              currentInputValidationState,
              val => val.validation === result.validation,
            );
        newState.validationState[result.path].push(result);
        return newState;
      });
    }

    /**
     * addErrorResult
     *   - Pushes the error object into the validationState's particular
     *   entry array, creating the array if it doesn't already exist.
     *   - Removes any valid validation objects from the array.
     *
     * @param {q20$ErrorResult} result the validation result object
     *   passed from the validation rule function via validation process
     */
    addErrorResult(result) {
      this.setState(oldState => {
        let newState = Object.assign(oldState, {});
        const currentInputValidationState =
          newState.validationState[result.path];

        newState.validationState[result.path] = filter(
          currentInputValidationState,
          val => val.validation !== result.validation,
        );

        if (currentInputValidationState) {
          newState.validationState[result.path].push(result);
        } else {
          newState.validationState[result.path] = [result];
        }
        return newState;
      });
    }

    /**
     * render
     *   react render function
     * @return {Component} FormController with new props
     */
    render() {
      return (
        <FormControllerComponent
          validate={{
            single: this.validateSingle,
            all: this.validateAll,
            state: this.state.validationState,
            deleteRow: this.deleteValidationResultRow,
          }}
          key={"Validated-" + camelize(this.props.title)}
          {...this.props}
        />
      );
    }
  };
}
