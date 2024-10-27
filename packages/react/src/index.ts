import {
  useState as _useState,
  useEffect as _useEffect,
} from "mini-react-reconciler";

type Props = Record<string, any> | null;

function createElement(type: string, props: Props, ...children: any[]) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
    __mark: "mini-react",
  };
}

function createTextElement(text: string) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

export const useState = _useState;
export const useEffect = _useEffect;

const miniReact = {
  createElement,
  version: "0.0.1",
};

export default miniReact;
