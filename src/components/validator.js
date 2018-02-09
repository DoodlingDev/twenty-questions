import React, { Component } from "react";
import gatherValidations from "../utils/gatherValidations";
import * as builtInValidationRules from "../utils/validationRules";
import { filter } from "lodash";
import camelize from "../utils/camelize";
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
      this.addValidResult = this.addValidResult.bind(this);
      this.addErrorResult = this.addErrorResult.bind(this);

      this.state = {
        validationList: gatherValidations(props.schema),
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
          }}
          key={"Validated-" + camelize(this.props.title)}
          {...this.props}
        />
      );
    }
  };
}
