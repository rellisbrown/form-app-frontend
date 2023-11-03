import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import CreateForm from "./pages/CreateForm";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/create" element={<CreateForm />} />
      </Routes>
    </>
  );
}

export default App;
