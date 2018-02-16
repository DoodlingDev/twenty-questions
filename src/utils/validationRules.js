// @flow

type q20$ValidValidationData = {
  path: string,
  validation: string
};

type q20$InvalidValidationData = {
  path: string,
  validation: string,
  label: string,
  message: string
};

type q20$ValidResult = {
  path: string,
  validation: string,
  valid: true
};

/**
 * ValidResult
 *   An object that carries information about the validation passing. No
 *   message is required for valid inputs, so only the path and validation
 *   in question are considered.
 *
 * @param {q20$ChangeDataParams} validationData data sent from the form as to
 *   what change was just made in an input.
 * @return {q20$ValidResult} frozen object with the data about a passed validation
 */
function ValidResult(validationData: q20$ValidValidationData): q20$ValidResult {
  const { path, validation } = validationData;

  return Object.freeze({
    path: path,
    validation: validation,
    valid: true
  });
}

type q20$ErrorResult = {
  path: string,
  validation: string,
  valid: false,
  message: string
};

/**
 * ErrorResult
 *   An object that carries information about the validation failing.
 *   A message for feedback to the user is required for a failing validation,
 *   so that and a label is required. Those two items will be combined to
 *   produce a final message.
 *
 * @param {q20$ValidationData} validationData data sent from the invoked
 *   and failed validation rule
 * @return {q20$ErrorResult} frozen object describing a validation failure
 */
function ErrorResult(
  validationData: q20$InvalidValidationData
): q20$ErrorResult {
  const { path, validation, message, label } = validationData;
  const completeMessage = `${label} ${message}`;

  return Object.freeze({
    path: path,
    validation: validation,
    valid: false,
    message: completeMessage
  });
}

/**
 * required
 *   Validation Rule that the input's value be present. Something other than
 *   undefined, null or an empty string. Returns either a ValidResult object or
 *   and ErrorResult object. This way validity or failure can be checked
 *   quickly with a constructor/type check
 *
 * @param {q20$ValidationParams} validationParams data sent from the validator
 *   used to determine validity
 * @return {q20$ValidResult | q20$ErrorResult} Object which holds data
 *   about the output of the required validation check. path, message,
 *   validation and pass/fail
 */
export function required(
  validationParams: q20$ValidationParams
): q20$ValidResult | q20$ErrorResult {
  const valid =
    validationParams.value !== undefined &&
    validationParams.value !== "" &&
    validationParams.value !== null;

  if (valid) {
    return new ValidResult({
      path: validationParams.path,
      validation: "required"
    });
  } else {
    return new ErrorResult({
      path: validationParams.path,
      validation: "required",
      message: "is required",
      label: validationParams.label
    });
  }
}
