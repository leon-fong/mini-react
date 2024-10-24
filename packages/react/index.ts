type Props = Record<string, any> | null;

export const createElement = (
  type: string,
  props: Props,
  ...children: any[]
) => ({
  type,
  props: {
    ...props,
    children: children.map((child) =>
      typeof child === "object" ? child : createTextElement(child)
    ),
  },
  __mark: "mini-react",
});

function createTextElement(text: string) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}
