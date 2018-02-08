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
  errors: q20$FormErrors,
};

export type q20$RenderedNode = {
  name: string,
  path: string,
  valueManager: q20$ValueManager,
  label?: string,
  description?: string,
  properties?: q20$Node[],
  widget?: string,
  widgets: q20$widgetList,
  layoutStyle?: string,
  placeholder?: string,
  validates?: string[],
};

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
  description?: string,
  widgets?: q20$RenderedNode[],
};

export type q20$FormControllerState = {
  values: q20$FormValues,
  errors: q20$FormErrors,
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
