export const createElement = (type, props, ...children) => ({
  type,
  props: {
    ...props,
    children
  },
  __mark: 'mini-react'
})
