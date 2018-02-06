// @flow
import React, { Component } from "react";
import FormNodeObject from "./nodes/types/object";

type q20$FormControllerProps = {
  schema: q20$Schema,
  title: string,
  description?: string,
};

type q20$Schema = {
  title: string,
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
    const { title, description, properties } = this.props.schema;
    return (
      <form>
        <h2>{title}</h2>
        {description && <h3>{description}</h3>}

        <FormNodeObject
          name={title}
          label={title}
          description={description}
          type={"object"}
          path={`${title}`}
          properties={properties}
        />
      </form>
    );
  }
}
