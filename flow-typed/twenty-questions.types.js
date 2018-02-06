export type q20$Error = {
  [fieldName: string]: string[],
};

export type q20$widgetList = {
  [widgetName: string]: React.Component,
}

export type q20$ValueManager = {
  update: (changeData: q20$ChangeDataParams) => boolean,
  values: q20$FormValues,
  errors: q20$FormErrors,
}

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
}

export type q20$Node = q20$RenderedNode & { type: q20$NodeType }

export type q20$NodeType = "object" | "string" | "array" | "number" | "boolean";

