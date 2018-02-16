import React, { Component } from "react";
import reorderBasedOnPath, {
  deleteSelectedRowFromValues,
} from "../utils/reorderBasedOnPath";
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
     * of
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
          values={this.state.values}
          deleteRow={this.deleteRowValue}
          {...this.props}
        />
      );
    }
  };
}
