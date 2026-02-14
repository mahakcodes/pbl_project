import "./StudentLogin.css";

function StudentLogin() {
  return (
    <div className="sl-page">
      <div className="sl-panel">

        <div className="sl-header">
          <span className="sl-logo">📘</span>
          <span className="sl-title">Digital Test and Evaluation Portal</span>
        </div>

        <h3 className="sl-subtitle">Student Login</h3>

        <input type="text" placeholder="Email or Roll Number" />
        <input type="password" placeholder="Password" />

        <p className="forgot">Forgot Password?</p>

        <button className="login-btn">Login</button>
      </div>
    </div>
  );
}

export default StudentLogin;