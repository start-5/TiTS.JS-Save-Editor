export type SelectOptionValue = boolean | number | string;

export type SelectOption<T extends SelectOptionValue> = {
  value: T;
  label: string;
};

export type SelectOptions<T extends SelectOptionValue> = SelectOption<T>[];
