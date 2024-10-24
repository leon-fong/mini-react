// import * as MiniReact from "mini-react"
import { createRoot } from "mini-react-dom";

const content = <div>
    <a href="xxx">link</a>
</div>

console.log(JSON.stringify(content, null, 2))

createRoot(document.getElementById("app")).render(content)
