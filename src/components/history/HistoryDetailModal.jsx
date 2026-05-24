import styles from './HistoryDetailModal.module.css'

const HistoryDetailModal = ({ decision, isOpen, onClose }) => {
  if (!isOpen || !decision) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h3>Decision Record</h3>
            <p className={styles.transactionId}>{decision.transaction_id}</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <span className="material-icons">close</span>
          </button>
        </div>

        {/* Contenido */}
        <div className={styles.content}>
          <div className={styles.leftColumn}>
            <h4>Transaction Details</h4>
            <div className={styles.dataGrid}>
              <div className={styles.dataItem}>
                <p className={styles.dataLabel}>Amount</p>
                <p className={styles.dataValue}>
                  ${decision.Transaction?.amount?.toLocaleString() ?? "—"}
                </p>
              </div>
              <div className={styles.dataItem}>
                <p className={styles.dataLabel}>Type</p>
                <p className={styles.dataValue}>
                  {decision.Transaction?.type ?? "—"}
                </p>
              </div>
              <div className={styles.dataItem}>
                <p className={styles.dataLabel}>Source Account</p>
                <p className={styles.dataValue}>
                  {decision.Transaction?.nameOrig ?? "—"}
                </p>
              </div>
              <div className={styles.dataItem}>
                <p className={styles.dataLabel}>Destination Account</p>
                <p className={styles.dataValue}>
                  {decision.Transaction?.nameDest ?? "—"}
                </p>
              </div>
              <div className={styles.dataItem}>
                <p className={styles.dataLabel}>Balance Before</p>
                <p className={styles.dataValue}>
                  {decision.Transaction?.oldbalanceOrg != null
                    ? `$${decision.Transaction.oldbalanceOrg.toLocaleString()}`
                    : "—"}
                </p>
              </div>
              <div className={styles.dataItem}>
                <p className={styles.dataLabel}>Balance After</p>
                <p className={styles.dataValue}>
                  {decision.Transaction?.newbalanceOrig != null
                    ? `$${decision.Transaction.newbalanceOrig.toLocaleString()}`
                    : "—"}
                </p>
              </div>
              <div className={styles.dataItem}>
                <p className={styles.dataLabel}>Dest. Balance Before</p>
                <p className={styles.dataValue}>
                  {decision.Transaction?.oldbalanceDest != null
                    ? `$${decision.Transaction.oldbalanceDest.toLocaleString()}`
                    : "—"}
                </p>
              </div>
              <div className={styles.dataItem}>
                <p className={styles.dataLabel}>Dest. Balance After</p>
                <p className={styles.dataValue}>
                  {decision.Transaction?.newbalanceDest != null
                    ? `$${decision.Transaction.newbalanceDest.toLocaleString()}`
                    : "—"}
                </p>
              </div>
              <div className={styles.dataItem}>
                <p className={styles.dataLabel}>Country</p>
                <p className={styles.dataValue}>
                  {decision.Transaction?.ip_country ?? "—"}
                </p>
              </div>
              <div className={styles.dataItem}>
                <p className={styles.dataLabel}>Category</p>
                <p className={styles.dataValue}>
                  {decision.Transaction?.merchant_category ?? "—"}
                </p>
              </div>
              <div className={styles.dataItem}>
                <p className={styles.dataLabel}>Step</p>
                <p className={styles.dataValue}>
                  {decision.Transaction?.step != null
                    ? `Hour ${decision.Transaction.step}`
                    : "—"}
                </p>
              </div>
              <div className={styles.dataItem}>
                <p className={styles.dataLabel}>Date</p>
                <p className={styles.dataValue}>
                  {new Date(decision.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className={styles.rightColumn}>
            <h4>Verdict Summary</h4>
            <div className={styles.verdictCard}>
              <div className={styles.dataItem}>
                <p className={styles.dataLabel}>Verdict</p>
                <span
                  className={`${styles.verdictBadge} ${styles[decision.verdict]}`}
                >
                  {decision.verdict}
                </span>
              </div>
              <div className={styles.dataItem}>
                <p className={styles.dataLabel}>Analyst</p>
                <p className={styles.dataValue}>
                  {decision.Analyst?.name ?? "—"}
                </p>
              </div>
              <div className={styles.dataItem}>
                <p className={styles.dataLabel}>Notes</p>
                <p className={styles.notes}>{decision.notes ?? "—"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.closeButton} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default HistoryDetailModal