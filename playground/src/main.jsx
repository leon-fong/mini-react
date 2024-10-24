import * as MiniReact from "mini-react"
import { createRoot } from "mini-react-dom";

const Content =  (
<div title='id'>
<h1>Hello</h1>
<br />
</div>
)
// console.log(<Content />)

console.log(JSON.stringify(<Content />, null, 2))

createRoot(document.getElementById("app")).render(Content)
