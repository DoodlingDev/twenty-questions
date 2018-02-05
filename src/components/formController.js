// @flow
import React, { Component } from "react";
import FormBuilder from "./formBuilder";

type Props = {
  schema: Schema,
};

type State = {
  values: { [fieldName: string]: any },
  errors: { [fieldName: string]: ErrorType },
};

/**
 * FormController
 */
export default class FormController extends Component<Props, State> {
  /**
   * constructor
   * Initializes state values and errors to {}
   * @param{object} props
   */
  constructor(props: Props) {
    super(props);
    this.state = {
      values: {},
      errors: {},
    };
  }

  /**
   * render
   * React render function
   * @return {object} component
   */
  render(): ?React$Element<any> {
    return pug`
      FormBuilder(
        schema=this.props.schema
      )
    `;
  }
}

