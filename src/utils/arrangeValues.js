// @flow

type q20$MatchingPairParams = {
  name: string,
  values: {},
  type?: string,
}

export default function arrangeValues({ values, submitShape }: { values: {}, submitShape: Array<q20$SubmitField> }) {
  let outputBuffer = {};
  let _values = { ...values };
  for (let i = 0, l = submitShape.length; i < l; i++) {
    let submitShapeEntry = submitShape[i];

    let matchingPairParams: q20$MatchingPairParams = {
      name: submitShapeEntry.name,
      values: _values,
    };

    if (submitShapeEntry.type) {
      matchingPairParams.type = submitShapeEntry.type
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
        break;
      default:
        preparedValues = stripObjectPaths(matchingValuePairs);
        outputBuffer = Object.assign(outputBuffer, preparedValues);

        break;
    }
  }
  return outputBuffer;
}

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

function stripObjectPaths(object) {
  let outputBuffer = {};
  for (let path: string in object) {
    let nameOnly = stripPath(path);
    outputBuffer[nameOnly] = object[path];
  }
  return outputBuffer;
}

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

function arrangeArrayValues({name, pairsMatchingThisIndex, submitShape}) {
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
