import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axiosClient.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("fullName", res.data.user.full_name);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-brand-panel">
        <div className="auth-brand"><span className="brand-mark">M</span><span>MONETA</span></div>
        <div className="auth-brand-copy"><span className="eyebrow">Personal banking</span><h1>Banking, thoughtfully designed.</h1><p>A calmer way to stay close to your money, every day.</p></div>
        <span className="auth-footer-note">Secure access to your financial life.</span>
      </section>
      <section className="auth-form-panel">
        <div className="auth-form-wrap">
          <span className="eyebrow">Welcome back</span>
          <h2>Sign in to Moneta</h2>
          <p className="page-subtitle">Use your account details to continue.</p>
          <form onSubmit={handleSubmit} className="auth-form">
            <label className="field-label">Email address<input className="field-control" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required /></label>
            <label className="field-label">Password<input className="field-control" type="password" name="password" placeholder="Enter your password" value={form.password} onChange={handleChange} required /></label>
            <button type="submit" className="button-primary auth-submit">Sign in</button>
          </form>
          {error && <p className="feedback-error">{error}</p>}
          <p className="auth-switch">New to Moneta? <Link to="/register">Create an account</Link></p>
        </div>
      </section>
    </div>
  );
}

export default Login;