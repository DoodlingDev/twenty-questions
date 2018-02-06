export type q20$Error = {
  [fieldName: string]: string[],
};

export type q20$Node = {
  name: string,
  type: q20$NodeType,
  path: string,
  label?: string,
  description?: string,
  properties?: q20$Node[],
};

export type q20$RenderedNode = {
  name: string,
  path: string,
  label?: string,
  description?: string,
  properties?: q20$Node[],
}

export type q20$NodeType = "object" | "string" | "array" | "number" | "boolean";

