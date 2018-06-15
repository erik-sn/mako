export interface IMap<T> {
  [K: string]: T;
}

export interface ISelectOption {
  value: string;
  label: string;
}

export interface IDjangoErrors {
  [key: string]: string | string[];
}
