import styles from './HistoryTable.module.css'
import { formatCurrency } from "../../utils/formatters.js";

const HistoryTable = ({ decisions, onRowClick }) => {
  if (!decisions || decisions.length === 0) {
    return <div className={styles.empty}>No se encontraron decisiones.</div>
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID Transacción</th>
            <th>Importe</th>
            <th>Veredicto</th>
            <th>Notas del Analista</th>
            <th>Fecha</th>
            <th>Analista</th>
          </tr>
        </thead>
        <tbody>
          {decisions.map((decision) => (
            <tr
              key={decision.id}
              className={styles.row}
              onClick={() => onRowClick(decision)}
            >
              <td className={styles.monoText}>{decision.transaction_id}</td>
              <td className={styles.bold}>
                {formatCurrency(decision.Transaction?.amount)}
              </td>
              <td>
                <span className={`${styles.verdictBadge} ${styles[decision.verdict]}`}>
                  {decision.verdict}
                </span>
              </td>
              <td className={styles.truncate}>{decision.notes}</td>
              <td>{new Date(decision.createdAt).toLocaleDateString()}</td>
              <td>{decision.Analyst?.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default HistoryTable