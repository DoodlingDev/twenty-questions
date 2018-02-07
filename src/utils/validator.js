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

/**
 * Validator
 *
 * @param {q20$Schema} schema
 */
export default function Validator(schema: q20$Schema): q20$Validator {
  const formNodes = schema.properties[0];
  const validationList = gatherValidations(formNodes);

  /*
   * validator sets up a list which is an object.
   * keys are names of fields
   * each is an object/array which holds a list of all the
   *   types of validations that need to happen
   * This master list is gathered when a new form is initialized
   *
   * validate all
   * asks it to run through all its validations, each one checking each value
   * (which is stored in formValues as a path)
   * regex matches the paths, on each hit, runs all the validations in its array
   * stores and validations errors or passing marks by PATH in the validation manager
   *
   * validate single
   * is passed the name and the path and the value
   * uses name to check its validation registry -> run all checks
   * stores either passing validations or not BY PATH in the validation manager
   *
   * form will have an object with both errors and passing validations
   *   those are stored by PATH
   * input items will all be wrapped with a Validator Component that will pass through
   *   any relevant information by PATH to that object/Component
   *
   * long story short,
   *   - validator holds by NAME
   *   - form holds by PATH
   */

  return {
  }
}
