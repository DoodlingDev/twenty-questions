// @flow
import React, { Component } from "react";
import withValueManager from "./valueManager";
import FormNodeObject from "./nodes/types/object";
import getWidgets from "../utils/getWidgets";
import withValidation from "./validator";
import ErrorHandler from "./errorHandler";
import camelize from "../utils/camelize";

type q20$DeleteSelectedRow = {
  changeIndex: number,
  changePath: string,
  newState: q20$FormValues,
};

type q20$SortedValues = {
  [index: string]: q20$FormValues,
};

type q20$ObsoleteRowParams = {
  changePath: string,
  sortedNamedValues: q20$SortedValues,
  newState: q20$FormValues,
};

/**
 * FormController
 *   master component for the q20 forms, holds values and errors
 */
export class FormController extends Component<q20$FormControllerProps> {
  static defaultProps = {
    typeAheadValidation: true,
    errorHandlerComponent: ErrorHandler,
  };

  /**
   * constructor
   * @param {q20$FormControllerProps} props
   */
  constructor(props: q20$FormControllerProps) {
    super(props);
  }

  /**
   * render
   *   react render function
   *   renders the FormBuilder to make the markup
   * @return {React$Element} FormBuilder
   */
  render() {
    const {
      widgets,
      widget,
      title,
      description,
      properties,
      label,
    } = this.props;
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
            update: this.props.changeValue,
            values: this.props.values,
            validate: this.props.validate.state,
            deleteRow: this.props.deleteRow,
          }}
          register={this.props.registerField}
        />
      </form>
    );
  }
}

export default withValueManager(withValidation(FormController));
