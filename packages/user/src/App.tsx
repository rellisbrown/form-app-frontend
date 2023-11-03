import { Routes, Route } from "react-router-dom";
import UserDashboard from "./pages/UserDashboard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<UserDashboard />} />
      </Routes>
    </>
  );
}

export default App;
