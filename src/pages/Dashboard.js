import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

// Données de démonstration
const MOCK_TRANSACTIONS = [
  { id: "TXN8K2A1", date: "28 Avr 2026", from: "MUR", to: "XAF", amountSent: 5000, amountReceived: 59714, receiver: "Paul Mbarga", method: "MTN Mobile Money", status: "completed" },
  { id: "TXN7B3C2", date: "25 Avr 2026", from: "MUR", to: "XAF", amountSent: 10000, amountReceived: 119429, receiver: "Marie Ekwala", method: "Orange Money", status: "completed" },
  { id: "TXN6D4E3", date: "20 Avr 2026", from: "XAF", to: "MUR", amountSent: 50000, amountReceived: 420, receiver: "Jean Dupont", method: "Virement bancaire", status: "pending" },
  { id: "TXN5F5G4", date: "15 Avr 2026", from: "MUR", to: "XAF", amountSent: 2000, amountReceived: 23885, receiver: "Alice Nkomo", method: "MTN Mobile Money", status: "completed" },
  { id: "TXN4H6I5", date: "10 Avr 2026", from: "MUR", to: "XAF", amountSent: 15000, amountReceived: 179143, receiver: "Robert Foe", method: "Orange Money", status: "failed" },
];

const STATUS_CONFIG = {
  completed: { label: "Complété", color: "#10b981", bg: "#ecfdf5", icon: "✓" },
  pending:   { label: "En cours", color: "#f59e0b", bg: "#fffbeb", icon: "⏳" },
  failed:    { label: "Échoué",   color: "#ef4444", bg: "#fef2f2", icon: "✗" },
};

