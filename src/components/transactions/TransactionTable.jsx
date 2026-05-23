import styles from './TransactionTable.module.css'

const TransactionTable = ({ transactions, onRowClick, expandedId }) => {
  if (!transactions || transactions.length === 0) {
    return <div className={styles.empty}>No transactions found</div>
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Country</th>
            <th>Category</th>
            <th>Fraud Score</th>
            <th>Risk Level</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr
              key={tx.transaction_id}
              className={`${styles.row} ${expandedId === tx.transaction_id ? styles.expanded : ''}`}
              onClick={() => onRowClick(tx)}
            >
              <td className={styles.monoText}>{tx.transaction_id}</td>
              <td className={styles.bold}>${tx.amount?.toLocaleString()}</td>
              <td>
                <span className={styles.typeBadge}>{tx.type}</span>
              </td>
              <td>{tx.ip_country}</td>
              <td>{tx.merchant_category}</td>
              <td>
                <div className={styles.scoreWrapper}>
                  <div className={styles.scoreBar}>
                    <div
                      className={`${styles.scoreFill} ${styles[tx.risk_level]}`}
                      style={{ width: `${Math.round(tx.fraud_probability * 100)}%` }}
                    />
                  </div>
                  <span className={styles.scoreNumber}>
                    {Math.round(tx.fraud_probability * 100)}
                  </span>
                </div>
              </td>
              <td>
                <span className={`${styles.riskBadge} ${styles[tx.risk_level]}`}>
                  {tx.risk_level}
                </span>
              </td>
              <td>{new Date(tx.timestamp).toLocaleDateString()}</td>
              <td>
                <span className="material-icons">
                  {expandedId === tx.transaction_id ? 'expand_less' : 'expand_more'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TransactionTable