import React, { Component } from "react";
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
      }
    }

    /**
    * changeValue
    *   updates the form's internal state with new data from the field element
    *
    * @param {q20$ChangeDataParams} changeData
    *   required data sent from the form field
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
        callback
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
        let newState = { ...oldState };
        const changesAndState = { changePath, changeIndex, newState };

        this.deleteSelectedRowFromValues(changesAndState);
        const sortedNamedValues = this.sortSelectedValuesByIndex(changesAndState);
        this.renumberValuesIntoNewState({ sortedNamedValues, newState });
        this.removeObsoleteRowEntries({
          sortedNamedValues,
          changePath,
          newState,
        });

        return newState;
      });
    }

    /**
    * removeObsoleteRowEntries
    *   After shifting everything down one index value, there will be a leftover
    *   row, a duplicate of the one before it in order.
    *   Looking for the last index in sorted named values, when a path matching
    *   that is found, it is removed.
    * @param {object} pathValuesAndState path, sorted values and newState
    */
    removeObsoleteRowEntries(
      pathValuesAndState: q20$ObsoleteRowParams) {
      const { changePath, sortedNamedValues, newState } = pathValuesAndState;
      const sortedIndexes = Object.keys(sortedNamedValues);
      const obsoleteRowRegex = new RegExp(
        "^" + changePath + "\\." + sortedIndexes[sortedIndexes.length - 1],
      );
      for (let valuePair in newState.values) {
        if (obsoleteRowRegex.test(valuePair)) {
          delete newState.values[valuePair];
        }
      }
    }

    /**
    * renumberValuesIntoNewState
    *   Iterates through the paths based on their old index and changes it
    *   to the number of times through the loop.
    *   Ensures 0, 1, 2... order no matter their original index.
    * @param {object} sortedListAndState Sorted Named Values by index, and
    *   the current state, soon to be the new state.
    */
    renumberValuesIntoNewState(
      sortedListAndState: q20$SortedValues & q20$FormValues,
    ) {
      const { sortedNamedValues, newState } = sortedListAndState;
      const sortedIndexes = Object.keys(sortedNamedValues);

      for (let i = 0, l = sortedIndexes.length; i < l; i++) {
        let oldIndex = sortedIndexes[i];
        const sortedValueObjects = sortedNamedValues[oldIndex];

        for (let valuePairIndex in sortedValueObjects) {
          if (sortedValueObjects.hasOwnProperty(valuePairIndex)) {
            let valuePath = Object.keys(sortedValueObjects[valuePairIndex])[0];
            let oldValue = sortedValueObjects[valuePairIndex][valuePath];
            let newPath = valuePath.replace(
              new RegExp("\\." + oldIndex + "\\."),
              "." + i + ".",
            );
            newState.values[newPath] = oldValue;
          }
        }
      }
    }

    /**
    * sortSelectedValuesByIndex
    *   assigns each path/value pair to an objects whose keys are the
    *   index that matches the path/value entry's.
    * @param {object} indexPathAndState Index & Path of the row to be deleted,
    *   newState is the current state of the form values as they are
    *   being manipulated
    * @return {object} the sorted object of pairs by index
    */
    sortSelectedValuesByIndex(
      indexPathAndState: q20$DeleteSelectedRow,
    ): q20$SortedValues {
      const { changePath, newState } = indexPathAndState;

      const sortedNamedValues = {};
      const pathTestCapturingIndex = new RegExp("^" + changePath + "\\.(\\d)");
      for (let path: string in newState.values) {
        if (newState.values.hasOwnProperty(path)) {
          let doesMatchWithCapturedIndex = pathTestCapturingIndex.exec(path);

          if (doesMatchWithCapturedIndex) {
            let index = doesMatchWithCapturedIndex[1];
            if (!sortedNamedValues[index]) {
              sortedNamedValues[index] = [];
            }
            sortedNamedValues[index].push({
              [path]: newState.values[path],
            });
          }
        }
      }

      return sortedNamedValues;
    }

    /**
    * deleteSelectedRowFromValues
    *   Removes any fields from values which match the path and index
    *   supplied by the Array field that called Delete.
    * @param {object} values Index & Path of the row to be deleted,
    *   newState is the current state of the form values as they are
    *   being manipulated
    */
    deleteSelectedRowFromValues(values: q20$DeleteSelectedRow) {
      const { changeIndex, changePath, newState: destinationState } = values;
      const deletedRowRegex = new RegExp("^" + changePath + "\\." + changeIndex);

      for (let valuePair in destinationState.values) {
        if (deletedRowRegex.test(valuePair)) {
          delete destinationState.values[valuePair];
        }
      }
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
      return(
        <ComponentToWrap
          changeValue={this.changeValue}
          values={this.state.values}
          deleteRow={this.deleteRowValue}
          {...this.props}
        />
      );

    }
  }
}
