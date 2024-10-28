import { createRoot } from "mini-react-dom";
import { useState, useEffect } from "mini-react";

// function Counter() {
//   const [state, setState] = useState(1)
//   return (
//     <h1 onClick={() => setState(c => c + 1)}>
//       Count: {state}
//     </h1>
//   )
// }
function Counter() {

  const [count, setCount] = useState(3)

  useEffect(() => {
    const timer = setInterval(() => {
        setCount((c)=> c + 1)
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return <div>
    <p>{count}</p>
  </div>;
}

function App() {
  return <Counter ></Counter>
}

createRoot(document.getElementById("app"))
.render(
  <App />
  )

