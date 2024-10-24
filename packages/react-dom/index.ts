// import { ReactElementType } from "../types";

export const createRoot = (rootElement: Element) => ({
  unmount: () => {},
  render: (rootChild: any) => {
    const rootChildElement = document.createElement(rootChild.type);
    rootElement.appendChild(rootChildElement);
  },
});
