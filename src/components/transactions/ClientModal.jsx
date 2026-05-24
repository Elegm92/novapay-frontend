import { useState, useEffect } from "react";
import { getClientProfile } from "../../services/api.js";
import styles from "./ClientModal.module.css";

const ClientModal = ({ clientId, isOpen, onClose }) => {
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (isOpen && clientId) {
      fetchClientProfile();
    }
  }, [isOpen, clientId]);

  const fetchClientProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getClientProfile(clientId);
      setClientData(data);
    } catch (error) {
      console.error("Error fetching client profile:", error);
      setError("Client profile not available yet.");
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
              <h3>Client ID: {clientId}</h3>
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
                    ? "HIGH RISK"
                    : clientData.stats.fraud_rate_historical > 0.2
                      ? "MEDIUM RISK"
                      : "LOW RISK"}
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
          <div className={styles.loading}>Loading client profile...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : clientData ? (
          <>
            {/* Stats */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <p>Total Transactions</p>
                <h3>{clientData.stats?.total_transactions ?? "—"}</h3>
              </div>
              <div className={styles.statCard}>
                <p>Total Volume</p>
                <h3>
                  €{clientData.stats?.total_volume?.toLocaleString() ?? "—"}
                </h3>
              </div>
              <div className={styles.statCard}>
                <p>Avg Amount</p>
                <h3>
                  €{clientData.stats?.avg_amount?.toLocaleString() ?? "—"}
                </h3>
              </div>
              <div className={styles.statCard}>
                <p>Historical Fraud Rate</p>
                <h3>
                  {clientData.stats?.fraud_rate_historical != null
                    ? `${(clientData.stats.fraud_rate_historical * 100).toFixed(1)}%`
                    : "—"}
                </h3>
              </div>
              <div className={styles.statCard}>
                <p>First Seen</p>
                <h3>
                  {clientData.stats?.first_seen
                    ? new Date(clientData.stats.first_seen).toLocaleDateString()
                    : "—"}
                </h3>
              </div>
              <div className={styles.statCard}>
                <p>Last Seen</p>
                <h3>
                  {clientData.stats?.last_seen
                    ? new Date(clientData.stats.last_seen).toLocaleDateString()
                    : "—"}
                </h3>
              </div>
            </div>

            {/* Risk Flags */}
            {clientData.risk_flags?.length > 0 && (
              <div className={styles.riskFlags}>
                <h4>Risk Flags</h4>
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

            {/* Transacciones recientes */}
            <div className={styles.transactionList}>
              <h4>Recent Transactions</h4>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Type</th>
                    <th>Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleTransactions.map((tx) => (
                    <tr
                      key={tx.transaction_id}
                      className={
                        tx.risk_level === "high" ? styles.fraudRow : ""
                      }
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
                          className={`${styles.riskBadge} ${styles[tx.risk_level]}`}
                        >
                          {tx.risk_level?.toUpperCase() || "—"}
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
                  {showAll
                    ? "Show less"
                    : `Show all ${transactions.length} transactions`}
                </button>
              )}
            </div>
          </>
        ) : null}

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.closeButton} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientModal;
