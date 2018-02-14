export type q20$Error = {
  [fieldName: string]: string[],
};

export type q20$Schema = {
  title: string,
  name: string,
  description?: string,
  properties: q20$Node[],
  widget?: string,
};

export type q20$widgetList = {
  [widgetName: string]: React.Component,
};

export type q20$ValueManager = {
  update: (changeData: q20$ChangeDataParams) => boolean,
  values: q20$FormValues,
  deleteRow: ({path: string, index: number}) => typeof undefined,
  validate: q20$FormErrors,
};

export type q20$RenderedNode = {
  name: string,
  path: string,
  valueManager: q20$ValueManager,
  register: (path: string) => typeof undefined,
  type: q20$NodeType,
  label?: string,
  description?: string,
  widget?: string,
  widgets: q20$widgetList,
  layoutStyle?: string,
  placeholder?: string,
  validates?: string[],
  properties?: Array<q20$Property>,
};

export type q20$Property = q20$RenderedNode | q20$RenderedNodeWithChildren;

export type q20$Node = q20$RenderedNode & { type: q20$NodeType };

export type q20$NodeType = "object" | "string" | "array" | "number" | "boolean";

export type q20$ValidationObject = {
  name: string,
  label: string,
  validates: string[],
  type: q20$NodeType,
};

export type q20$FormControllerProps = {
  schema: q20$Schema,
  title: string,
  validate: q20$ValidateHOCPassedProps,
  name: string,
  properties: q20$Node[],
  description?: string,
  widgets?: q20$RenderedNode[],
  widget?: string,
  label?: string,
};

export type q20$FormControllerState = {
  values: q20$FormValues,
  errors: q20$FormErrors,
  fieldRegistry: string[],
};

export type q20$Validator = {};

export type q20$ValidationList = {
  [formNodeName: string]: qb$ValidationObject,
};

export type q20$ChangeDataParams = {
  value: any,
  path: string,
  name: string,
};

export type q20$ValidationParams = {
  value: any,
  path: string,
  name: string,
  label: string,
};

export type q20$ErrorHandlerProps = {
  name: string,
  path: string,
  value: any,
  validations: q20$ValidResult | q20$ErrorResult,
  label: string,
  children: any
};


export type q20$DeleteRowValues = {
  path: string,
  index: number,
};
