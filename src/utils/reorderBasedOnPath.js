// @flow

/**
 * of
 * @param {object} props path (string) and index(number) being
 *   passed from the field that is being deleted.
 */
// function deleteRowValue(props: q20$DeleteRowValues): typeof undefined {
//   const { path: changePath, index: changeIndex } = props;
//   this.setState(oldState => {
//     let newState = { ...oldState };
//     const changesAndState = { changePath, changeIndex, newState };
//
//     this.deleteSelectedRowFromValues(changesAndState);
//     const sortedNamedValues = this.sortSelectedValuesByIndex(changesAndState);
//     this.renumberValuesIntoNewState({ sortedNamedValues, newState });
//     this.removeObsoleteRowEntries({
//       sortedNamedValues,
//       changePath,
//       newState,
//     });
//
//     return newState;
//   });
// }
export default function reorderBasedOnPath({
path, index, state }: {
  path: string,
  index: number,
  state: {},
}) {
  const newState = { ...state };
  const changesAndState = { path, index, newState};

  //  deleteSelectedRowFromValues(changesAndState);
  const sortedNamedValues = sortSelectedValuesByIndex(changesAndState);
  renumberValuesIntoNewState({ sortedNamedValues, newState});
  removeObsoleteRowEntries({
    sortedNamedValues,
    path,
    newState,
  });

  return newState;
}

/**
 * removeObsoleteRowEntries
 *   After shifting everything down one index value, there will be a leftover
 *   row, a duplicate of the one before it in order.
 *   Looking for the last index in sorted named values, when a path matching
 *   that is found, it is removed.
 * @param {object} pathValuesAndState path, sorted values and newState
 */
function removeObsoleteRowEntries({ path, sortedNamedValues, newState }: { path: string, sortedNamedValues: {}, newState: {} }) {
  const sortedIndexes = Object.keys(sortedNamedValues);
  const obsoleteRowRegex = new RegExp(
    "^" + path + "\\." + sortedIndexes[sortedIndexes.length - 1],
  );
  for (let valuePair in newState) {
    if (obsoleteRowRegex.test(valuePair)) {
      delete newState[valuePair];
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
function renumberValuesIntoNewState(
  { sortedNamedValues, newState }: { sortedNamedValues: {}, newState: {} }
) {
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
        newState[newPath] = oldValue;
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
function sortSelectedValuesByIndex(props){
  const sortedNamedValues = {};
  const pathTestCapturingIndex = new RegExp("^" + props.path + "\\.(\\d)");
  for (let thisPath: string in props.newState) {

    if (props.newState.hasOwnProperty(thisPath)) {
      let doesMatchWithCapturedIndex = pathTestCapturingIndex.exec(thisPath);

      if (doesMatchWithCapturedIndex) {

        let index = doesMatchWithCapturedIndex[1];
        if (!sortedNamedValues[index]) {
          sortedNamedValues[index] = [];
        }
        sortedNamedValues[index].push({
          [thisPath]: props.newState[thisPath],
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
function deleteSelectedRowFromValues(values: q20$DeleteSelectedRow) {
  const { changeIndex, changePath, newState: destinationState } = values;
  const deletedRowRegex = new RegExp("^" + changePath + "\\." + changeIndex);

  for (let valuePair in destinationState.values) {
    if (deletedRowRegex.test(valuePair)) {
      delete destinationState.values[valuePair];
    }
  }
}
