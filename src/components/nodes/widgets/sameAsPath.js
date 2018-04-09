// @flow
import React, { Component } from "react";
import cn from "../../../utils/className";

/**
 * doValuesExistAndMatch
 *   checks similarity between two values. If either are falsey,
 *   immediately returns false.
 *
 * @param {?string} valueOne
 * @param {?string} valueTwo
 * @return {boolean} are they the same?
 */
function doValuesExistAndMatch(valueOne: ?string, valueTwo: ?string) {
  if (!valueOne || !valueTwo) return false;
  return valueOne === valueTwo;
}

type SameAsState = {
  checked: boolean,
}

/**
 * SameAsPathWidget
 *   This widget is rendered when the schema supplies requires an option to be set
 *   to the value of another field in the form.
 *   While the checkbox here is checked, the child field will continually check its
 *   own value against the matcher field's value. If it does not match, it will
 *   update itself through the valueManager.
 */
export default class SameAsPathWidget extends Component<q20$RenderedNode, SameAsState> {
  /**
   * constructor
   * @param {q20$RenderedNode} props props of this node thru from Node Wrapper
   */
  constructor(props: q20$RenderedNode) {
    super(props);
    const thisValue = this.props.valueManager.values[this.props.path];
    let sameAsValue = null;
    if (this.props.sameAsPath) {
      sameAsValue = this.props.valueManager.values[this.props.sameAsPath];
    }
    this.state = {
      checked: doValuesExistAndMatch(thisValue, sameAsValue),
    };
  }

  /**
   * componentDidUpdate
   *   lifecycle method. When recieving new props (which includes the current values
   *   of the form) checks state to see if checked is true. If it is, and the values
   *   between the two fields do not match, this will update the value of the "following"
   *   field to match the "followed" field.
   */
  componentDidUpdate() {
    if (!this.props.sameAsPath) return;
    const values = this.props.valueManager.values;
    if (this.state.checked === true && values[this.props.path] !== values[this.props.sameAsPath]) {
      this.props.valueManager.update({
        path: this.props.path,
        name: this.props.name,
        value: this.props.valueManager.values[this.props.sameAsPath],
      });
    }
  }

  /**
   * render
   *   React render method
   * @return {ReactElement} rendered node
   */
  render() {
    return(
      <div className={cn("node", "sameAsPath", this.props.name, this.props.layoutStyle)}>
        {this.props.children}
        <label>
          {
            this.props.sameAsPathMessage ?
              this.props.sameAsPathMessage
            : "Same as Above"
          }
          <input
            type="checkbox"
            checked={this.state.checked}
            onChange={event => {
              this.setState({
                checked: !this.state.checked,
              });
            }}
          />
        </label>
      </div>
    );
  }
}
