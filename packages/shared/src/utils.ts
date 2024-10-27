export const isProperty = (key: string) => key !== "children";
export const isNew = (prev, next) => (key) => prev[key] !== next[key];
export const isGone = (prev, next) => (key) => !(key in next);
export const isFunction = (action: any) => typeof action === "function";
export const isEvent = (key: string) => key.startsWith("on");
export const isPropertyExceptEvent = (key: string) =>
  key !== "children" && !isEvent(key);

export function isArrayEqual(arr1: unknown[], arr2: unknown[]) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  return arr1.every((key) => arr2.includes(key));
}
