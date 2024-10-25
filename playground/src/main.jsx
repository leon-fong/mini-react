import * as MiniReact from "mini-react"
import { createRoot } from "mini-react-dom";

function App(props) {
  return <h1>Hi {props.name}</h1>
}

createRoot(document.getElementById("app")).render(<App name="MiniReact" />)

