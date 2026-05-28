import { useState, useEffect } from "react";
import {
  decideTransaction,
  getChallengeRecommendation,
  explainTransaction,
} from "../../services/api.js";
import VerdictForm from "./VerdictForm.jsx";
import ClientModal from "./ClientModal.jsx";
import Spinner from "../shared/Spinner.jsx";
import styles from "./TransactionDetailPanel.module.css";
import { formatCurrency, formatStepAsTime } from "../../utils/formatters.js";

const TransactionDetailPanel = ({ transaction, onClose, isReviewed }) => {
  const [decision, setDecision] = useState(null);
  const [challenge, setChallenge] = useState(null);
  const [narrative, setNarrative] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [clientModalOpen, setClientModalOpen] = useState(false);

  useEffect(() => {
    setDecision(null);
    setChallenge(null);
    setNarrative(null);
    setError("");
    if (!transaction) return;
    fetchMLData();
  }, [transaction?.transaction_id]);

  const fetchMLData = async () => {
    try {
      setLoading(true);
      setError("");

      const transactionPayload = {
        transaction_id: transaction.transaction_id,
        step: transaction.step,
        type: transaction.type,
        amount: transaction.amount,
        nameOrig: transaction.nameOrig,
        oldbalanceOrg: transaction.oldbalanceOrg,
        newbalanceOrig: transaction.newbalanceOrig,
        nameDest: transaction.nameDest,
        oldbalanceDest: transaction.oldbalanceDest,
        newbalanceDest: transaction.newbalanceDest,
        merchant_category: transaction.merchant_category,
        ip_country: transaction.ip_country,
      };

      const [decisionData, challengeData] = await Promise.all([
        decideTransaction(transactionPayload),
        getChallengeRecommendation({
          transaction_id: transaction.transaction_id,
          fraud_probability: transaction.fraud_probability ?? null,
          risk_level: transaction.risk_level ?? null,
          transaction_context: transactionPayload,
        }),
      ]);

      setDecision(decisionData);
      setChallenge(challengeData);

      explainTransaction(transaction.transaction_id)
        .then((explainData) => setNarrative(explainData.narrative))
        .catch(() => {});

    } catch (error) {
      console.error("Error fetching ML data:", error);
      setError("No se pudo cargar el análisis del modelo.");
    } finally {
      setLoading(false);
    }
  };

  if (!transaction) return null;

  return (
    <div className={styles.panel} id="detail-panel">
      {/* Columna izquierda */}
      <div className={styles.leftColumn}>
        <div className={styles.sectionHeader}>
          <h3>{transaction.transaction_id}</h3>
          <button
            className={styles.clientBtn}
            onClick={() => setClientModalOpen(true)}
          >
            <span className="material-icons">person_search</span>
            Ver Cliente: {transaction.nameOrig || "Desconocido"}
          </button>
        </div>

        <div className={styles.dataGrid}>
          <div className={styles.dataItem}>
            <p className={styles.dataLabel}>Cuenta Origen</p>
            <p className={styles.dataValue}>{transaction.nameOrig || "—"}</p>
          </div>
          <div className={styles.dataItem}>
            <p className={styles.dataLabel}>Importe</p>
            <p className={styles.dataValue}>
              {formatCurrency(transaction.amount)}
            </p>
          </div>
          <div className={styles.dataItem}>
            <p className={styles.dataLabel}>Destino</p>
            <p className={styles.dataValue}>{transaction.nameDest || "—"}</p>
          </div>
          <div className={styles.dataItem}>
            <p className={styles.dataLabel}>Saldo Antes</p>
            <p className={styles.dataValue}>
              {formatCurrency(transaction.oldbalanceOrg)}
            </p>
          </div>
          <div className={styles.dataItem}>
            <p className={styles.dataLabel}>Saldo Después</p>
            <p className={styles.dataValue}>
              {formatCurrency(transaction.newbalanceOrig)}
            </p>
          </div>
          <div className={styles.dataItem}>
            <p className={styles.dataLabel}>Saldo Destino Antes</p>
            <p className={styles.dataValue}>
              {formatCurrency(transaction.oldbalanceDest)}
            </p>
          </div>
          <div className={styles.dataItem}>
            <p className={styles.dataLabel}>Saldo Destino Después</p>
            <p className={styles.dataValue}>
              {formatCurrency(transaction.newbalanceDest)}
            </p>
          </div>
          <div className={styles.dataItem}>
            <p className={styles.dataLabel}>País IP</p>
            <p className={styles.dataValue}>{transaction.ip_country || "—"}</p>
          </div>
          <div className={styles.dataItem}>
            <p className={styles.dataLabel}>Categoría</p>
            <p className={styles.dataValue}>
              {transaction.merchant_category || "—"}
            </p>
          </div>
          <div className={styles.dataItem}>
            <p className={styles.dataLabel}>Paso</p>
            <p className={styles.dataValue}>
              {formatStepAsTime(transaction.step)}
            </p>
          </div>
        </div>

        {/* Análisis IA */}
        {narrative && (
          <div className={styles.narrativeSection}>
            <p className={styles.narrativeLabel}>
              <span className="material-icons">smart_toy</span>
              Análisis IA
            </p>
            <p className={styles.narrativeText}>{narrative}</p>
          </div>
        )}
      </div>

      {/* Columna derecha — ML */}
      <div className={styles.rightColumn}>
        {error && <div className={styles.error}>{error}</div>}
        {loading ? (
          <Spinner />
        ) : (
          <>
            {decision && (
              <div className={styles.decisionSection}>
                <h3>Decisión del Modelo</h3>
                <div className={styles.decisionBadge}>
                  <span
                    className={`${styles.decision} ${styles[decision.decision]}`}
                  >
                    {decision.decision?.toUpperCase()}
                  </span>
                  <span className={styles.probability}>
                    {decision.fraud_probability != null
                      ? `${Math.round(decision.fraud_probability * 100)}% probabilidad de fraude`
                      : "Probabilidad no disponible"}
                  </span>
                </div>
              </div>
            )}

            {challenge && (
              <div className={styles.challengeSection}>
                <h3>Recomendación de Fricción</h3>
                <div
                  className={`${styles.frictionBadge} ${styles[challenge.primary_option?.friction]}`}
                >
                  <span className="material-icons">
                    {challenge.primary_option?.friction === "high"
                      ? "block"
                      : "warning"}
                  </span>
                  <span>{challenge.recommended_action?.toUpperCase()}</span>
                </div>
                <p className={styles.reasoning}>{challenge.reasoning}</p>
                {challenge.primary_option?.user_message && (
                  <p className={styles.userMessage}>
                    {challenge.primary_option.user_message}
                  </p>
                )}
              </div>
            )}

            {!isReviewed ? (
              <VerdictForm
                transaction={transaction}
                decision={decision}
                onClose={onClose}
              />
            ) : (
              <div
                style={{
                  padding: "12px 16px",
                  background: "var(--color-surface-low)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "13px",
                  color: "var(--color-text-muted)",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <span className="material-icons" style={{ fontSize: "16px" }}>
                  check_circle
                </span>
                Esta transacción ya ha sido revisada.
              </div>
            )}
          </>
        )}
      </div>

      {clientModalOpen && (
        <ClientModal
          clientId={transaction.nameOrig}
          isOpen={clientModalOpen}
          onClose={() => setClientModalOpen(false)}
        />
      )}
    </div>
  );
};

export default TransactionDetailPanel;