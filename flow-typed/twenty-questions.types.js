export type ErrorType = {
  [fieldName: string]: string[],
};

type FormNodeType = {
  name: string,
  type?: NodeType,
  title?: string,
  description?: string,
  properties?: FormNodeType[],
}

export type NodeType = "object" | "string" | "number" | "boolean";
