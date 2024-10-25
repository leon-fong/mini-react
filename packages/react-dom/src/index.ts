import { _render } from "mini-react-reconciler";
import { ReactElementType } from "@mini-react/shared/types";

export const createRoot = (rootElement: Element) => ({
  unmount: () => {}, // TODO
  render: (rootChild: ReactElementType) => _render(rootChild, rootElement),
});
