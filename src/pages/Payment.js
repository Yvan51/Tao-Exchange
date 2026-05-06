import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import "./Payment.css";

// ⚠️ Remplace par ta vraie clé publique Flutterwave
const FLW_PUBLIC_KEY = "FLWPUBK_TEST-1432d20d3de724bb67078a20c3fae3e5-X";

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentDone, setPaymentDone] = useState(false);
  const [paymentRef, setPaymentRef] = useState("");

  // Récupérer les données du transfert depuis la page précédente
  // Si on arrive directement, on utilise des valeurs de démonstration
  const transfer = location.state || {
    amountSent: 1000,
    fromCurrency: "MUR",
    amountReceived: 11943,
    toCurrency: "XAF",
    fee: 15,
    totalToPay: 1015,
    receiverName: "Destinataire Test",
    receiverPhone: "+2376XXXXXXXX",
    method: "MTN Mobile Money",
    exchangeRate: 11.9429,
  };

  // Configuration Flutterwave
  const config = {
    public_key: FLW_PUBLIC_KEY,
    tx_ref: "TAO-" + Date.now(),
    amount: transfer.totalToPay,
    currency: "MUR",
    payment_options: "card, mobilemoney, ussd",
    customer: {
      email: "client@taoexchange.com",
      phonenumber: "+23057000000",
      name: "Charles Ngaleu",
    },
    customizations: {
      title: "Tao Exchange",
      description: `Transfert ${transfer.fromCurrency} → ${transfer.toCurrency}`,
      logo: "https://i.imgur.com/placeholder.png",
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  const handlePay = () => {
    handleFlutterPayment({
      callback: (response) => {
        closePaymentModal();
        if (response.status === "successful") {
          setPaymentRef(response.transaction_id || response.tx_ref);
          setPaymentDone(true);
        } else {
          alert("Le paiement a échoué. Veuillez réessayer.");
        }
      },
      onClose: () => {
        console.log("Modal fermée");
      },
    });
  };

  // ─── PAGE DE SUCCÈS ───────────────────────────────────────────
  if (paymentDone) {
    return (
      <div className="payment-page">
        <div className="payment-navbar">
          <div className="nav-logo" onClick={() => navigate("/")}>
            <span>⇄</span> Tao<strong>Exchange</strong>
          </div>
        </div>
        <div className="success-card">
          <div className="success-icon">🎉</div>
          <h2>Paiement réussi !</h2>
          <p>Votre transfert est en cours de traitement.</p>
          <div className="success-details">
            <div className="detail-row">
              <span>Référence paiement</span>
              <strong>#{paymentRef}</strong>
            </div>
            <div className="detail-row">
              <span>Montant débité</span>
              <strong>{transfer.totalToPay} {transfer.fromCurrency}</strong>
            </div>
            <div className="detail-row">
              <span>Montant envoyé</span>
              <strong>{transfer.amountReceived.toLocaleString()} {transfer.toCurrency}</strong>
            </div>
            <div className="detail-row">
              <span>Destinataire</span>
              <strong>{transfer.receiverName}</strong>
            </div>
            <div className="detail-row">
              <span>Mode</span>
              <strong>{transfer.method}</strong>
            </div>
            <div className="detail-row">
              <span>Statut</span>
              <strong className="status-success">✓ Confirmé</strong>
            </div>
          </div>
          <button className="btn-primary-pay" onClick={() => navigate("/dashboard")}>
            Voir mon tableau de bord →
          </button>
          <button className="btn-ghost-pay" onClick={() => navigate("/send-money")}>
            Nouveau transfert
          </button>
        </div>
      </div>
    );
  }

  // ─── PAGE DE PAIEMENT ─────────────────────────────────────────
  return (
    <div className="payment-page">
      {/* NAVBAR */}
      <div className="payment-navbar">
        <div className="nav-logo" onClick={() => navigate("/")}>
          <span>⇄</span> Tao<strong>Exchange</strong>
        </div>
        <button className="btn-back" onClick={() => navigate(-1)}>
          ← Retour
        </button>
      </div>

      <div className="payment-container">
        <div className="payment-card">
          <div className="payment-header">
            <h2>💳 Finaliser le paiement</h2>
            <p>Choisissez votre méthode de paiement pour envoyer l'argent</p>
          </div>

          {/* RÉCAPITULATIF */}
          <div className="payment-summary">
            <div className="summary-title">📋 Récapitulatif du transfert</div>
            <div className="summary-row">
              <span>Vous envoyez</span>
              <strong>{transfer.amountSent} {transfer.fromCurrency}</strong>
            </div>
            <div className="summary-row">
              <span>Le destinataire reçoit</span>
              <strong>{transfer.amountReceived.toLocaleString()} {transfer.toCurrency}</strong>
            </div>
            <div className="summary-row">
              <span>Taux appliqué</span>
              <strong>1 {transfer.fromCurrency} = {transfer.exchangeRate} {transfer.toCurrency}</strong>
            </div>
            <div className="summary-row">
              <span>Frais de service (1.5%)</span>
              <strong>{transfer.fee} {transfer.fromCurrency}</strong>
            </div>
            <div className="summary-row total">
              <span>Total à débiter</span>
              <strong>{transfer.totalToPay} {transfer.fromCurrency}</strong>
            </div>
          </div>

          {/* DESTINATAIRE */}
          <div className="receiver-box">
            <div className="receiver-icon">👤</div>
            <div className="receiver-info">
              <span className="receiver-name">{transfer.receiverName}</span>
              <span className="receiver-meta">{transfer.method} · {transfer.receiverPhone}</span>
            </div>
            <div className="receiver-amount">
              +{transfer.amountReceived.toLocaleString()} {transfer.toCurrency}
            </div>
          </div>

          {/* MÉTHODES DE PAIEMENT */}
          <div className="payment-methods">
            <div className="methods-title">Méthodes acceptées</div>
            <div className="methods-icons">
              <div className="method-pill">💳 Carte bancaire</div>
              <div className="method-pill">📱 Mobile Money</div>
              <div className="method-pill">🏦 Virement</div>
            </div>
          </div>

          {/* SÉCURITÉ */}
          <div className="security-badges">
            <span>🔒 SSL 256-bit</span>
            <span>✓ PCI DSS</span>
            <span>🛡️ 3D Secure</span>
          </div>

          {/* BOUTON PAYER */}
          <button className="btn-pay" onClick={handlePay}>
            Payer {transfer.totalToPay} {transfer.fromCurrency} →
          </button>

          <p className="payment-note">
            En cliquant sur "Payer", vous acceptez les{" "}
            <a href="#terms">conditions générales</a> de Tao Exchange.
            Votre paiement est traité de façon sécurisée par Flutterwave.
          </p>
        </div>

        {/* SIDEBAR INFO */}
        <div className="payment-info">
          <div className="info-card">
            <h3>🔒 Paiement 100% sécurisé</h3>
            <p>Vos données bancaires sont chiffrées et ne sont jamais stockées sur nos serveurs.</p>
          </div>
          <div className="info-card">
            <h3>⚡ Transfert instantané</h3>
            <p>Une fois le paiement confirmé, le destinataire reçoit l'argent en moins de 2 minutes.</p>
          </div>
          <div className="info-card">
            <h3>🔄 Remboursement garanti</h3>
            <p>En cas de problème, nous vous remboursons intégralement sous 24h ouvrées.</p>
          </div>
          <div className="info-card powered">
            <span>Paiements traités par</span>
            <strong>🌍 Flutterwave</strong>
            <span className="powered-sub">Leader du paiement en Afrique</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;