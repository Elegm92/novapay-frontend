import { useState, useEffect, useRef } from "react";
import { getClientProfile } from "../../services/api.js";
import Spinner from "../shared/Spinner.jsx";
import styles from "./ClientModal.module.css";

const ClientModal = ({ clientId, isOpen, onClose }) => {
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);
  const cache = useRef({});

  useEffect(() => {
    if (isOpen && clientId) {
      fetchClientProfile();
    }
  }, [isOpen, clientId]);

  const fetchClientProfile = async () => {

    if (cache.current[clientId]) {
      setClientData(cache.current[clientId]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await getClientProfile(clientId);
      cache.current[clientId] = data;
      setClientData(data);
    } catch (error) {
      console.error("Error fetching client profile:", error);
      setError("No se ha podido cargar el perfil del cliente.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const transactions = clientData?.recent_transactions || [];
  const visibleTransactions = showAll ? transactions : transactions.slice(0, 5);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleArea}>
            <span className="material-icons">person</span>
            <div>
              <h3>ID Cliente: {clientId}</h3>
              {clientData?.stats?.fraud_rate_historical != null && (
                <span
                  className={`${styles.riskBadge} ${
                    clientData.stats.fraud_rate_historical > 0.5
                      ? styles.high
                      : clientData.stats.fraud_rate_historical > 0.2
                        ? styles.medium
                        : styles.low
                  }`}
                >
                  {clientData.stats.fraud_rate_historical > 0.5
                    ? "ALTO RIESGO"
                    : clientData.stats.fraud_rate_historical > 0.2
                      ? "RIESGO MEDIO"
                      : "BAJO RIESGO"}
                </span>
              )}
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <span className="material-icons">close</span>
          </button>
        </div>

        {/* Contenido */}
        {loading ? (
          <Spinner />
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : clientData ? (
          <>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <p>Total Transacciones</p>
                <h3>{clientData.stats?.total_transactions ?? "—"}</h3>
              </div>
              <div className={styles.statCard}>
                <p>Volumen Total</p>
                <h3>€{clientData.stats?.total_volume?.toLocaleString() ?? "—"}</h3>
              </div>
              <div className={styles.statCard}>
                <p>Importe Medio</p>
                <h3>€{clientData.stats?.avg_amount?.toLocaleString() ?? "—"}</h3>
              </div>
              <div className={styles.statCard}>
                <p>Tasa de Fraude</p>
                <h3>
                  {clientData.stats?.fraud_rate_historical != null
                    ? `${(clientData.stats.fraud_rate_historical * 100).toFixed(1)}%`
                    : "—"}
                </h3>
              </div>
              <div className={styles.statCard}>
                <p>Primera Actividad</p>
                <h3>
                  {clientData.stats?.first_seen
                    ? new Date(clientData.stats.first_seen).toLocaleDateString()
                    : "—"}
                </h3>
              </div>
              <div className={styles.statCard}>
                <p>Última Actividad</p>
                <h3>
                  {clientData.stats?.last_seen
                    ? new Date(clientData.stats.last_seen).toLocaleDateString()
                    : "—"}
                </h3>
              </div>
              <div className={styles.statCard}>
                <p>Contrapartes</p>
                <h3>{clientData.stats?.distinct_counterparties ?? "—"}</h3>
              </div>
              <div className={styles.statCard}>
                <p>Tipo más usado</p>
                <h3>{clientData.stats?.most_used_type || "—"}</h3>
              </div>
            </div>

            {clientData.risk_flags?.length > 0 && (
              <div className={styles.riskFlags}>
                <h4>Alertas de Riesgo</h4>
                <div className={styles.flagsList}>
                  {clientData.risk_flags.map((flag, i) => (
                    <span key={i} className={styles.flag}>
                      <span className="material-icons">warning</span>
                      {flag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.transactionList}>
              <h4>Transacciones Recientes</h4>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Importe</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleTransactions.map((tx) => (
                    <tr
                      key={tx.transaction_id}
                      className={tx.is_flagged_fraud ? styles.fraudRow : ""}
                    >
                      <td className={styles.monoText}>{tx.transaction_id}</td>
                      <td>
                        {tx.timestamp
                          ? new Date(tx.timestamp).toLocaleDateString()
                          : "—"}
                      </td>
                      <td>
                        {tx.amount != null
                          ? `€${tx.amount.toLocaleString()}`
                          : "—"}
                      </td>
                      <td>{tx.type || "—"}</td>
                      <td>
                        <span
                          className={`${styles.riskBadge} ${
                            tx.is_flagged_fraud ? styles.high : styles.low
                          }`}
                        >
                          {tx.is_flagged_fraud ? "FRAUDE" : "LEGÍTIMA"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {transactions.length > 5 && (
                <button
                  className={styles.showMoreBtn}
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? "Ver menos" : `Ver todas (${transactions.length})`}
                </button>
              )}
            </div>
          </>
        ) : null}

        <div className={styles.footer}>
          <button className={styles.closeButton} onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientModal;