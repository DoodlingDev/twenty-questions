// @flow
import React from "react";
import cn from "../../../utils/className";

const Dropdown = (props: q20$RenderedNode) => {
  let layoutStyle = props.layoutStyle ? props.layoutStyle.repeat(1) : "";
  /**
   * optionMap
   *  iterates through options list and returns an options HTML element
   *  for each. Checks the value of option, and if a different value was
   *  supplied than just repeating the option string, divide accordingly.
   *  i.e.
   *    ["United States", 1776]
   *    the first element is used as the display for the user in the dropdown,
   *    and the second used for the value of the input when that is selected.
   *
   *  @return {array} Array of HTML <option> elements (jsx)
   */
  function optionMap() {
    let optValue;
    let optLabel;
    let optionGroup = props.options || [];
    return optionGroup.map((option, index) => {
      if (Array.isArray(option)) {
        optLabel = option[0];
        optValue = option[1];
      } else {
        optLabel = option;
        optValue = option;
      }
      return (
        <option
          key={`${props.label ? props.label : props.path}-option-${index}`}
          value={optValue}
        >
          {optLabel}
        </option>
      );
    });
  }

  if (props.valueManager.values[props.path] === "") {
    layoutStyle += " select-placeholder-selected";
  }

  return (
    <div className={cn("node", "string", "dropdown-widget")}>
      <select
        className={cn("node", props.path, "dropdown-field", layoutStyle)}
        type="select"
        value={props.valueManager.values[props.path]}
        onChange={event => {
          props.valueManager.update({
            path: props.path,
            name: props.name,
            value: event.target.value,
          });
        }}
      >
        {props.label &&
          <option value="" key="placeholder-option">
            {props.label}
          </option>
        }
        {optionMap()}
      </select>
    </div>
  );
}

export default Dropdown;
