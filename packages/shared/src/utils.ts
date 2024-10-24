export const isProperty = (key: string) => key !== "children";
export const isNew = (prev, next) => key =>
  prev[key] !== next[key]
export const isGone = (prev, next) => key => !(key in next)

export const isEvent = key => key.startsWith("on")
export const isPropertyExceptEvent = key =>
  key !== "children" && !isEvent(key)
