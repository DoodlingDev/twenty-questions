export type Schema = {
  properties: FormNodeType[],
  name: string,
  title?: string,
  description?: string,
};

export type ErrorType = {
  [fieldName: string]: string[],
};

export type FormNodeType = {
  name: string,
  title?: string,
  description?: string,
};
