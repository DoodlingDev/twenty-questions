// @flow
import React, { Component } from "react";
import FormNode from "./formNode";

type Schema = {
  properties: FormNodeType[],
  title?: string,
  description?: string,
};

type Props = {
  schema: Schema,
};

type ErrorType = {
  [fieldName: string]: string[],
};

type State = {
  values: { [fieldName: string]: any },
  errors: { [fieldName: string]: ErrorType },
};

type FormNodeType = {
  name: string,
  title?: string,
  description?: string,
}

/**
 * FormController
 *
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
   * formContent
   * Map properties on the first level of form schema into
   *   rendered node components.
   * @return {array} List of Node components
   */
  formContent(): React$Element<any>[] {
    return this.props.schema.properties.map((node: FormNodeType) =>
      <FormNode


      />
    );
  }

  /**
   * render
   * React render function
   * @return {object} component
   */
  render(): ?React$Element<any> {
    return pug`h1 form`;
  }
}
