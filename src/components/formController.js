// @flow
import React, { Component } from "react";
import withValueManager from "./valueManager";
import FormNodeObject from "./nodes/types/object";
import getWidgets from "../utils/getWidgets";
import withValidation from "./validator";
import camelize from "../utils/camelize";
import withTabbedNavigation from "./tabbedNavigation";
import FormBuilder from "./formBuilder";
import TabButton from "./tabButton";

/**
 * FormController
 *   master component for twenty-questions. Responsible for rendering
 *   the first object from the passed in schema, as well as being
 *   wrapped with other components that handle state and validation.
 * @return {Component} rendered React Component
 */
export class FormController extends Component<
  q20$FormControllerProps,
  q20$FormControllerState,
> {
  +mapProperties: () => Array<React$Node>;
  +createTabButtons: () => Array<?React$Element<*>>;
  +submitHandler: Object => typeof undefined;

  /**
   * constructor
   * @param {q20$FormControllerProps} props
   */
  constructor(props: q20$FormControllerProps) {
    super(props);
    this.mapProperties = this.mapProperties.bind(this);
    this.createTabButtons = this.createTabButtons.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.state = {
      tabButtons: this.createTabButtons(),
    };
  }

  static defaultProps = {
    submitButton: <button>Submit Me</button>,
    dateFormat: "YYYY-MM-DD",
  };

  /**
   * mapProperties
   *   Iterates through the top-level object types in the form schema
   *   and assigns them each an element in an array. This is the array
   *   that will be used to display the Form's tabs.
   * @return {array} Array of Form Node Objects
   */
  mapProperties() {
    return this.props.properties.map(property => {
      let propertyTitle = property.label || "";
      return (
        <FormNodeObject
          key={`tab-object-${camelize(propertyTitle)}`}
          name={property.name}
          label={property.label ? property.label : undefined}
          description={property.description}
          type="object"
          path={`${camelize(propertyTitle)}`}
          properties={property.properties}
          widgets={getWidgets(this.props.widgets)}
          widget={property.widget ? property.widget : undefined}
          valueManager={{
            update: changeParams => {
              this.props.changeValue(changeParams, () => {
                if (this.props.typeAheadValidation) {
                  this.props.validate.single(changeParams);
                }
              });
            },
            values: this.props.values,
            validate: this.props.validate.state,
            deleteRow: changeParams => {
              this.props.validate.deleteRow(changeParams);
              this.props.deleteRow(changeParams);
            },
          }}
          register={this.props.registerField}
          dateFormat={this.props.dateFormat}
        />
      );
    });
  }

  /**
   * createTabButtons
   *   iterates through the top-level object types in the form schema
   *   and creates a button for each with the label field being the
   *   text on the button.
   * @return {array} the array of buttons
   */
  createTabButtons() {
    if (this.props.tabs.tabLabels.length < 2) {
      return null;
    }
    return this.props.tabs.tabLabels.map((label, index) => {
      return (
        <TabButton
          key={`tabButton-${label}-${index}`}
          label={label}
          handleClick={event => {
            event.preventDefault();
            this.props.tabs.setTab(index);
          }}
        />
      );
    });
  }

  /**
   * submitHandler
   *   runs validations for all the inputs in the form, and then
   *   submits them with the passed-in submit function from props.
   * @param {object} event DOM event that triggered this fn
   */
  submitHandler(event: Object): typeof undefined {
    event.preventDefault();
    if (this.props.validate.all(this.props.values, this.props.fieldRegistry)) {
      debugger
      this.props.submitFn(this.props.submitValues());
    }
  }

  /**
   * render - React render function
   * @return {ReactElement} React representation of dom elements for
   *   this component.
   */
  render() {
    return (
      <FormBuilder
        tabButtons={this.state.tabButtons}
        title={this.props.title}
        description={this.props.description}
        propertyObjects={this.mapProperties()}
        submitButton={this.props.submitButton}
        submitHandler={this.submitHandler}
        tabs={this.props.tabs}
      />
    );
  }
}

export default withTabbedNavigation(
  withValueManager(withValidation(FormController)),
);
