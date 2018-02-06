// @flow
import React, { Component } from "react";
import FormBuilder from "./formBuilder";

type q20$FormControllerProps = {
  schema: q20$Schema,
};

type q20$Schema = {
  title?: string,
  description?: string,
  properties: q20$Node[],
};

type q20$FormControllerState = {
  values: q20$FormValues,
  errors: q20$FormErrors,
};

type q20$FormValues = {
  [key: string]: any,
};

type q20$FormErrors = {
  [key: string]: q20$Error,
};

/**
 * FormController
 *   master component for the q20 forms, holds values and errors
 */
export default class FormController extends Component<
  q20$FormControllerProps,
  q20$FormControllerState,
> {
  state = {
    values: {},
    errors: {},
  };

  /**
   * constructor
   *   sets state to empty objects to begin with
   * @param {FormControllerProps} props
   */
  constructor(props: q20$FormControllerProps) {
    super(props);
    this.state = {
      values: {},
      errors: {},
    };
  }

  /**
   * render
   *   react render function
   *   renders the FormBuilder to make the markup
   * @return {React$Element} FormBuilder
   */
  render() {
    return <form>form</form>;
  }
}
