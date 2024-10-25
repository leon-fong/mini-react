import { ReactElementType } from "@mini-react/shared/types";
import {
  isEvent,
  isGone,
  isNew,
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

const init = (() => {
  function createDom(fiber: ReactElementType): Element | Text {
    const dom =
      fiber.type === "TEXT_ELEMENT"
        ? document.createTextNode("")
        : document.createElement(fiber.type);

    updateDom(dom, {}, fiber.props);

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

    let domParentFiber = fiber.parent;
    while (!domParentFiber.dom) {
      domParentFiber = domParentFiber.parent;
    }
    const domParent = domParentFiber.dom;

    if (fiber.effectTag === "PLACEMENT" && fiber.dom !== null) {
      domParent.appendChild(fiber.dom);
    } else if (fiber.effectTag === "UPDATE" && fiber.dom !== null) {
      updateDom(fiber.dom, fiber.alternate.props, fiber.props);
    } else if (fiber.effectTag === "DELETION") {
      commitDeletion(fiber, domParent);
    }

    commitWork(fiber.child);
    commitWork(fiber.sibling);
  }

  function commitDeletion(fiber: FiberNode, domParent: Element) {
    if (fiber.dom) {
      domParent.removeChild(fiber.dom);
    } else {
      commitDeletion(fiber.child, domParent);
    }
  }

  function _render(element: ReactElementType, container: Element) {
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
  let deletions: FiberNode[] | null = null;

  function workLoop(deadline: IdleDeadline) {
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
    const isFunctionComponent = fiber.type instanceof Function;

    if (isFunctionComponent) {
      updateFunctionComponent(fiber);
    } else {
      updateHostComponent(fiber);
    }

    // select the next unit of work
    // prefer: child > sibling > uncle(the sibling of the parent)
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

  function updateFunctionComponent(fiber: FiberNode) {
    const children = [fiber.type(fiber.props)];
    reconcileChildren(fiber, children);
  }

  function updateHostComponent(fiber: FiberNode) {
    // add element to the DOM
    if (!fiber.dom) {
      fiber.dom = createDom(fiber);
    }

    // create the fibers for the element's children
    const elements = fiber.props.children;
    reconcileChildren(fiber, elements);
  }

  function reconcileChildren(wipFiber: FiberNode, elements: FiberNode[]) {
    let index = 0;
    let oldFiber = wipFiber?.alternate?.child;
    let prevSiblings = null;

    while (index < elements.length || !!oldFiber) {
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
        wipFiber.child = newFiber;
      } else if (element) {
        prevSiblings.sibling = newFiber;
      }

      prevSiblings = newFiber;
      index++;
    }
  }

  return { _render };
})();

export const { _render } = init;
