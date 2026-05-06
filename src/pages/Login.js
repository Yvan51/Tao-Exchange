import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email invalide";
    if (!formData.password) newErrors.password = "Le mot de passe est requis";
    else if (formData.password.length < 6) newErrors.password = "Minimum 6 caractères";
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    // Simulation connexion (on connectera Firebase plus tard)
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="auth-page">
      {/* Fond décoratif */}
      <div className="auth-bg">
        <div className="auth-circle c1" />
        <div className="auth-circle c2" />
      </div>

      {/* Logo */}
      <div className="auth-logo" onClick={() => navigate("/")}>
        <span className="logo-icon">⇄</span>
        <span>Tao<strong>Exchange</strong></span>
      </div>

      {/* Carte de connexion */}
      <div className="auth-card">
        <div className="auth-card-header">
          <h1>Bon retour 👋</h1>
          <p>Connectez-vous à votre compte Tao Exchange</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Email */}
          <div className={`form-group ${errors.email ? "has-error" : ""}`}>
            <label>Adresse email</label>
            <div className="input-wrapper">
              <span className="input-icon">✉</span>
              <input
                type="email"
                name="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && <span className="error-msg">{errors.email}</span>}
          </div>

          {/* Mot de passe */}
          <div className={`form-group ${errors.password ? "has-error" : ""}`}>
            <div className="label-row">
              <label>Mot de passe</label>
              <a href="#forgot" className="forgot-link">Mot de passe oublié ?</a>
            </div>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            {errors.password && <span className="error-msg">{errors.password}</span>}
          </div>

          {/* Bouton */}
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? (
              <span className="spinner">⏳ Connexion en cours...</span>
            ) : (
              "Se connecter →"
            )}
          </button>
        </form>

        {/* Séparateur */}
        <div className="auth-divider">
          <span />
          <p>ou</p>
          <span />
        </div>

        {/* Lien inscription */}
        <p className="auth-switch">
          Pas encore de compte ?{" "}
          <Link to="/register">Créer un compte gratuitement</Link>
        </p>
      </div>

      {/* Sécurité */}
      <p className="auth-security">🔒 Connexion 100% sécurisée · SSL</p>
    </div>
  );
}

export default Login;