function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const totalSent = MOCK_TRANSACTIONS.filter(t => t.status === "completed").reduce((acc, t) => acc + t.amountSent, 0);
  const totalTransactions = MOCK_TRANSACTIONS.length;
  const completedCount = MOCK_TRANSACTIONS.filter(t => t.status === "completed").length;

  const filtered = MOCK_TRANSACTIONS.filter(t => {
    const matchTab = activeTab === "all" || t.status === activeTab;
    const matchSearch = t.receiver.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="dashboard-layout">

      {/* ── SIDEBAR ── */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-logo" onClick={() => navigate("/")}>
          <span>⇄</span> Tao<strong>Exchange</strong>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-item active">
            <span className="nav-icon">📊</span>
            <span>Tableau de bord</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/send-money")}>
            <span className="nav-icon">💸</span>
            <span>Envoyer de l'argent</span>
          </div>
          <div className="nav-item">
            <span className="nav-icon">📋</span>
            <span>Historique</span>
          </div>
          <div className="nav-item">
            <span className="nav-icon">👤</span>
            <span>Mon profil</span>
          </div>
          <div className="nav-item">
            <span className="nav-icon">🔔</span>
            <span>Notifications</span>
            <span className="nav-badge">3</span>
          </div>
          <div className="nav-item">
            <span className="nav-icon">⚙️</span>
            <span>Paramètres</span>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">C</div>
            <div className="user-info">
              <span className="user-name">Charles Ngaleu</span>
              <span className="user-country">🇲🇺 Maurice</span>
            </div>
          </div>
          <button className="btn-logout" onClick={() => navigate("/login")}>
            Déconnexion →
          </button>
        </div>
      </aside>

      {/* ── CONTENU PRINCIPAL ── */}
      <main className="dashboard-main">

        {/* TOPBAR */}
        <div className="topbar">
          <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <div className="topbar-title">
            <h1>Bonjour Charles 👋</h1>
            <p>Voici un résumé de votre activité</p>
          </div>
          <button className="btn-send-quick" onClick={() => navigate("/send-money")}>
            + Nouveau transfert
          </button>
        </div>

        {/* CARTES DE STATISTIQUES */}
        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-card-icon">💸</div>
            <div className="stat-card-info">
              <span className="stat-card-label">Total envoyé ce mois</span>
              <span className="stat-card-value">{totalSent.toLocaleString()} MUR</span>
              <span className="stat-card-sub">↑ +12% vs mois dernier</span>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-card-icon">✅</div>
            <div className="stat-card-info">
              <span className="stat-card-label">Transferts complétés</span>
              <span className="stat-card-value">{completedCount} / {totalTransactions}</span>
              <span className="stat-card-sub">Taux de succès : {Math.round((completedCount/totalTransactions)*100)}%</span>
            </div>
          </div>
          <div className="stat-card amber">
            <div className="stat-card-icon">⏳</div>
            <div className="stat-card-info">
              <span className="stat-card-label">En attente</span>
              <span className="stat-card-value">{MOCK_TRANSACTIONS.filter(t => t.status === "pending").length}</span>
              <span className="stat-card-sub">Traitement sous 2 min</span>
            </div>
          </div>
          <div className="stat-card purple">
            <div className="stat-card-icon">📈</div>
            <div className="stat-card-info">
              <span className="stat-card-label">Taux actuel</span>
              <span className="stat-card-value">11.94 XAF</span>
              <span className="stat-card-sub">pour 1 MUR · Mis à jour</span>
            </div>
          </div>
        </div>

        {/* BOUTON RAPIDE */}
        <div className="quick-send-banner">
          <div className="quick-send-text">
            <span className="quick-icon">🚀</span>
            <div>
              <strong>Envoyer de l'argent rapidement</strong>
              <p>Transfert vers le Cameroun en moins de 2 minutes</p>
            </div>
          </div>
          <button className="btn-primary-dash" onClick={() => navigate("/send-money")}>
            Envoyer maintenant →
          </button>
        </div>

        {/* HISTORIQUE */}
        <div className="history-section">
          <div className="history-header">
            <h2>Historique des transferts</h2>
            <div className="history-controls">
              <input
                type="text"
                placeholder="🔍 Rechercher..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* ONGLETS */}
          <div className="tabs">
            {[
              { key: "all", label: "Tous", count: MOCK_TRANSACTIONS.length },
              { key: "completed", label: "Complétés", count: MOCK_TRANSACTIONS.filter(t => t.status === "completed").length },
              { key: "pending", label: "En cours", count: MOCK_TRANSACTIONS.filter(t => t.status === "pending").length },
              { key: "failed", label: "Échoués", count: MOCK_TRANSACTIONS.filter(t => t.status === "failed").length },
            ].map(tab => (
              <button
                key={tab.key}
                className={`tab-btn ${activeTab === tab.key ? "active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
                <span className="tab-count">{tab.count}</span>
              </button>
            ))}
          </div>

          {/* LISTE DES TRANSACTIONS */}
          <div className="transactions-list">
            {filtered.length === 0 ? (
              <div className="empty-state">
                <span>📭</span>
                <p>Aucune transaction trouvée</p>
              </div>
            ) : (
              filtered.map(tx => {
                const status = STATUS_CONFIG[tx.status];
                return (
                  <div className="transaction-row" key={tx.id}>
                    <div className="tx-icon">
                      {tx.from === "MUR" ? "🇲🇺" : "🇨🇲"}
                    </div>
                    <div className="tx-main">
                      <div className="tx-top">
                        <span className="tx-receiver">{tx.receiver}</span>
                        <span className="tx-amount-sent">-{tx.amountSent.toLocaleString()} {tx.from}</span>
                      </div>
                      <div className="tx-bottom">
                        <span className="tx-meta">{tx.method} · {tx.date}</span>
                        <span className="tx-amount-received">+{tx.amountReceived.toLocaleString()} {tx.to}</span>
                      </div>
                    </div>
                    <div className="tx-right">
                      <span
                        className="tx-status"
                        style={{ color: status.color, background: status.bg }}
                      >
                        {status.icon} {status.label}
                      </span>
                      <span className="tx-ref">{tx.id}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;