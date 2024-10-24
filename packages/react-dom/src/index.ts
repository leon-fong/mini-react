import { ReactElementType } from "@mini-react/shared/types";
import { isProperty } from "@mini-react/shared/utils";

export const createRoot = (rootElement: Element) => ({
  unmount: () => {},
  render: (rootChild) => _render(rootChild, rootElement),
});

function _render(rootChild: ReactElementType, rootElement: Element | Text) {
  const rootChildElement =
    rootChild.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(rootChild.type)

  Object.keys(rootChild.props)
    .filter(isProperty)
    .forEach((name) => {
      rootChildElement[name] = rootChild.props[name];
    });

  rootChild.props.children.forEach((child) => _render(child, rootChildElement));
  rootElement.appendChild(rootChildElement);
}
