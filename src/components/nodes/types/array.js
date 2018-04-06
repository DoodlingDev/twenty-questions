// @flow
import React, { Component } from "react";
import cn from "../../../utils/className";
import FormNodeObject from "./object";
import NodeWrapper from "../nodeWrapper";

type q20$FormNodeArrayState = {
  directChildsName: string,
  childFields: number,
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
  +addRow: () => typeof undefined;
  +deleteRow: ({ path: number, index: string }) => typeof undefined;

  directChildsName: string;
  childFields: number;
  /**
   * constructor
   * @param {object} props
   */
  constructor(props: q20$RenderedNode) {
    super(props);
    this.numberOfChildrenWithMatchingPath = this.numberOfChildrenWithMatchingPath.bind(
      this,
    );
    this.addRow = this.addRow.bind(this);
    this.renderChildren = this.renderChildren.bind(this);
    if (this.props.properties) {
      this.directChildsName = this.props.properties[0].name;
    }
    this.childFields = this.numberOfChildrenWithMatchingPath();
    if (this.childFields < 1) {
      this.addRow();
    }
  }

  /**
   * componentDidUpdate
   *   React component lifycycle method for post-update
   *   Checks how many children values exist for this array type input. If the
   *   number of children is below one, it adds an empty row back, because arrays
   *   cannot have 0 instances of child objects.
   */
  componentDidUpdate() {
    this.childFields = this.numberOfChildrenWithMatchingPath();
    if (this.childFields < 1) {
      this.addRow();
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
        <div
          key={`wrapperFor-${this.props.path}.${i}.${this.directChildsName}`}
        >
          <FormNodeObject
            type="object"
            name={this.directChildsName}
            key={`array-node-${this.props.path}-${i}`}
            path={`${this.props.path}.${i}.${this.directChildsName}`}
            widgets={this.props.widgets}
            valueManager={this.props.valueManager}
            register={this.props.register}
            {...passThruProps}
          />
          <button
            type="delete"
            onClick={event => {
              event.preventDefault();
              this.props.valueManager;
              this.props.valueManager.deleteRow({
                path: this.props.path,
                index: i,
              });
            }}
          >
            delete
          </button>
        </div>,
      );
    }
    return outputBuffer;
  }

  /**
   * addRow
   */
  addRow(): typeof undefined {
    this.props.valueManager.update({
      path: `${this.props.path}.${this.numberOfChildrenWithMatchingPath()}.${
        this.directChildsName
      }`,
      name: this.directChildsName,
      value: {},
    });
  }

  /**
   * render
   *   React Render Function
   * @return {object} component renders to the DOM
   */
  render() {
    if (this.props.widget) {
      const downcasedWidgetName = this.props.widget.toLowerCase();
      const WidgetTag = this.props.widgets[downcasedWidgetName];
      return (
        <NodeWrapper {...this.props}>
          <WidgetTag {...this.props} />
        </NodeWrapper>
      );
    } else {
      return (
        <NodeWrapper {...this.props}>
          <fieldset
            className={cn(
              "nodeArray",
              this.props.name,
              "fieldset",
              this.props.layoutStyle,
            )}
          >
            <button
              type="add"
              onClick={event => {
                event.preventDefault();
                this.addRow();
              }}
            >
              add
            </button>
            {this.renderChildren()}
          </fieldset>
        </NodeWrapper>
      );
    }
  }
}

export default FormNodeArray;
