import { Route, Routes } from "react-router-dom"
import ContactsTablePage from "./pages/ContactsTablePage"

function App() {

  return (
    <Routes>
      <Route index element={ <ContactsTablePage /> }/>
    </Routes>
  )
}

export default App
