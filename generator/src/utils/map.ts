export function serialize<TKey, TValue>(value: Map<TKey, TValue>): string {
  return JSON.stringify(value, function (_, _value) {
    if (_value instanceof Map) {
      return {
        __instanceof__: 'Map',
        __value__: [..._value],
      };
    }

    return _value;
  });
}

export function deserialize<TKey, TValue>(value: string): Map<TKey, TValue> {
  return JSON.parse(value, function (_, _value) {
    if (typeof _value === 'object' && _value !== null) {
      if (_value.__instanceof__ === 'Map') {
        return new Map(_value.__value__);
      }
    }

    return _value;
  });
}
