import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/Auth.css";

const Login = () => {

  const navigate = useNavigate(); 
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");

  await new Promise(resolve => setTimeout(resolve, 600));

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const matchedUser = users.find(
    u => u.email === form.email && u.password === form.password
  );

  if (!matchedUser) {
    setError("Invalid email or password");
    setIsLoading(false);
    return;
  }

  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("currentUser", JSON.stringify(matchedUser));

  const online = JSON.parse(localStorage.getItem("onlineUsers")) || {};
  online[matchedUser.email] = true;
  localStorage.setItem("onlineUsers", JSON.stringify(online));

  navigate("/chat", { replace: true });
};

 

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="brand">
          <div className="brand-icon">✦</div>
        </div>
        
        <h2>Seanergy </h2>
        <h2>Welcome back</h2>
        <p className="subtitle">Sign in to your account</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-wrapper">
              <span className="input-icon">✉️</span>
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-wrapper password-box">
              <span className="input-icon">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
              <button 
                type="button"
                className="toggle" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div className="options">
            <label className="remember">
              <input 
                type="checkbox" 
                checked={form.remember}
                onChange={e => setForm({ ...form, remember: e.target.checked })}
              />
              <span>Remember me</span>
            </label>
            <Link to="/forgot" className="forgot">Forgot?</Link>
          </div>

          {error && <div className="error">{error}</div>}
          
          <button type="submit" disabled={isLoading}>
            {isLoading ? <span className="spinner"></span> : "Sign In"}
          </button>
        </form>

        <div className="divider">
          <span>Or</span>
        </div>

        <div className="social-login">
          <button type="button" className="social-btn">🐙</button>
          <button type="button" className="social-btn">🚀</button>
          <button type="button" className="social-btn">💼</button>
        </div>

        <p className="footer-text">
          New here?<Link to="/register">Create account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
