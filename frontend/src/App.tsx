import { Route, Routes } from "react-router-dom";
import ContactsTablePage from "./pages/ContactsTablePage";
import ContactCardPage from "./pages/ContactCardPage";
import ContactFormPage from "./pages/ContactFormPage";

function App() {
  return (
    <Routes>
      <Route index element={<ContactsTablePage />} />
      <Route path="/contact/:id" element={<ContactCardPage />}>
        <Route path="/contact/:id/edit" element={<ContactFormPage />} />
      </Route>
    </Routes>
  );
}

export default App;
