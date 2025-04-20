import { number } from '#src/utils/sort.js';

export function groupBy<T, K>(value: T[], predicate: (value: T) => K) {
  const result = new Map<K, T[]>();

  for (let index = 0; index < value.length; index++) {
    const item = value[index];

    const key = predicate(item);

    if (result.has(key)) {
      result.get(key)!.push(item);
    }
    else {
      result.set(key, [item]);
    }
  }

  return result;
}

export function median(value: number[]): number {
  value = Array.from(value).sort(number.asc);

  const middle = Math.floor(value.length / 2);

  if (value.length % 2 === 0) {
    return (value[middle - 1] + value[middle]) / 2;
  }

  return value[middle];
}

export function unique<T>(value: T[]): T[] {
  const result = new Set<T>();

  for (var index = 0; index < value.length; index++) {
    result.add(value[index]);
  }

  return Array.from(result);
}

export function wrap<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}
