import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SendMoney from "./pages/SendMoney";
import Dashboard from "./pages/Dashboard";
import Payment from "./pages/Payment";

const EXCHANGE_API_KEY = "6a601022d9e152a07221ddc6";

function Home() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [rates, setRates] = useState({ MXAF: null, XMUR: null, MEUR: null });
  const [heroRate, setHeroRate] = useState(null);
  const [heroAmount, setHeroAmount] = useState(1000);
  const [ratesLoading, setRatesLoading] = useState(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setRatesLoading(true);
    Promise.all([
      fetch(`https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/pair/MUR/XAF`).then(r => r.json()),
      fetch(`https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/pair/XAF/MUR`).then(r => r.json()),
      fetch(`https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/pair/MUR/EUR`).then(r => r.json()),
    ]).then(([mxaf, xmur, meur]) => {
      setRates({
        MXAF: mxaf.conversion_rate?.toFixed(4),
        XMUR: xmur.conversion_rate?.toFixed(4),
        MEUR: meur.conversion_rate?.toFixed(4),
      });
      setHeroRate(mxaf.conversion_rate);
      setRatesLoading(false);
    }).catch(() => setRatesLoading(false));
  }, []);

  const heroReceived = heroRate ? Math.round(heroAmount * heroRate).toLocaleString() : "...";

  return (
    <div className="app">
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-logo">
          <span className="logo-icon">⇄</span>
          <span className="logo-text">Tao<strong>Exchange</strong></span>
        </div>
        <div className="nav-links">
          <a href="#how">Comment ça marche</a>
          <a href="#rates">Taux</a>
          <a href="#about">À propos</a>
        </div>
        <div className="nav-actions">
          <button className="btn-outline" onClick={() => navigate("/login")}>Connexion</button>
          <button className="btn-primary" onClick={() => navigate("/register")}>Commencer</button>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-bg">
          <div className="circle c1" />
          <div className="circle c2" />
          <div className="grid-lines" />
        </div>
        <div className="hero-content">
          <div className="badge">🇲🇺 Maurice &nbsp;↔&nbsp; Cameroun 🇨🇲</div>
          <h1>L'argent<br /><span className="gradient-text">sans frontières</span></h1>
          <p className="hero-sub">Envoyez de l'argent entre l'île Maurice et le Cameroun en quelques secondes. Sécurisé, rapide, au meilleur taux.</p>
          <div className="hero-actions">
            <button className="btn-primary btn-lg" onClick={() => navigate("/register")}>Envoyer de l'argent</button>
            <button className="btn-ghost btn-lg" onClick={() => document.getElementById("rates").scrollIntoView({ behavior: "smooth" })}>Voir les taux →</button>
          </div>
          <div className="hero-stats">
            <div className="stat"><span className="stat-num">2 min</span><span className="stat-label">Temps de transfert</span></div>
            <div className="stat-divider" />
            <div className="stat"><span className="stat-num">3.5%</span><span className="stat-label">Frais de service</span></div>
            <div className="stat-divider" />
            <div className="stat"><span className="stat-num">SSL</span><span className="stat-label">100% sécurisé</span></div>
          </div>
        </div>
        <div className="hero-card">
          <div className="card-inner">
            <div className="card-header">
              <span>Simuler un transfert</span>
              <span className="live-badge">● Live</span>
            </div>
            <div className="card-field">
              <label>Vous envoyez</label>
              <div className="input-row">
                <input type="number" value={heroAmount} onChange={(e) => setHeroAmount(e.target.value)} />
                <div className="currency-tag mur">MUR</div>
              </div>
            </div>
            <div className="card-arrow">⇅</div>
            <div className="card-field">
              <label>Le destinataire reçoit</label>
              <div className="input-row">
                <input type="text" value={ratesLoading ? "Chargement..." : heroReceived} readOnly />
                <div className="currency-tag xaf">XAF</div>
              </div>
            </div>
            <div className="card-rate">
              <span>Taux : 1 MUR = {ratesLoading ? "..." : parseFloat(rates.MXAF).toFixed(4)} XAF</span>
              <span className="rate-update">En direct</span>
            </div>
            <button className="btn-primary btn-full" onClick={() => navigate("/register")}>Envoyer maintenant →</button>
          </div>
        </div>
      </section>

      <section className="section" id="how">
        <div className="section-label">Processus</div>
        <h2>Simple comme bonjour</h2>
        <div className="steps">
          <div className="step"><div className="step-num">01</div><div className="step-icon">👤</div><h3>Créez votre compte</h3><p>Inscription en 2 minutes avec votre email et une pièce d'identité.</p></div>
          <div className="step-connector" />
          <div className="step"><div className="step-num">02</div><div className="step-icon">💸</div><h3>Saisissez le montant</h3><p>Entrez le montant à envoyer et les coordonnées du destinataire.</p></div>
          <div className="step-connector" />
          <div className="step"><div className="step-num">03</div><div className="step-icon">✅</div><h3>Le destinataire reçoit</h3><p>Virement bancaire ou mobile money (MTN, Orange) en quelques minutes.</p></div>
        </div>
      </section>

      <section className="section rates-section" id="rates">
        <div className="section-label">Taux de change</div>
        <h2>Transparence totale</h2>
        <div className="rates-grid">
          <div className="rate-card">
            <div className="rate-flag">🇲🇺 → 🇨🇲</div>
            <div className="rate-pair">MUR / XAF</div>
            <div className="rate-value">{ratesLoading ? "..." : rates.MXAF}</div>
            <div className="rate-change positive">↑ Taux en direct</div>
          </div>
          <div className="rate-card featured">
            <div className="rate-flag">🇨🇲 → 🇲🇺</div>
            <div className="rate-pair">XAF / MUR</div>
            <div className="rate-value">{ratesLoading ? "..." : rates.XMUR}</div>
            <div className="rate-change positive">↑ Taux en direct</div>
          </div>
          <div className="rate-card">
            <div className="rate-flag">🇲🇺 → 🌍</div>
            <div className="rate-pair">MUR / EUR</div>
            <div className="rate-value">{ratesLoading ? "..." : rates.MEUR}</div>
            <div className="rate-change positive">↑ Taux en direct</div>
          </div>
        </div>
        <p className="rates-note">* Les taux sont en temps réel via ExchangeRate-API.</p>
      </section>

      <section className="section features-section">
        <div className="section-label">Pourquoi Tao Exchange</div>
        <h2>Conçu pour vous</h2>
        <div className="features-grid">
          <div className="feature"><div className="feature-icon">🔒</div><h3>Sécurité maximale</h3><p>Chiffrement SSL, authentification à deux facteurs, conformité FSC Maurice.</p></div>
          <div className="feature"><div className="feature-icon">⚡</div><h3>Transfert instantané</h3><p>Votre argent arrive en moins de 2 minutes via mobile money ou virement.</p></div>
          <div className="feature"><div className="feature-icon">📱</div><h3>Mobile & Web</h3><p>Accessible depuis votre téléphone ou votre navigateur, 24h/24.</p></div>
          <div className="feature"><div className="feature-icon">💬</div><h3>Support bilingue</h3><p>Notre équipe répond en français et en anglais, 7j/7.</p></div>
          <div className="feature"><div className="feature-icon">📊</div><h3>Historique complet</h3><p>Consultez toutes vos transactions passées à tout moment.</p></div>
          <div className="feature"><div className="feature-icon">🏦</div><h3>Multi-réseaux</h3><p>MTN MoMo, Orange Money, MCB, et virements bancaires classiques.</p></div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-bg" />
        <h2>Prêt à envoyer ?</h2>
        <p>Rejoignez Tao Exchange et envoyez de l'argent en toute confiance.</p>
        <button className="btn-primary btn-lg" onClick={() => navigate("/register")}>Créer mon compte gratuitement</button>
        <p className="cta-note">Aucune carte requise · Inscription en 2 minutes</p>
      </section>

      <footer className="footer">
        <div className="footer-logo"><span className="logo-icon">⇄</span><span className="logo-text">Tao<strong>Exchange</strong></span></div>
        <p className="footer-sub">Une solution Tao & Co</p>
        <div className="footer-links">
          <a href="#terms">Conditions d'utilisation</a>
          <a href="#privacy">Confidentialité</a>
          <a href="#contact">Contact</a>
        </div>
        <p className="footer-copy">© 2026 Tao Exchange · Tous droits réservés</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/send-money" element={<SendMoney />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </Router>
  );
}

export default App;