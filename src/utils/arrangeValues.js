// @flow

type q20$MatchingPairParams = {
  name: string,
  values: {},
  type?: string,
};

/**
 * arrangeValues
 *   Iterates the submit shape and creates an object of key/value pairs
 *   to be submitted as params when the form completes.
 *
 * @param {object} values current values of the form
 * @param {object} submitShape inferred schema submit shape
 * @return {object} The object that contains the current values for the keys
 *   in the submitShape schema.
 */
export default function arrangeValues({
  values,
  submitShape,
}: {
  values: {},
  submitShape: Array<q20$SubmitField>,
}) {
  let outputBuffer = {};
  let _values = { ...values };
  for (let i = 0, l = submitShape.length; i < l; i++) {
    let submitShapeEntry = submitShape[i];

    let matchingPairParams: q20$MatchingPairParams = {
      name: submitShapeEntry.name,
      values: _values,
    };

    if (submitShapeEntry.type) {
      matchingPairParams.type = submitShapeEntry.type;
    }

    let matchingValuePairs = findMatchingValuePairs(matchingPairParams);
    let preparedValues;

    switch (submitShapeEntry.type) {
      case "array":
        let arrayVals = arrangeArrayValues({
          name: submitShapeEntry.name,
          pairsMatchingThisIndex: matchingValuePairs,
          submitShape: submitShapeEntry,
        });
        preparedValues = stripObjectPaths(arrayVals);
        outputBuffer = Object.assign(outputBuffer, preparedValues);

        break;
      case "object":
        let currentName = stripPath(submitShapeEntry.name);
        let objectBuffer = {
          [currentName]: arrangeValues({
            values: _values,
            submitShape: submitShapeEntry.children || [],
          }),
        };
        outputBuffer = Object.assign(outputBuffer, objectBuffer);

        break;
      default:
        preparedValues = stripObjectPaths(matchingValuePairs);
        outputBuffer = Object.assign(outputBuffer, preparedValues);

        break;
    }
  }
  return outputBuffer;
}

/**
 * findMatchingValuePairs
 *   Checks through the current form values and pulls out the matching
 *   key/value pairs for the submitObject.
 *
 * @param {string} name the dataField's name
 * @param {object} values all the current values of the form's data
 * @param {stirng} type A string notation of the datatype of the value for this
 *   key
 * @return {object} the matched key/value pairs in question
 */
function findMatchingValuePairs({ name, values, type }) {
  const matchedPairs = {};
  const keyList = Object.keys(values);
  const matchRegex = new RegExp("(^|\\.)" + name + (type ? "($|\\.)" : "$"));
  for (let i = 0, l = keyList.length; i < l; i++) {
    const key = keyList[i];
    if (matchRegex.test(key)) {
      matchedPairs[key] = values[key];
    }
  }
  return matchedPairs;
}

/**
 * stripObjectPaths
 *   Takes in an object with paths as the value identifiers and returns an
 *   object with the paths stripped down to just the names.
 *
 * @param {object} object matched key/value pairs of paths to form values
 * @return {object} renamed object with only names at keys
 */
function stripObjectPaths(object) {
  let outputBuffer = {};
  for (let path: string in object) {
    if (object.hasOwnProperty(path)) {
      let nameOnly = stripPath(path);
      outputBuffer[nameOnly] = object[path];
    }
  }
  return outputBuffer;
}

/**
 * stripPath
 *   Takes a path, meaning the string representation of a value's place in the
 *   form hirearchy, and removes everything but the name. This is identified by
 *   being the last section of string following the last ., or following the
 *   beginning of the string.
 *
 * @param {string} path the path
 * @return {string} the individual name of the field
 */
function stripPath(path) {
  const noDotsCheck = /\./;
  const captureName = new RegExp(".*\\.(.+$)");
  if (!noDotsCheck.test(path)) {
    return path;
  } else {
    let capturedNameStr = captureName.exec(path);
    return capturedNameStr[1];
  }
}

/**
 * arrangeArrayValues
 *   Arrays require a bit more work before they can be passed off for submission.
 *   This function recursively gathers the key/value pairs and sorts them into objects
 *   in the array based on the index in their path.
 *   Returns an array, with objects based on the submitShape schema, sorted according
 *   to the index in their path.
 *
 * @param {string} name field's name
 * @param {object} pairsMatchingThisIndex list of key/value pairs that match
 *   the array's path and contain an index
 * @param {object} submitShape the schema for building the final submitting object
 * @return {object} an object with the array's name as the key, and the array of
 *   constructed objects as the value.
 */
function arrangeArrayValues({ name, pairsMatchingThisIndex, submitShape }) {
  const sortedNamedValues = {};
  const pathTestCapturingIndex = new RegExp("(^|\\.)" + name + "\\.(\\d+)");

  for (let thisPath: string in pairsMatchingThisIndex) {
    if (pairsMatchingThisIndex.hasOwnProperty(thisPath)) {
      let doesMatchWithCapturedIndex = pathTestCapturingIndex.exec(thisPath);

      if (doesMatchWithCapturedIndex) {
        let index = doesMatchWithCapturedIndex[2];
        if (!sortedNamedValues[index]) {
          sortedNamedValues[index] = [];
        }
        sortedNamedValues[index].push({
          [thisPath]: pairsMatchingThisIndex[thisPath],
        });
      }
    }
  }

  let outputBuffer = [];
  for (let i = 0, l = Object.keys(sortedNamedValues).length; i < l; i++) {
    let singleLevelObject = {};
    sortedNamedValues[i].forEach(pair => {
      Object.assign(singleLevelObject, pair);
    });
    outputBuffer.push(
      arrangeValues({
        values: singleLevelObject,
        submitShape: submitShape.children || [],
      }),
    );
  }

  return { [name]: outputBuffer };
}
