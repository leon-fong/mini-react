let nextUnitOfWork = null;
let wipRoot = null;
let currentRoot = null;

function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
  };
  nextUnitOfWork = wipRoot;
}

function workLoop(deadline: IdleDeadline) {
  let shouldYield = false;

  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  requestIdleCallback(workLoop);
}
requestIdleCallback(workLoop);

function performUnitOfWork(fiber) {
  const isFunctionComponent = fiber.type instanceof Function;
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  if (fiber.child) return fiber.child;

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.return;
  }
}

let wipFiber = null
let stateHookIndex = null

function updateFunctionComponent(fiber) {
  wipFiber = fiber
  stateHookIndex = 0
  wipFiber.stateHooks = []
  wipFiber.effectHooks = []

  const children = [fiber.type(fiber.props)]
  reconcileChildren(fiber, children)
}

function updateHostComponent(fiber) {
  if(!fiber.dom){
    fiber.dom = createDom(fiber)
  }
  reconcileChildren(fiber, fiber.props.children)
}

function createDom(fiber) {
  const dom = 
    fiber.type == "TEXT_ELEMENT" 
      ? document.createTextNode("")
      : document.createElement(fiber.type)
    
    updateDom(dom, {}, fiber.props)

    return dom
}
