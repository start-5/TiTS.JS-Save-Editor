type SortCallbackResult<T> = (a: T, b: T) => number;

type SortModule<T> = {
  asc: SortCallbackResult<T>;
  desc: SortCallbackResult<T>;
};

export const string: SortModule<string> = {
  asc(a: string, b: string): number {
    return a.localeCompare(b);
  },
  desc(a: string, b: string): number {
    return b.localeCompare(a);
  }
};

export const stringLength: SortModule<string> = {
  asc(a: string, b: string): number {
    return number.asc(a.length, b.length);
  },
  desc(a: string, b: string): number {
    return number.desc(a.length, b.length);
  }
};

export const number: SortModule<number> = {
  asc(a: number, b: number): number {
    return a - b;
  },
  desc(a: number, b: number): number {
    return b - a;
  }
};
