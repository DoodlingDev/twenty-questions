// @flow
import React, { Component } from "react";
import cn from "../../../utils/className";

type $props = {

};

type $state = {
  focused: boolean,
};

export default class OnFocus extends Component<$props, $state> {
  /**
   * constructor
   * @param {object} props passed in props
   */
  constructor(props: $props): typeof undefined {
    super(props);
    this.state = {
      focused: true,
    };
    // check for child data existing
  }

  _toggleFocus() {
    this.setState({ focused: !this.state.focused });
  }

  _renderOnFocusConditions() {
  }

  render() {
    if (this.state.focused) {

    } else {
      return (
        <h1>unfocused</h1>
      );
    }
  };
}
