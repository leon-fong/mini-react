// import { ReactElementType } from "../types";

export const createRoot = (rootElement: Element) => ({
  unmount: () => {},
  render: (rootChild) => _render(rootChild, rootElement),
});

function _render(rootChild: any, rootElement: Element) {
  const rootChildElement =
    rootChild.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(rootChild.type);
  const isProperty = (key) => key !== "children";

  Object.keys(rootChild.props)
    .filter(isProperty)
    .forEach((name) => {
      rootChildElement[name] = rootChild.props[name];
    });

  rootChild.props.children.forEach((child) => _render(child, rootChildElement));
  rootElement.appendChild(rootChildElement);
}
