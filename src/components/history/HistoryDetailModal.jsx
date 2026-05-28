import styles from './HistoryDetailModal.module.css'
import {
  formatCurrency,
  formatStepAsTime,
} from "../../utils/formatters.js";

const HistoryDetailModal = ({ decision, isOpen, onClose }) => {
  if (!isOpen || !decision) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h3>Registro de Decisión</h3>
            <p className={styles.transactionId}>{decision.transaction_id}</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <span className="material-icons">close</span>
          </button>
        </div>

        {/* Contenido */}
        <div className={styles.content}>
          <div className={styles.leftColumn}>
            <h4>Detalles de la Transacción</h4>
            <div className={styles.dataGrid}>
              <div className={styles.dataItem}>
                <p className={styles.dataLabel}>Importe</p>
                <p className={styles.dataValue}>
                  {formatCurrency(decision.Transaction?.amount)}
                </p>
              </div>
              <div className={styles.dataItem}>
                <p className={styles.dataLabel}>Tipo</p>
                <p className={styles.dataValue}>
                  {decision.Transaction?.type ?? "—"}
                </p>
              </div>
              <div className={styles.dataItem}>
                <p className={styles.dataLabel}>Cuenta Origen</p>
                <p className={styles.dataValue}>
                  {decision.Transaction?.nameOrig ?? "—"}
                </p>
              </div>
              <div className={styles.dataItem}>
                <p className={styles.dataLabel}>Cuenta Destino</p>
                <p className={styles.dataValue}>
                  {decision.Transaction?.nameDest ?? "—"}
                </p>
              </div>
              <div className={styles.dataItem}>
                <p className={styles.dataLabel}>Saldo Antes</p>
                <p className={styles.dataValue}>
                  {formatCurrency(decision.Transaction?.oldbalanceOrg)}
                </p>
              </div>
              <div className={styles.dataItem}>
                <p className={styles.dataLabel}>Saldo Después</p>
                <p className={styles.dataValue}>
                  {formatCurrency(decision.Transaction?.newbalanceOrig)}
                </p>
              </div>
              <div className={styles.dataItem}>
                <p className={styles.dataLabel}>Saldo Destino Antes</p>
                <p className={styles.dataValue}>
                  {formatCurrency(decision.Transaction?.oldbalanceDest)}
                </p>
              </div>
              <div className={styles.dataItem}>
                <p className={styles.dataLabel}>Saldo Destino Después</p>
                <p className={styles.dataValue}>
                  {formatCurrency(decision.Transaction?.newbalanceDest)}
                </p>
              </div>
              <div className={styles.dataItem}>
                <p className={styles.dataLabel}>País</p>
                <p className={styles.dataValue}>
                  {decision.Transaction?.ip_country ?? "—"}
                </p>
              </div>
              <div className={styles.dataItem}>
                <p className={styles.dataLabel}>Categoría</p>
                <p className={styles.dataValue}>
                  {decision.Transaction?.merchant_category ?? "—"}
                </p>
              </div>
              <div className={styles.dataItem}>
                <p className={styles.dataLabel}>Paso</p>
                <p className={styles.dataValue}>
                  {formatStepAsTime(decision.Transaction?.step)}
                </p>
              </div>
              <div className={styles.dataItem}>
                <p className={styles.dataLabel}>Fecha</p>
                <p className={styles.dataValue}>
                  {new Date(decision.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className={styles.rightColumn}>
            <h4>Resumen del Veredicto</h4>
            <div className={styles.verdictCard}>
              <div className={styles.dataItem}>
                <p className={styles.dataLabel}>Veredicto</p>
                <span
                  className={`${styles.verdictBadge} ${styles[decision.verdict]}`}
                >
                  {decision.verdict}
                </span>
              </div>
              <div className={styles.dataItem}>
                <p className={styles.dataLabel}>Analista</p>
                <p className={styles.dataValue}>
                  {decision.Analyst?.name ?? "—"}
                </p>
              </div>
              <div className={styles.dataItem}>
                <p className={styles.dataLabel}>Notas</p>
                <p className={styles.notes}>{decision.notes ?? "—"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.closeButton} onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default HistoryDetailModal