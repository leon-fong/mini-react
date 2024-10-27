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

function AutoCounter() {
  const [count,setCount] = useState(5)
  
  useEffect(() => {
    const timer = setInterval(() => {
        setCount((count)=>  count + 1) // FIXME: not working
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

   return (<h1>{count}</h1>)
}

createRoot(document.getElementById("app"))
.render(
  <AutoCounter />
  )

