// @flow
import camelcase from "./camelize";

/**
 * className
 * Creates a regular pattern in the BEM style for
 *   classNames. Will error if later elements are supplied
 *   without former.
 *   Adds layoutStyle argument string at the end with a " "
 *   so they are made separate classes. This allows them to
 *   override other single class specificity styling.
 *
 * @param {string} block block level BEM identifier
 * @param {string} element element level BEM identifier
 * @param {string} modifier modifier level BEM identifier
 * @param {string} layoutStyle extra className to be appended as 2nd class
 * @return {string} built className
 */
export default function(
  block: string,
  element?: string,
  modifier?: string,
  layoutStyle?: string
): string {
  let className = "q20_";
  if (block) {
    className += camelcase(block);
  } else {
    throw new Error("className function not supplied with a block string");
  }

  if (element) {
    className += "__" + camelcase(element);
  }

  if (modifier && element) {
    className += "--" + camelcase(modifier);
  } else if (modifier && !element) {
    throw new Error(
      "className funciton was supplied a modifier but no element"
    );
  }

  if (layoutStyle) {
    className += " " + layoutStyle;
  }

  return className;
}
