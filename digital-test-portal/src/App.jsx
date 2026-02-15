import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoleSelect from "./components/RoleSelect";
import StudentLogin from "./components/StudentLogin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleSelect />} />
        <Route path="/student-login" element={<StudentLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;