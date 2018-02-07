import React, { Component } from "react";
import {gatherValidations} from "../utils/validator";
/* eslint react/prop-types: "0" */

/**
 * Validator
 *
 * @param {FormController} FormController
 */
export default function withValidation(FormControllerComponent) {
  return class Validator extends Component {
    /**
     *
     *
     */
    constructor(props) {
      super(props);
      this.state = {
        validationList: gatherValidations(props.schema),
      }
    }

    /**
     * render
     *   react render function
     * @return {Component} FormController with new props
     */
    render() {
      return(
        <FormControllerComponent />
      );
    }
  }
}
