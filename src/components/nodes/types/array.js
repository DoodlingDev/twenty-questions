// @flow
import React, { Component } from "react";
import cn from "../../../utils/className";
import ErrorHandler from "../../errorHandler";
import FormNodeObject from "./object";

type q20$FormNodeArrayState = {
  directChildsName: string,
};

/**
 * FormNodeArray
 *   Component which displays and maintains a fieldset whose values
 *   are an array.
 */
export class FormNodeArray extends Component<
  q20$RenderedNode,
  q20$FormNodeArrayState,
> {
  +renderChildren: () => React$Element<*>[];
  +numberOfChildrenWithMatchingPath: () => number;

  directChildsName: string;
  /**
   * constructor
   * @param {object} props
   */
  constructor(props: q20$RenderedNode) {
    super(props);
    if (
      process.env.NODE_ENV != "production" &&
      process.env.NODE_ENV != "test"
    ) {
      if (!props.label) {
        console.warn(
          `Consider adding a label to the field ${
            props.path
          }. Labels are an important accessibilty feature for screen readers and other assistive devices. If you don't want the label to display, pass this input the "no-label" layoutStyle. Placeholders are not substitutes for label elements.`,
        );
      }
    }
    this.numberOfChildrenWithMatchingPath = this.numberOfChildrenWithMatchingPath.bind(
      this,
    );
    this.renderChildren = this.renderChildren.bind(this);
    if (this.props.properties) {
      this.directChildsName = this.props.properties[0].name;
    }
  }

  /**
   * numberOfChildrenWithMatchingPath
   *   Collects a count of the number of objects in the store that
   *   are direct decendants of this array object.
   *
   * @return {number} The number of matching paths in valueManager
   */
  numberOfChildrenWithMatchingPath(): number {
    const valuesPaths = Object.keys(this.props.valueManager.values);
    const escapedDotsPath = this.props.path.replace(/\./, ".");

    const pathRegex = new RegExp(
      `^${escapedDotsPath}\\.\\d+\\.${this.directChildsName}$`,
    );
    let count = 0;
    valuesPaths.forEach((fieldPath: string) => {
      if (pathRegex.test(fieldPath)) {
        count++;
      }
    });
    if (count < 1) {
      count++;
    }
    console.log(count)
    return count;
  }

  /**
   * renderChildren
   *   Renders the array's property object n times, where n is
   *   the number of entries in Value Manager which match the
   *   direct descendent's path.
   *
   * @return {array}
   */
  renderChildren(): React$Element<*>[] {
    let outputBuffer = [];
    const childrenCount = this.numberOfChildrenWithMatchingPath();
    const passThruProps = this.props.properties
      ? { ...this.props.properties[0] }
      : undefined;

    for (let i = 0, l = childrenCount; i < l; i++) {
      outputBuffer.push(
        <FormNodeObject
          key={`array-node-${this.props.path}-${i}`}
          path={`${this.props.path}.${i}.${this.directChildsName}`}
          widgets={this.props.widgets}
          valueManager={this.props.valueManager}
          register={this.props.register}
          {...passThruProps}
        />,
      );
    }
    return outputBuffer;
  }

  /**
   * render
   *   React Render Function
   * @return {object} component renders to the DOM
   */
  render() {
    if (this.props.widget) {
      const WidgetTag = this.props.widgets[this.props.widget];
      return <WidgetTag {...this.props} />;
    } else {
      return (
        <div className={cn("node", "array")}>
          {this.props.label && (
            <label
              htmlFor={this.props.path}
              className={cn(
                "nodeArray",
                this.props.name,
                "label",
                this.props.layoutStyle,
              )}
            >
              {this.props.label}
              {this.props.description && (
                <span
                  htmlFor={this.props.path}
                  className={cn(
                    "nodeArray",
                    this.props.name,
                    "description",
                    this.props.layoutStyle,
                  )}
                >
                  {this.props.description}
                </span>
              )}
            </label>
          )}

          {!this.props.label &&
            this.props.description && (
              <span
                htmlFor={this.props.path}
                className={cn(
                  "nodeArray",
                  this.props.name,
                  "description",
                  this.props.layoutStyle,
                )}
              >
                {this.props.description}
              </span>
            )}

          <ErrorHandler
            key={`errorHandler-${this.props.path}`}
            name={this.props.name}
            path={this.props.path}
            value={this.props.valueManager.values[this.props.path]}
            label={this.props.label || this.props.name}
            validations={this.props.valueManager.validate[this.props.path]}
          >
            <fieldset
              className={cn(
                "nodeArray",
                this.props.name,
                "fieldset",
                this.props.layoutStyle,
              )}
            >
              {this.renderChildren()}
            </fieldset>
          </ErrorHandler>
        </div>
      );
    }
  }
}

export default FormNodeArray;
