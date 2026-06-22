
import './App.css'
import {Button} from "./components/ui/button"
import { Input } from "@/components/ui/input"
function App() {

  return (
    <>
     <div>
       <h1>This is a helpdesk system.</h1> 
       <Input type="text" placeholder="Type here" />
       <Button >Primary</Button>
     </div>
    </>
  )
}

export default App
