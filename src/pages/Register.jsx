import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await axiosClient.post("/auth/register", {
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-brand-panel">
        <div className="auth-brand"><span className="brand-mark">M</span><span>MONETA</span></div>
        <div className="auth-brand-copy"><span className="eyebrow">A better beginning</span><h1>Make room for better money habits.</h1><p>Open your Moneta account and bring your everyday banking into focus.</p></div>
        <span className="auth-footer-note">Simple, secure, considered.</span>
      </section>
      <section className="auth-form-panel">
        <div className="auth-form-wrap">
          <span className="eyebrow">Create your account</span>
          <h2>Join Moneta</h2>
          <p className="page-subtitle">Start with your personal details.</p>
          <form onSubmit={handleSubmit} className="auth-form">
            <label className="field-label">Full name<input className="field-control" type="text" name="fullName" placeholder="Your full name" value={formData.fullName} onChange={handleChange} required /></label>
            <label className="field-label">Email address<input className="field-control" type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required /></label>
            <label className="field-label">Phone number<input className="field-control" type="tel" name="phone" placeholder="98XXXXXXXX" value={formData.phone} onChange={handleChange} required /></label>
            <label className="field-label">Password<input className="field-control" type="password" name="password" placeholder="Create a password" value={formData.password} onChange={handleChange} required /></label>
            <label className="field-label">Confirm password<input className="field-control" type="password" name="confirmPassword" placeholder="Repeat your password" value={formData.confirmPassword} onChange={handleChange} required /></label>
            {error && <p style={{ color: "#dc2626", fontSize: "14px" }}>{error}</p>}
            <button type="submit" className="button-primary auth-submit">Create account</button>
          </form>
          <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </section>
    </div>
  );
};

export default Register;