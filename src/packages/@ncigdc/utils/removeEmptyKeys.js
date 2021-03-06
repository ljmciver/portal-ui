type TIsEmptyObject = (x: mixed) => boolean;
export type TRemoveEmptyKeys = (p: Object) => Object;

const isEmptyObject: TIsEmptyObject = x =>
  typeof x === 'object' && Object.keys(x || {}).length === 0;

export const removeEmptyKeys: TRemoveEmptyKeys = obj =>
  Object.entries(obj || {}).reduce((acc, [key, value]) => {
    return !value || isEmptyObject(value) ? acc : { ...acc, [key]: value };
  }, {});

export default removeEmptyKeys;
