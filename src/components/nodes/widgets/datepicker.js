// @flow
import React, { Component } from "react";
import cn from "../../../utils/className";
// $FlowFixMe
import DatePickerComponent from "react-datepicker";
import * as dateHelpers from "../../../utils/dateHelpers";

type State = {

};

/**
 * DatePicker
 *  type String
 *  Uses a visual datepicker widget to select a date. The date is displayed
 *  in the selected string format, but stored as an ISO string.
 */
export default class DatePicker extends Component<q20$RenderedNode, State> {
  /**
   * constructor
   * @param {object} props props passed from the parent
   */
  constructor(props: q20$RenderedNode): typeof undefined {
    super(props);

    if (props.defaultDate) {
      switch (props.defaultDate) {
        case "now":
          let date = dateHelpers.currentDateAsISOString();
          props.valueManager.update({
            path: props.path,
            name: props.name,
            value: date,
          });
      }
    }
  }

  /**
   * render
   *   React render function
   * @return {object} rendered node
   */
  render() {
    return (
      <DatePickerComponent
        key={this.props.path}
        dateFormat={dateHelpers.defaultDateStrFormat}
        onBlur={e => e.preventDefault()}
        onChangeRaw={event => {
          this.props.valueManager.update({
            path: this.props.path,
            name: this.props.name,
            value: event.currentTarget.value,
          });
        }}
        onChange={event => {
          let isoString = dateHelpers.momentToISOString(event);
          this.props.valueManager.update({
            path: this.props.path,
            name: this.props.name,
            value: isoString,
          });
        }}
        placeholderText={this.props.dateFormat}
        defaultValue={dateHelpers.datePickerValue(this.props.valueManager.values[this.props.path])}
        value={dateHelpers.datePickerValue(this.props.valueManager.values[this.props.path])}
        selected={dateHelpers.onlyMomentJS(this.props.valueManager.values[this.props.path])}
        disabled={this.props.disabled}
        showYearDropdown
      />
    );
  }
}
