// クラスのインスタンスのインターフェースに一致する属性値のオブジェクトを返す
// utilityに置くと、あちこちで自由に使われるので本当はEntityBaseなどの基底クラスにおきたかったがthis[x]の
// コンパイルエラーが解消できなそうなので一旦utilityにおく

import { getClassProperties } from './getClassProperties';

export const getAttributes = <T extends object>(
  entity: T,
): {
  [k: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
} => {
  const attrs: [keyof T, any][] = []; // eslint-disable-line @typescript-eslint/no-explicit-any
  const propertyKeys = getClassProperties(entity);

  propertyKeys.forEach((key) => {
    attrs.push([key as keyof T, entity[key as keyof T]]);
  });

  return Object.fromEntries(attrs);
};
