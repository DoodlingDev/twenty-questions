// @flow
import React, { Component } from "react";
import FormNodeObject from "./nodes/types/object";
import getWidgets from "../utils/getWidgets";
import withValidation from "./validator";
import ErrorHandler from "./errorHandler";
import camelize from "../utils/camelize";

/**
 * FormController
 *   master component for the q20 forms, holds values and errors
 */
export class FormController extends Component<
  q20$FormControllerProps,
  q20$FormControllerState,
> {

  static defaultProps = {
    typeAheadValidation: true,
    errorHandlerComponent: ErrorHandler,
  };

  +changeValue: (changeData: q20$ChangeDataParams) => true;
  +registerField: () => {};

  /**
   * constructor
   * @param {q20$FormControllerProps} props
   */
  constructor(props: q20$FormControllerProps) {
    super(props);
    this.changeValue = this.changeValue.bind(this);
    this.registerField = this.registerField.bind(this);
    this.state = {
      values: {},
      errors: {},
      fieldRegistry: [],
    };
  }

  /**
   * changeValue
   *   updates the form's internal state with new data from the field element
   *
   * @param {q20$ChangeDataParams} changeData
   *   required data sent from the form field
   * @return {boolean}
   */
  changeValue(changeData: q20$ChangeDataParams) {
    this.setState(
      (oldState: q20$FormControllerState): q20$FormControllerState => {
        let newState = Object.assign(oldState, {});
        newState.values[changeData.path] = changeData.value;
        return newState;
      },
      () => {
        if (this.props.typeAheadValidation) {
          this.props.validate.single(changeData);
        }
      },
    );
    return true;
  }

  /**
   * registerField
   *   Adds a field's path to the registry, but only once.
   *
   * @param {string} path the field's path
   */
  registerField(path: string) {
    if (this.state.fieldRegistry.includes(path)) {
      return;
    } else {
      this.setState(oldState => {
        let newState = Object.assign(oldState);
        newState.fieldRegistry.push(path);
        return newState;
      });
    }
  }

  /**
   * render
   *   react render function
   *   renders the FormBuilder to make the markup
   * @return {React$Element} FormBuilder
   */
  render() {
    const { widgets, widget, title, description, properties, label } = this.props;
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
            update: this.changeValue,
            values: this.state.values,
            validate: this.props.validate.state,
          }}
          register={this.registerField}
        />
      </form>
    );
  }
}

export default withValidation(FormController);
