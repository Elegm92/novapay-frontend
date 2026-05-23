import styles from './HistoryTable.module.css'

const HistoryTable = ({ decisions, onRowClick }) => {
  if (!decisions || decisions.length === 0) {
    return <div className={styles.empty}>No decisions found</div>
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Amount</th>
            <th>Verdict</th>
            <th>Analyst Notes</th>
            <th>Date</th>
            <th>Analyst</th>
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
                ${decision.Transaction?.amount?.toLocaleString()}
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