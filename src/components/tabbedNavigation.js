import React, { Component } from "react";
/* eslint react/prop-types: "off" */

/**
 * withTabbedNavigation
 *   higher-order component to track state of which tab is open at any given
 *   moment for multi-tabbed forms.
 *   Exposes the index for the current active tab and functions for
 *   changing the number.
 *
 * @param {Component} WrappedComponent The component that will be wrapped
 *   with the tab navigation HOC
 * @return {class} Wrapper class
 */
export default function withTabbedNavigation(WrappedComponent) {
  return class WithTabbedNavigation extends Component {
    /**
     * constructor
     * @param {object} props
     */
    constructor(props) {
      super(props);
      this.setIndex = this.setIndex.bind(this);
      this.state = {
        activeIndex: 0,
        tabLength: props.properties.length - 1,
        labelArray: this.getLabelsFromProperties(),
      };
    }

    /**
     * getLabelsFromProperties
     *   Constructs an array of strings, one for each label attribute
     *   on the formObject in properties.
     * @return {array} the array of strings
     */
    getLabelsFromProperties() {
      let outputBuffer = [];
      this.props.properties.forEach(formObject => {
        if (formObject.label) {
          outputBuffer.push(formObject.label)
        }
      });
      return outputBuffer;
    }

    /**
     * setTab
     *   sets state of the active tab depending on the argument.
     *   Checks for going over the length or below 0.
     * @param {number} n the tab index to be set to
     */
    setIndex(n) {
      let newActiveTab = n;
      if (n > this.state.tabLength) {
        newActiveTab = this.state.tabLength;
      }
      if (n < 0) {
        newActiveTab = 0;
      }
      this.setState({
        activeIndex: newActiveTab,
      });
    }

    /**
     * React render function
     * @return {object} Representation of the wrapped component in the dom
     */
    render() {
      return (
        <WrappedComponent
          tabs={{
            activeTab: this.state.activeIndex,
            tabbed: this.state.tabLength > 0,
            tabLabels: this.state.labelArray,
            setTab: this.setIndex,
            nextTab: () => this.setIndex(this.state.activeIndex + 1),
            prevTab: () => this.setIndex(this.state.activeIndex - 1),
          }}
          {...this.props}
        />
      );
    }
  }
}
