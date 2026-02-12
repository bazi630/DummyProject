import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/Auth.css";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    let err = {};
    if (!form.name.trim()) err.name = "Name required";
    if (!form.email.trim()) err.email = "Email required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) err.email = "Invalid email";
    if (form.password.length < 6) err.password = "Min 6 chars";
    if (form.password !== form.confirmPassword) err.confirmPassword = "Don't match";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  setIsLoading(true);
  await new Promise(resolve => setTimeout(resolve, 600));

  // Get existing users or empty array
  const users = JSON.parse(localStorage.getItem("users")) || [];

  // Check if email already exists
  if (users.find(u => u.email === form.email)) {
    setErrors({ email: "Email already registered" });
    setIsLoading(false);
    return;
  }

  // Save new user
  users.push(form);
  localStorage.setItem("users", JSON.stringify(users));

  navigate("/login");
  setIsLoading(false);
};


  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="brand">
          <div className="brand-icon">✦</div>
        </div>
        
        <h2>Get started</h2>
        <p className="subtitle">Create your free account</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                type="text"
                placeholder="Full name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>
            {errors.name && <div className="error">{errors.name}</div>}
          </div>

          <div className="form-group">
            <div className="input-wrapper">
              <span className="input-icon">✉️</span>
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>
            {errors.email && <div className="error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <div className="input-wrapper password-box">
              <span className="input-icon">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
              <button type="button" className="toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && <div className="error">{errors.password}</div>}
          </div>

          <div className="form-group">
            <div className="input-wrapper">
              <span className="input-icon">🔐</span>
              <input
                type="password"
                placeholder="Confirm"
                value={form.confirmPassword}
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
              />
            </div>
            {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}
          </div>

          <button type="submit" disabled={isLoading} style={{ marginTop: 4 }}>
            {isLoading ? <span className="spinner"></span> : "Sign Up"}
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
          Have an account?<Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
