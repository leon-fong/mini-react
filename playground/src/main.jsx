import { createRoot } from "mini-react-dom";
import { useState } from "mini-react";

function Counter() {
  const [state, setState] = useState(1)
  return (
    <h1 onClick={() => setState(c => c + 1)}>
      Count: {state}
    </h1>
  )
}

createRoot(document.getElementById("app")).render(<Counter></Counter>)

