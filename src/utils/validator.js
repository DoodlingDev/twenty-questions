// @flow

/**
 * gatherValidations
 *   scans through a given form Schema for any mention of validations,
 *   and saves each array along with the label, type and name to an object
 *   whose keys are the string typed names of the fields.
 *
 * @param {q20$Node[]} formNode the passed in schema from FormController
 * @return {q20$ValidationList} an array built of validation objects
 *
 */
export function gatherValidations(formNode: q20$Node): q20$ValidationList {
  let outputBuffer = {};

  for (let property in formNode) {
    if (formNode.hasOwnProperty(property)) {
      let value = formNode[property];

      if (property === "validates") {
        outputBuffer[formNode.name] = {
          name: formNode.name,
          label: formNode.label || formNode.name,
          validates: formNode.validates,
          type: formNode.type,
        };
      }

      if (typeof value === "object") {
        let recurseOutput = gatherValidations(value);
        if (Object.keys(recurseOutput).length > 0) {
          outputBuffer = Object.assign(outputBuffer, recurseOutput);
        }
      }
    }
  }
  return outputBuffer;
}
