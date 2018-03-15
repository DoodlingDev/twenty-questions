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
  const newState = { ...state };
  const changesAndState = { path, newState };

  const sortedNamedValues = sortSelectedValuesByIndex(changesAndState);
  renumberValuesIntoNewState({ sortedNamedValues, newState });
  if (!areConsecutive(Object.keys(sortedNamedValues))) {
    removeObsoleteRowEntries({
      sortedNamedValues,
      path,
      newState,
    });
  }
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
function removeObsoleteRowEntries({
  path,
  sortedNamedValues,
  newState,
}: {
  path: string,
  sortedNamedValues: {},
  newState: {},
}) {
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
 * areConsecutive
 *   takes in an array of numbers as strings.
 *   Returns true/false based on whether the numbers in the array are consecutive.
 *
 * @param {array} listOfNumbers
 * @return {boolean} true/false based on whether the numbers are consecutive.
 */
export function areConsecutive(listOfNumbers: Array<string>) {
  if (listOfNumbers.length <= 1) return false;
  let sortedListOfNumbers = listOfNumbers.map(n => parseInt(n)).sort();
  for (let i = 1, l = sortedListOfNumbers.length; i < l; i++) {
    let currentNumber = sortedListOfNumbers[i];
    if (currentNumber - 1 == sortedListOfNumbers[i - 1]) {
      continue;
    } else {
      return false;
    }
  }
  return true;
}

/**
 * renumberValuesIntoNewState
 *   Iterates through the paths based on their old index and changes it
 *   to the number of times through the loop.
 *   Ensures 0, 1, 2... order no matter their original index.
 * @param {object} sortedListAndState Sorted Named Values by index, and
 *   the current state, soon to be the new state.
 */
function renumberValuesIntoNewState({
  sortedNamedValues,
  newState,
}: {
  sortedNamedValues: {},
  newState: {},
}) {
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
function sortSelectedValuesByIndex({
  path,
  newState,
}: {
  path: string,
  newState: {},
}) {
  const sortedNamedValues = {};
  const pathTestCapturingIndex = new RegExp("^" + path + "\\.(\\d)");
  for (let thisPath: string in newState) {
    if (newState.hasOwnProperty(thisPath)) {
      let doesMatchWithCapturedIndex = pathTestCapturingIndex.exec(thisPath);

      if (doesMatchWithCapturedIndex) {
        let index = doesMatchWithCapturedIndex[1];
        if (!sortedNamedValues[index]) {
          sortedNamedValues[index] = [];
        }
        sortedNamedValues[index].push({
          [thisPath]: newState[thisPath],
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
