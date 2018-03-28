import React, { Component } from "react";
import reorderBasedOnPath, {
  deleteSelectedRowFromValues,
} from "../utils/reorderBasedOnPath";
import submitShape from "../utils/submitShape";
import arrangeValues from "../utils/arrangeValues";
/* eslint react/prop-types: "off" */

/**
 * withValueManager
 *
 * @param {Component} ComponentToWrap
 * @return {Component} WrappedComponent
 */
export default function withValueManager(ComponentToWrap) {
  return class ValueManager extends Component {
    /**
     * constructor
     *   class constructor
     * @param {object} props
     */
    constructor(props) {
      super(props);
      this.changeValue = this.changeValue.bind(this);
      this.registerField = this.registerField.bind(this);
      this.deleteRowValue = this.deleteRowValue.bind(this);
      this.mapValuesForSubmit = this.mapValuesForSubmit.bind(this);
      this.submitShape = submitShape(props.properties);
      this.state = {
        submitShape: submitShape(props.properties),
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
     * @param {function} callback to be called after the setState completes
     * @return {boolean}
     */
    changeValue(changeData: q20$ChangeDataParams, callback: () => {}): boolean {
      if (
        changeData.path === undefined ||
        changeData.value === undefined ||
        changeData.name === undefined
      )
        return false;
      this.setState(
        (oldState: q20$FormControllerState): q20$FormControllerState => {
          let newState = Object.assign(oldState, {});
          newState.values[changeData.path] = changeData.value;
          return newState;
        },
        callback,
      );
      return true;
    }

    /**
     * deleteRowValue
     *   Looks through the valueState, deletes a row based on user input,
     *   and reorders the remaining key/value matches if necessary.
     * @param {object} props path (string) and index(number) being
     *   passed from the field that is being deleted.
     */
    deleteRowValue(props: q20$DeleteRowValues): typeof undefined {
      const { path: changePath, index: changeIndex } = props;
      this.setState(oldState => {
        const valueState = { ...oldState.values };
        const valueAfterDelete = deleteSelectedRowFromValues({
          path: changePath,
          index: changeIndex,
          state: valueState,
        });

        const newValueState = reorderBasedOnPath({
          path: changePath,
          index: changeIndex,
          state: valueAfterDelete,
        });
        const newState = { ...oldState };
        newState.values = newValueState;
        return newState;
      });
    }

    /**
     * mapValuesForSubmit
     *   calls to the arrangeValues function.
     *   Combines the values from state and the submit shape to create the params
     *   for form submission. Returns those formatted params.
     * @return {object} arranged values for submit
     */
    mapValuesForSubmit() {
      return arrangeValues({
        values: this.state.values,
        submitShape: this.submitShape,
      });
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
     * React render function
     * @return {Component} wrapped component
     */
    render() {
      return (
        <ComponentToWrap
          changeValue={this.changeValue}
          fieldRegistry={this.state.fieldRegistry}
          registerField={this.registerField}
          values={this.state.values}
          deleteRow={this.deleteRowValue}
          submitValues={this.mapValuesForSubmit}
          {...this.props}
        />
      );
    }
  };
}
