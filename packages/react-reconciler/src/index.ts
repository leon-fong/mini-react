import { ReactElementType } from "@mini-react/shared/types";
import {
  isEvent,
  isGone,
  isNew,
  isProperty,
  isPropertyExceptEvent,
} from "@mini-react/shared/utils";

interface FiberNode extends ReactElementType {
  dom: Element | null;
  parent: FiberNode;
  child: FiberNode;
  sibling: FiberNode;
  alternate: FiberNode | null;
  effectTag?: "UPDATE" | "PLACEMENT" | "DELETION";
}

function createDom(fiber: ReactElementType): Element | Text {
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = fiber.props[name];
    });

  return dom;
}

function updateDom(dom: Element, prevProps, nextProps) {
  // remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // remove old props
  Object.keys(prevProps)
    .filter(isPropertyExceptEvent)
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = "";
    });

  // set new or changed props
  Object.keys(nextProps)
    .filter(isPropertyExceptEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = nextProps[name];
    });

  // add new event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}

function commitRoot() {
  deletions.forEach(commitWork);
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}

function commitWork(fiber: FiberNode) {
  if (!fiber) return;
  const domParent = fiber.parent.dom;

  if (fiber.effectTag === "PLACEMENT" && fiber.dom !== null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom !== null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === "DELETION") {
    domParent?.removeChild(fiber.dom);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function render(element: ReactElementType, container: Element) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
  };
  deletions = [];
  nextUnitOfWork = wipRoot;
}

let nextUnitOfWork: FiberNode | null = null;
let wipRoot: FiberNode | null = null;
let currentRoot: FiberNode | null = null;
let deletions = null;

function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}
requestIdleCallback(workLoop);

function performUnitOfWork(fiber: FiberNode) {
  if (fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  const elements = fiber.props.children;

  reconcileChildren(fiber, elements);

  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;

  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

function reconcileChildren(wipFiber: FiberNode, elements: FiberNode[]) {
  let index = 0;
  let oldFiber = wipFiber?.alternate?.child;
  let prevSiblings = null;

  while (index < elements.length || oldFiber !== null) {
    const element = elements[index];
    let newFiber: FiberNode | null = null;

    const sameType = element && oldFiber && element.type === oldFiber.type;

    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        parent: wipFiber,
        dom: oldFiber.dom,
        alternate: oldFiber,
        effectTag: "UPDATE",
      };
    }

    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        parent: wipFiber,
        dom: null,
        alternate: null,
        effectTag: "PLACEMENT",
      };
    }

    if (oldFiber && !sameType) {
      oldFiber.effectTag = "DELETION";
      deletions.push(oldFiber);
    }

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSiblings.sibling = newFiber;
    }

    prevSiblings = newFiber;
    index++;
  }
}
