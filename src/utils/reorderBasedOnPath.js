// @flow
/**
 * reorderBasedOnPath
 *   Given an object of paths and values, will reorder them to fill
 *   in any gaps because of rows being deleted.
 * @param {object} arguments
 *   @param {string} path the path of the array which all reordered pairs
 *     will have
 *   @param {object} state the current state of the form values
 * @return {object} newState, the updated and reordered state object
 */
export default function reorderBasedOnPath({
  path,
  state,
}: {
  path: string,
  state: {},
}) {
  const changesAndState = { path, state };

  const sortedNamedValues = sortSelectedValuesByIndex(changesAndState);
  // renumbered values into their own object
  const newValuesMatchingPath = renumberValuesIntoNewState({ sortedNamedValues });
  // filter out any entries that match the path, as they are now obsolete data
  let newState = deleteEntriesThatMatchPathWithNumber(changesAndState);

  // combine filtered state with updated array value state
  newState = Object.assign(newState, newValuesMatchingPath);
  return newState;
}

/**
 * deleteEntriesThatMatchPath
 *   Filters out any value entries that match the path with an index in the path string
 *
 * @param {object} arguments
 * @param {string} path the path to match for deletion
 * @param {object} state the state being filtered
 * @return {object} the filtered state
 */
function deleteEntriesThatMatchPathWithNumber({ path, state }: {path: string, state: {}}) {
  const matchPathRegexp = new RegExp( path + "\\." );
  const outputBuffer = {};

  for (let value in state) {
    if (state.hasOwnProperty(value)) {
      if (!matchPathRegexp.test(value)) {
        outputBuffer[value] = state[value];
      }
    }
  }

  return outputBuffer;
}

/**
 * renumberValuesIntoNewState
 *   Iterates through the paths based on their old index and changes it
 *   to the number of times through the loop.
 *   Ensures 0, 1, 2... order no matter their original index.
 * @param {object} sortedListAndState Sorted Named Values by index
 * @return {object} an object containing the new paths and values
 * */
function renumberValuesIntoNewState({
  sortedNamedValues,
}: {
  sortedNamedValues: {},
}) {
  const sortedIndexes = Object.keys(sortedNamedValues);
  const outputBuffer = {};

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
        outputBuffer[newPath] = oldValue;
      }
    }
  }
  return outputBuffer;
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
function sortSelectedValuesByIndex({
  path,
  state,
}: {
  path: string,
  state: {},
}) {
  const sortedNamedValues = {};
  const pathTestCapturingIndex = new RegExp("^" + path + "\\.(\\d)");
  for (let thisPath: string in state) {
    if (state.hasOwnProperty(thisPath)) {
      let doesMatchWithCapturedIndex = pathTestCapturingIndex.exec(thisPath);

      if (doesMatchWithCapturedIndex) {
        let index = doesMatchWithCapturedIndex[1];
        if (!sortedNamedValues[index]) {
          sortedNamedValues[index] = [];
        }
        sortedNamedValues[index].push({
          [thisPath]: state[thisPath],
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
 * @return {object} modified state that does not include the deleted
 *   items
 */
export function deleteSelectedRowFromValues({
  path,
  index,
  state,
}: {
  path: string,
  index: number,
  state: {},
}) {
  const deletedRowRegex = new RegExp("^" + path + "\\." + index);
  for (let valuePair in state) {
    if (deletedRowRegex.test(valuePair)) {
      delete state[valuePair];
    }
  }
  return state;
}
