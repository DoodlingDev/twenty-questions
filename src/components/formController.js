// @flow
import React, { Component } from "react";
import FormNodeObject from "./nodes/types/object";
import getWidgets from "../utils/getWidgets";

type q20$FormControllerProps = {
  schema: q20$Schema,
  title: string,
  description?: string,
  widgets?: q20$RenderedNode[],
};

type q20$Schema = {
  title: string,
  description?: string,
  properties: q20$Node[],
  widget?: string,
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

  /**
   * state
   * @param {object} values input values from the form
   * @param {object} errors error objects created by the validator
   */
  state = {
    values: {},
    errors: {},
  };

  /**
   * constructor
   *
   * @param {FormControllerProps} props
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
    const { widgets } = this.props;
    const { title, description, properties, widget } = this.props.schema;
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
          widgets={getWidgets(widgets)}
          widget={widget ? widget : undefined}
        />
      </form>
    );
  }
}
