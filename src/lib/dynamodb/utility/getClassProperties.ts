// https://qiita.com/suin/items/b807769388c54c57a8be
// https://zenn.dev/tanukikyo/articles/cc1d5762252867

export const getClassProperties = (obj: object): string[] => {
  const getOwnProperties = (obj: object) =>
    Object.entries(Object.getOwnPropertyDescriptors(obj))
      .filter(([_name, { value }]) => typeof value !== 'function')
      .map(([name]) => name);
  const _getProperties = (o: object, properties: string[]): string[] =>
    o === Object.prototype
      ? properties
      : _getProperties(
          Object.getPrototypeOf(o),
          properties.concat(getOwnProperties(o)),
        );
  return _getProperties(obj, []);
};
