import { useNavigate } from "react-router-dom";
import "./RoleSelect.css";

function RoleSelect() {
  const navigate = useNavigate();

  return (
    <div className="rs-page">
      <div className="rs-panel">

        <div className="rs-topbar">
          <span className="rs-logo">📘</span>
          <span className="rs-title">Digital Test and Evaluation Portal</span>
        </div>

        <h2 className="rs-subtitle">How would you like to login?</h2>

        <div className="rs-cards">
          <div className="rs-card">
            <div className="rs-icon">🎓</div>
            <h2>Student Login</h2>
            <p>Login as a student to access your tests.</p>
            <button
              className="btn-primary"
              onClick={() => navigate("/student-login")}
            >
              Student Login
            </button>
          </div>

          <div className="rs-card">
            <div className="rs-icon">👨‍🏫</div>
            <h2>Staff Login</h2>
            <p>Login as a teacher or staff member.</p>
            <button className="btn-dark">Staff Login</button>
          </div>

          <div className="rs-card">
            <div className="rs-icon">⚙️</div>
            <h2>Admin Login</h2>
            <p>Login as an admin to manage the portal.</p>
            <button className="btn-dark">Admin Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoleSelect;