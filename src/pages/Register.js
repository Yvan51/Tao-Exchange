import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Le nom complet est requis";
    if (!formData.email) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email invalide";
    if (!formData.phone) newErrors.phone = "Le numéro de téléphone est requis";
    if (!formData.country) newErrors.country = "Veuillez sélectionner un pays";
    if (!formData.password) newErrors.password = "Le mot de passe est requis";
    else if (formData.password.length < 8) newErrors.password = "Minimum 8 caractères";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Confirmez votre mot de passe";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    if (!formData.terms) newErrors.terms = "Vous devez accepter les conditions";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 2000);
  };

  const getPasswordStrength = () => {
    const p = formData.password;
    if (!p) return null;
    if (p.length < 6) return { label: "Faible", color: "#ef4444", width: "25%" };
    if (p.length < 8) return { label: "Moyen", color: "#f59e0b", width: "50%" };
    if (p.length < 12) return { label: "Fort", color: "#10b981", width: "75%" };
    return { label: "Très fort", color: "#059669", width: "100%" };
  };

  const strength = getPasswordStrength();

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-circle c1" />
        <div className="auth-circle c2" />
      </div>

      <div className="auth-logo" onClick={() => navigate("/")}>
        <span className="logo-icon">⇄</span>
        <span>Tao<strong>Exchange</strong></span>
      </div>

      <div className="auth-card register-card">
        <div className="auth-card-header">
          <h1>Créer un compte 🚀</h1>
          <p>Rejoignez Tao Exchange en quelques minutes</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Nom complet */}
          <div className={`form-group ${errors.fullName ? "has-error" : ""}`}>
            <label>Nom complet</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                type="text" name="fullName"
                placeholder="Jean Dupont"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            {errors.fullName && <span className="error-msg">{errors.fullName}</span>}
          </div>

          {/* Email */}
          <div className={`form-group ${errors.email ? "has-error" : ""}`}>
            <label>Adresse email</label>
            <div className="input-wrapper">
              <span className="input-icon">✉</span>
              <input
                type="email" name="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && <span className="error-msg">{errors.email}</span>}
          </div>

          {/* Téléphone + Pays sur la même ligne */}
          <div className="form-row">
            <div className={`form-group ${errors.phone ? "has-error" : ""}`}>
              <label>Téléphone</label>
              <div className="input-wrapper">
                <span className="input-icon">📱</span>
                <input
                  type="tel" name="phone"
                  placeholder="+230 5XX XXX XXX"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              {errors.phone && <span className="error-msg">{errors.phone}</span>}
            </div>

            <div className={`form-group ${errors.country ? "has-error" : ""}`}>
              <label>Pays</label>
              <div className="input-wrapper">
                <span className="input-icon">🌍</span>
                <select name="country" value={formData.country} onChange={handleChange}>
                  <option value="">Sélectionner</option>
                  <option value="MU">🇲🇺 Maurice</option>
                  <option value="CM">🇨🇲 Cameroun</option>
                </select>
              </div>
              {errors.country && <span className="error-msg">{errors.country}</span>}
            </div>
          </div>

          {/* Mot de passe */}
          <div className={`form-group ${errors.password ? "has-error" : ""}`}>
            <label>Mot de passe</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type="password" name="password"
                placeholder="Minimum 8 caractères"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            {strength && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div
                    className="strength-fill"
                    style={{ width: strength.width, background: strength.color }}
                  />
                </div>
                <span style={{ color: strength.color }}>{strength.label}</span>
              </div>
            )}
            {errors.password && <span className="error-msg">{errors.password}</span>}
          </div>

          {/* Confirmer mot de passe */}
          <div className={`form-group ${errors.confirmPassword ? "has-error" : ""}`}>
            <label>Confirmer le mot de passe</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type="password" name="confirmPassword"
                placeholder="Répétez votre mot de passe"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            {errors.confirmPassword && <span className="error-msg">{errors.confirmPassword}</span>}
          </div>

          {/* Conditions */}
          <div className={`form-group checkbox-group ${errors.terms ? "has-error" : ""}`}>
            <label className="checkbox-label">
              <input
                type="checkbox" name="terms"
                checked={formData.terms}
                onChange={handleChange}
              />
              <span>
                J'accepte les{" "}
                <a href="#terms">conditions d'utilisation</a>{" "}
                et la{" "}
                <a href="#privacy">politique de confidentialité</a>
              </span>
            </label>
            {errors.terms && <span className="error-msg">{errors.terms}</span>}
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "⏳ Création en cours..." : "Créer mon compte →"}
          </button>
        </form>

        <p className="auth-switch" style={{ marginTop: "24px" }}>
          Déjà un compte ?{" "}
          <Link to="/login">Se connecter</Link>
        </p>
      </div>

      <p className="auth-security">🔒 Vos données sont protégées · SSL · RGPD</p>
    </div>
  );
}

export default Register;