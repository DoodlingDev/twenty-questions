// @flow
import React, { Component } from "react";
import FormNodeObject from "./nodes/types/object";
import getWidgets from "../utils/getWidgets";
import withValidation from "./validator";
import ErrorHandler from "./errorHandler";
import camelize from "../utils/camelize";

/**
 * FormController
 *   master component for the q20 forms, holds values and errors
 */
export class FormController extends Component<
  q20$FormControllerProps,
  q20$FormControllerState,
> {
  static defaultProps = {
    typeAheadValidation: true,
    errorHandlerComponent: ErrorHandler,
  };

  +changeValue: (changeData: q20$ChangeDataParams) => true;
  +registerField: () => typeof undefined;
  +deleteRowValue: () => typeof undefined;

  /**
   * constructor
   * @param {q20$FormControllerProps} props
   */
  constructor(props: q20$FormControllerProps) {
    super(props);
    this.changeValue = this.changeValue.bind(this);
    this.registerField = this.registerField.bind(this);
    this.deleteRowValue = this.deleteRowValue.bind(this);
    this.state = {
      values: {},
      errors: {},
      fieldRegistry: [],
    };
  }

  /**
   * changeValue
   *   updates the form's internal state with new data from the field element
   *
   * @param {q20$ChangeDataParams} changeData
   *   required data sent from the form field
   * @return {boolean}
   */
  changeValue(changeData: q20$ChangeDataParams): boolean {
    if (changeData.path === undefined || changeData.value === undefined || changeData.name === undefined) return false;
    this.setState(
      (oldState: q20$FormControllerState): q20$FormControllerState => {
        let newState = Object.assign(oldState, {});
        newState.values[changeData.path] = changeData.value;
        return newState;
      },
      () => {
        if (this.props.typeAheadValidation) {
          this.props.validate.single(changeData);
        }
      },
    );
    return true;
  }

  /**
   * of
   * @param {object} props path (string) and index(number) being
   *   passed from the field that is being deleted.
   */
  deleteRowValue(props: q20$DeleteRowValues): typeof undefined {
    const { path: changePath, index: changeIndex } = props;
    this.setState(oldState => {
      let newState = { ...oldState };
      const deletedRowRegex = new RegExp("^" + changePath + "\\." + changeIndex);

      for (let valuePair in newState.values) {
        if (deletedRowRegex.test(valuePair)) {
          delete newState.values[valuePair];
        }
      }

      const sortedNamedValues = {};
      const captureRegex = new RegExp("^" + changePath + "\\.(\\d)");
      for (let name in newState.values) {
        if (newState.values.hasOwnProperty(name)) {
          let matchGroup = captureRegex.exec(name);

          if (matchGroup) {
            let index = matchGroup[1];
            if (!sortedNamedValues[index]) {
              sortedNamedValues[index] = [];
            }
            sortedNamedValues[index].push({
              [name]: newState.values[name],
            });
          }
        }
      }

      for (let i = 0, l = Object.keys(sortedNamedValues).length; i < l; i++) {
        let oldIndex = Object.keys(sortedNamedValues)[i];
        const sortedValueObjects = sortedNamedValues[oldIndex];

        for (let valuePairIndex in sortedValueObjects) {
          if (sortedValueObjects.hasOwnProperty(valuePairIndex)) {
            let oldValue =
              sortedValueObjects[valuePairIndex][
                Object.keys(sortedValueObjects[valuePairIndex])[0]
              ];
            let newKey = Object.keys(sortedValueObjects[valuePairIndex])[0].replace(
              new RegExp("\\." + oldIndex + "\\."),
              "." + i + ".",
            );
            newState.values[newKey] = oldValue;
          }
        }
      }

      const obsoleteRowRegex = new RegExp(
        "^" +
          changePath +
          "\\." +
          Object.keys(sortedNamedValues)[
            Object.keys(sortedNamedValues).length - 1
          ],
      );
      for (let valuePair in newState.values) {
        if (obsoleteRowRegex.test(valuePair)) {
          delete newState.values[valuePair];
        }
      }

      return newState;
    });
  }

  /**
   * registerField
   *   Adds a field's path to the registry, but only once.
   *
   * @param {string} path the field's path
   */
  registerField(path: string) {
    if (this.state.fieldRegistry.includes(path)) {
      return;
    } else {
      this.setState(oldState => {
        let newState = Object.assign(oldState);
        newState.fieldRegistry.push(path);
        return newState;
      });
    }
  }

  /**
   * render
   *   react render function
   *   renders the FormBuilder to make the markup
   * @return {React$Element} FormBuilder
   */
  render() {
    const {
      widgets,
      widget,
      title,
      description,
      properties,
      label,
    } = this.props;
    return (
      <form>
        <h2>{title}</h2>
        {description && <h3>{description}</h3>}

        <FormNodeObject
          key={`top-object-${camelize(title)}`}
          name={camelize(title)}
          label={label ? label : undefined}
          description={description}
          type={"object"}
          path={`${camelize(title)}`}
          properties={properties}
          widgets={getWidgets(widgets)}
          widget={widget ? widget : undefined}
          valueManager={{
            update: this.changeValue,
            values: this.state.values,
            validate: this.props.validate.state,
            deleteRow: this.deleteRowValue,
          }}
          register={this.registerField}
        />
      </form>
    );
  }
}

export default withValidation(FormController);
