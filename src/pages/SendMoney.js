import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SendMoney.css";

function SendMoney() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // Étape 1: montant, Étape 2: destinataire, Étape 3: confirmation
  const [loading, setLoading] = useState(false);
  const [rateLoading, setRateLoading] = useState(false);

  const [fromCurrency, setFromCurrency] = useState("MUR");
  const [toCurrency, setToCurrency] = useState("XAF");
  const [amountSent, setAmountSent] = useState(1000);
  const [amountReceived, setAmountReceived] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [rateError, setRateError] = useState(false);

  const [receiver, setReceiver] = useState({
    name: "",
    phone: "",
    method: "",
    bank: "",
  });
  const [errors, setErrors] = useState({});
  const [transactionDone, setTransactionDone] = useState(false);

  const FEE_PERCENT = 1.5; // frais de 1.5%
  const fee = ((amountSent * FEE_PERCENT) / 100).toFixed(2);
  const totalToPay = (parseFloat(amountSent) + parseFloat(fee)).toFixed(2);


  const currencies = [
    { code: "MUR", flag: "🇲🇺", name: "Roupie mauricienne" },
    { code: "XAF", flag: "🇨🇲", name: "Franc CFA" },
    { code: "EUR", flag: "🇪🇺", name: "Euro" },
  ];

  const methods = [
    { id: "mtn", label: "MTN Mobile Money", icon: "📱", available: toCurrency === "XAF" },
    { id: "orange", label: "Orange Money", icon: "🟠", available: toCurrency === "XAF" },
    { id: "bank", label: "Virement bancaire", icon: "🏦", available: true },
    { id: "mcb", label: "MCB Juice", icon: "💳", available: toCurrency === "MUR" },
  ];

  // Calcul du taux de change
  useEffect(() => {
  setRateLoading(true);
  setRateError(false);

  fetch(`https://v6.exchangerate-api.com/v6/6a601022d9e152a07221ddc6/pair/${fromCurrency}/${toCurrency}`)
    .then(res => res.json())
    .then(data => {
      if (data.result === "success") {
        const rate = data.conversion_rate;
        setExchangeRate(rate);
        setAmountReceived((amountSent * rate).toFixed(0));
      } else {
        setRateError(true);
      }
      setRateLoading(false);
    })
    .catch(() => {
      setRateError(true);
      setRateLoading(false);
    });

}, [fromCurrency, toCurrency, amountSent]);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!amountSent || amountSent <= 0) newErrors.amount = "Entrez un montant valide";
    if (amountSent < 100) newErrors.amount = "Montant minimum : 100 " + fromCurrency;
    if (amountSent > 50000) newErrors.amount = "Montant maximum : 50 000 " + fromCurrency;
    if (fromCurrency === toCurrency) newErrors.currency = "Les devises doivent être différentes";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!receiver.name) newErrors.name = "Le nom du destinataire est requis";
    if (!receiver.phone) newErrors.phone = "Le numéro de téléphone est requis";
    if (!receiver.method) newErrors.method = "Choisissez un mode de réception";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setTransactionDone(true);
    }, 2500);
  };

  const refCode = "TXN" + Math.random().toString(36).substring(2, 8).toUpperCase();

  // ─── SUCCÈS ───────────────────────────────────────────────────
  if (transactionDone) {
    return (
      <div className="send-page">
        <div className="send-navbar">
          <div className="nav-logo" onClick={() => navigate("/")}>
            <span>⇄</span> Tao<strong>Exchange</strong>
          </div>
        </div>
        <div className="success-card">
          <div className="success-icon">✅</div>
          <h2>Transfert envoyé !</h2>
          <p>Votre transfert a été initié avec succès.</p>
          <div className="success-details">
            <div className="detail-row"><span>Référence</span><strong>{refCode}</strong></div>
            <div className="detail-row"><span>Montant envoyé</span><strong>{amountSent} {fromCurrency}</strong></div>
            <div className="detail-row"><span>Montant reçu</span><strong>{amountReceived} {toCurrency}</strong></div>
            <div className="detail-row"><span>Destinataire</span><strong>{receiver.name}</strong></div>
            <div className="detail-row"><span>Mode</span><strong>{methods.find(m => m.id === receiver.method)?.label}</strong></div>
            <div className="detail-row"><span>Statut</span><strong className="status-badge">⏳ En cours</strong></div>
          </div>
          <button className="btn-primary-send" onClick={() => navigate("/dashboard")}>
            Voir mon tableau de bord →
          </button>
          <button className="btn-ghost-send" onClick={() => { setTransactionDone(false); setStep(1); }}>
            Nouveau transfert
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="send-page">
      {/* NAVBAR */}
      <div className="send-navbar">
        <div className="nav-logo" onClick={() => navigate("/")}>
          <span>⇄</span> Tao<strong>Exchange</strong>
        </div>
        <button className="btn-back" onClick={() => step > 1 ? setStep(step - 1) : navigate("/dashboard")}>
          ← Retour
        </button>
      </div>

      <div className="send-container">
        {/* BARRE DE PROGRESSION */}
        <div className="progress-bar">
          {["Montant", "Destinataire", "Confirmation"].map((label, i) => (
            <React.Fragment key={i}>
              <div className={`progress-step ${step > i ? "done" : ""} ${step === i + 1 ? "active" : ""}`}>
                <div className="step-circle">{step > i + 1 ? "✓" : i + 1}</div>
                <span>{label}</span>
              </div>
              {i < 2 && <div className={`progress-line ${step > i + 1 ? "done" : ""}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* ─── ÉTAPE 1 : MONTANT ─── */}
        {step === 1 && (
          <div className="step-card">
            <h2>Combien voulez-vous envoyer ?</h2>
            <p className="step-sub">Entrez le montant et choisissez les devises</p>

            {/* Devise source */}
            <div className="currency-section">
              <label>Vous envoyez</label>
              <div className={`currency-input-row ${errors.amount ? "has-error" : ""}`}>
                <input
                  type="number"
                  value={amountSent}
                  onChange={(e) => setAmountSent(e.target.value)}
                  placeholder="0"
                />
                <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
                  {currencies.map(c => (
                    <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                  ))}
                </select>
              </div>
              {errors.amount && <span className="error-msg">⚠ {errors.amount}</span>}
              {errors.currency && <span className="error-msg">⚠ {errors.currency}</span>}
            </div>

            {/* Bouton swap */}
            <button className="swap-btn" onClick={handleSwapCurrencies} title="Inverser les devises">
              ⇅
            </button>

            {/* Devise destination */}
            <div className="currency-section">
              <label>Le destinataire reçoit</label>
              <div className="currency-input-row received">
                <input
                  type="text"
                  value={rateLoading ? "Calcul..." : amountReceived}
                  readOnly
                  placeholder="0"
                />
                <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
                  {currencies.map(c => (
                    <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Taux et frais */}
            <div className="rate-box">
              <div className="rate-row">
                <span>Taux de change</span>
                <strong>
                  {rateLoading ? "⏳ Chargement..." : rateError ? "Indisponible" : `1 ${fromCurrency} = ${exchangeRate} ${toCurrency}`}
                </strong>
              </div>
              <div className="rate-row">
                <span>Frais de service (1.5%)</span>
                <strong>{fee} {fromCurrency}</strong>
              </div>
              <div className="rate-row total">
                <span>Total à payer</span>
                <strong>{totalToPay} {fromCurrency}</strong>
              </div>
            </div>

            {/* Limites */}
            <div className="limits-box">
              <span>💡 Min : 100 {fromCurrency} &nbsp;·&nbsp; Max : 50 000 {fromCurrency} par transaction</span>
            </div>

            <button className="btn-primary-send" onClick={handleNext}>
              Continuer → Destinataire
            </button>
          </div>
        )}

        {/* ─── ÉTAPE 2 : DESTINATAIRE ─── */}
        {step === 2 && (
          <div className="step-card">
            <h2>Qui reçoit l'argent ?</h2>
            <p className="step-sub">Renseignez les coordonnées du destinataire</p>

            <div className="form-group">
              <label>Nom complet du destinataire</label>
              <div className={`input-wrap ${errors.name ? "has-error" : ""}`}>
                <span>👤</span>
                <input
                  type="text"
                  placeholder="Jean Dupont"
                  value={receiver.name}
                  onChange={(e) => { setReceiver({ ...receiver, name: e.target.value }); setErrors({ ...errors, name: "" }); }}
                />
              </div>
              {errors.name && <span className="error-msg">⚠ {errors.name}</span>}
            </div>

            <div className="form-group">
              <label>Numéro de téléphone</label>
              <div className={`input-wrap ${errors.phone ? "has-error" : ""}`}>
                <span>📱</span>
                <input
                  type="tel"
                  placeholder="+237 6XX XXX XXX"
                  value={receiver.phone}
                  onChange={(e) => { setReceiver({ ...receiver, phone: e.target.value }); setErrors({ ...errors, phone: "" }); }}
                />
              </div>
              {errors.phone && <span className="error-msg">⚠ {errors.phone}</span>}
            </div>

            <div className="form-group">
              <label>Mode de réception</label>
              <div className={`methods-grid ${errors.method ? "has-error" : ""}`}>
                {methods.filter(m => m.available).map(m => (
                  <div
                    key={m.id}
                    className={`method-card ${receiver.method === m.id ? "selected" : ""}`}
                    onClick={() => { setReceiver({ ...receiver, method: m.id }); setErrors({ ...errors, method: "" }); }}
                  >
                    <span className="method-icon">{m.icon}</span>
                    <span className="method-label">{m.label}</span>
                    {receiver.method === m.id && <span className="method-check">✓</span>}
                  </div>
                ))}
              </div>
              {errors.method && <span className="error-msg">⚠ {errors.method}</span>}
            </div>

            {receiver.method === "bank" && (
              <div className="form-group">
                <label>Nom de la banque</label>
                <div className="input-wrap">
                  <span>🏦</span>
                  <input
                    type="text"
                    placeholder="Ex: Afriland First Bank"
                    value={receiver.bank}
                    onChange={(e) => setReceiver({ ...receiver, bank: e.target.value })}
                  />
                </div>
              </div>
            )}

            <button className="btn-primary-send" onClick={handleNext}>
              Continuer → Confirmation
            </button>
          </div>
        )}

        {/* ─── ÉTAPE 3 : CONFIRMATION ─── */}
        {step === 3 && (
          <div className="step-card">
            <h2>Vérifiez votre transfert</h2>
            <p className="step-sub">Confirmez les détails avant d'envoyer</p>

            <div className="confirm-box">
              <div className="confirm-section">
                <div className="confirm-label">💸 Transfert</div>
                <div className="confirm-row"><span>Vous envoyez</span><strong>{amountSent} {fromCurrency}</strong></div>
                <div className="confirm-row"><span>Le destinataire reçoit</span><strong>{amountReceived} {toCurrency}</strong></div>
                <div className="confirm-row"><span>Taux appliqué</span><strong>1 {fromCurrency} = {exchangeRate} {toCurrency}</strong></div>
                <div className="confirm-row"><span>Frais (1.5%)</span><strong>{fee} {fromCurrency}</strong></div>
                <div className="confirm-row total"><span>Total débité</span><strong>{totalToPay} {fromCurrency}</strong></div>
              </div>

              <div className="confirm-section">
                <div className="confirm-label">👤 Destinataire</div>
                <div className="confirm-row"><span>Nom</span><strong>{receiver.name}</strong></div>
                <div className="confirm-row"><span>Téléphone</span><strong>{receiver.phone}</strong></div>
                <div className="confirm-row"><span>Mode</span><strong>{methods.find(m => m.id === receiver.method)?.label}</strong></div>
                {receiver.bank && <div className="confirm-row"><span>Banque</span><strong>{receiver.bank}</strong></div>}
              </div>
            </div>

            <div className="security-note">
              🔒 Ce transfert est sécurisé et chiffré SSL. Vous recevrez une confirmation par email et SMS.
            </div>

            <button className="btn-primary-send btn-confirm" onClick={handleConfirm} disabled={loading}>
              {loading ? "⏳ Traitement en cours..." : "✅ Confirmer et envoyer"}
            </button>

            <button className="btn-ghost-send" onClick={() => setStep(2)}>
              ← Modifier les détails
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SendMoney;