import { wrap } from '#src/utils/array.js';

export function stripStart(value: string, search: string | string[]): string {
  wrap(search).forEach(function (str) {
    if (value.startsWith(str)) {
      value = value.slice(str.length);
    }
  });

  return value;
}

export function before(value: string, search: string): string {
  if (search === '') {
    return value;
  }

  const index = value.indexOf(search);

  if (index !== -1) {
    return value.slice(0, index);
  }

  return value;
}

export function titleCase(value: string): string {
  if (value === '') {
    return value;
  }

  return value
    .toLowerCase()
    .replace(/^[-_ ]*(.)/, function (_, str) {
      return str.toUpperCase();
    })
    .replace(/[-_ ]+(.)/g, function (_, str) {
      return ` ${str.toUpperCase()}`;
    });
}

export function ucfirst(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
