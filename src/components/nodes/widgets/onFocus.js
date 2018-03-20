// @flow
import React, { Component } from "react";
import cn from "../../../utils/className";
import FormNodeObject from "../types/object";

type $state = {
  focused: boolean,
};

/**
 * OnFocus
 *   OnFocus fields show a placeholder element until they are activated by
 *   gaining focus. By default, that placeholder shows the "placeholder" prop.
 *   OnFocus fields are object type, and display the object as normal once focused.
 *   If the valueManager is holding state/values for any of the object's children,
 *   the field will display instead of the placeholder.
 */
export default class OnFocus extends Component<q20$Node, $state> {
  +_toggleFocus: () => typeof undefined;
  +_hasChildDataBeenEntered: () => boolean;
  /**
   * constructor
   * @param {object} props passed in props
   */
  constructor(props: q20$Node): typeof undefined {
    super(props);
    this._toggleFocus = this._toggleFocus.bind(this);
    this._hasChildDataBeenEntered = this._hasChildDataBeenEntered.bind(this);
    this.state = {
      focused: this._hasChildDataBeenEntered(),
    };
  }

  /**
   * _hasChildDataBeenEntered
   *   Checks the value manager's list of values and returns true if any values
   *   therein hold any data.
   *
   * @return {boolean} true/false result
   */
  _hasChildDataBeenEntered() {
    const pathMatchRegexp = new RegExp("^" + this.props.path + ".?")
    for (let fieldName in this.props.valueManager.values) {
      if (this.props.valueManager.values.hasOwnProperty(fieldName)) {
        let fieldValue = this.props.valueManager.values[fieldName];
        if (pathMatchRegexp.test(fieldName) &&
          (fieldValue != undefined && fieldValue != "")) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * _toggleFocus
   *   Flips toggled state from true to false & vice versa
   */
  _toggleFocus() {
    this.setState({ focused: !this.state.focused });
  }

  /**
   * render
   *   React render method
   * @return {object} React DOM representation
   */
  render() {
    const {
      path,
      widgets,
      name,
      valueManager,
      register,
      ...passThruProps
    } = this.props;
    if (this.state.focused) {
      return (
        <div
          key={`wrapperFor-${path}-focused`}
          className={cn("focus-field", path, "container-div")}
        >
          <FormNodeObject
            type="object"
            name={name}
            key={`inFocus-node-${path}`}
            path={`${path}`}
            widgets={widgets}
            valueManager={valueManager}
            register={register}
            {...passThruProps}
          />
        </div>
      );
    } else {
      return (
        <div
          className={cn("focus-field", path, "awaiting-focus")}
          onFocus={this._toggleFocus}
          tabIndex="0"
        >
          {this.props.placeholder ? this.props.placeholder : this.props.name}
        </div>
      );
    }
  }
}
