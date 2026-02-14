import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RoleSelect from "./components/RoleSelect";
import StudentLogin from "./components/StudentLogin";

const basename =
  import.meta.env.MODE === "production" ? "/pbl_project" : "/";

function App() {
  return (
    <Router basename={basename}>
      <Routes>
        <Route path="/" element={<RoleSelect />} />
        <Route path="/student-login" element={<StudentLogin />} />
      </Routes>
    </Router>
  );
}

export default App;