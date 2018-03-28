// @flow
import React from "react";
import cn from "../../../utils/className";
import LabelAndDescription from "../../common/labelAndDescription";
import ErrorHandler from "../../errorHandler";
// $FlowFixMe
import { reject } from "lodash";

/**
 * MultiSelect Widget
 *   Field Type: Array
 *   Field UI is made up of several checkboxes denoted by the options key in
 *   the form schema. Options should be strings, and are toggled into and
 *   out of the array with the checkbox inputs.
 * @param {object} props q20$RenderedNode
 * @return {object} React component
 */
const MultiSelect = ({
  name,
  path,
  valueManager,
  label,
  description,
  layoutStyle,
  options,
  ...props
}: q20$RenderedNode) => {
  let currentValue: Array<string> = valueManager.values[path] || [];

  /**
   * updateValue
   *   Clones current value and uses that dup to add or remove the selected
   *   checkbox option from the field's value.
   *   Sends that completed value back up the chain through the ValueManager
   *   to be recorded in the form state.
   *
   * @param {Event} event
   */
  function updateValue(event: Event): typeof undefined {
    let newState = [...currentValue];
    // $FlowFixMe
    let value = event.currentTarget.name;

    if (newState.includes(value)) {
      newState = reject(newState, p => p === value);
    } else {
      newState = [value, ...newState];
    }

    valueManager.update({
      path: path,
      name: name,
      value: newState,
    });
  }

  // if there are no options, checkboxes will render nothing
  const checkboxes = null;
  if (options) {
    return options.map((option, index) => {
      let checkedValue = false;
      if (valueManager.values[path]) {
        checkedValue = currentValue.includes(option);
      }
      return (
        <label
          key={`${path}-option-${index}`}
          htmlFor={`${path}-option-${index}`}
        >
          <input
            checked={checkedValue}
            type="checkbox"
            name={option}
            id={`${path}-option-${index}`}
            onChange={updateValue}
          />
          {option}
        </label>
      );
    });
  }

  return (
    <div className={cn("node", "array", "multi-select")}>
      <LabelAndDescription
        label={label}
        path={path}
        name={name}
        layoutStyle={layoutStyle}
        description={description}
      />
      <ErrorHandler
        key={`errorHandler-${path}`}
        name={name}
        path={path}
        value={valueManager.values[path]}
        label={label || name}
        validations={valueManager.validate[path]}
      >
        {checkboxes}
      </ErrorHandler>
    </div>
  );
}

export default MultiSelect;
