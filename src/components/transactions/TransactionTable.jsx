import styles from './TransactionTable.module.css'

const TransactionTable = ({transactions,onRowClick,expandedId,onSort,sortConfig, activeTab}) => {
  const getSortIcon = (key) => {
    if (sortConfig?.key !== key) return "unfold_more";
    return sortConfig.direction === "asc" ? "expand_less" : "expand_more";
  };

  if (!transactions || transactions.length === 0) {
    return <div className={styles.empty}>No transactions found</div>;
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th onClick={() => onSort("transaction_id")}>
              Transaction ID
              <span className="material-icons">
                {getSortIcon("transaction_id")}
              </span>
            </th>

            <th onClick={() => onSort("amount")}>
              Amount
              <span className="material-icons">{getSortIcon("amount")}</span>
            </th>

            <th onClick={() => onSort("type")}>
              Type
              <span className="material-icons">{getSortIcon("type")}</span>
            </th>

            <th onClick={() => onSort("ip_country")}>
              Country
              <span className="material-icons">
                {getSortIcon("ip_country")}
              </span>
            </th>

            <th onClick={() => onSort("merchant_category")}>
              Category
              <span className="material-icons">
                {getSortIcon("merchant_category")}
              </span>
            </th>

            <th onClick={() => onSort("fraud_probability")}>
              Fraud Score
              <span className="material-icons">
                {getSortIcon("fraud_probability")}
              </span>
            </th>

            <th onClick={() => onSort("risk_level")}>
              Risk Level
              <span className="material-icons">
                {getSortIcon("risk_level")}
              </span>
            </th>

            <th onClick={() => onSort("timestamp")}>
              Date
              <span className="material-icons">{getSortIcon("timestamp")}</span>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr
              key={tx.transaction_id}
              className={`${styles.row} ${expandedId === tx.transaction_id ? styles.expanded : ""}`}
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
                    <div className={`${styles.scoreFill} ${
                        activeTab === "legitimate"
                          ? styles.low
                          : activeTab === "blocked"
                            ? styles.high
                            : styles[tx.risk_level]}`}
                      style={{
                        width: `${Math.round(tx.fraud_probability * 100)}%`,
                      }}
                    />
                  </div>
                  <span className={styles.scoreNumber}>
                    {Math.round(tx.fraud_probability * 100)}
                  </span>
                </div>
              </td>
              <td>
                <span
                  className={`${styles.riskBadge} ${styles[tx.risk_level]}`}
                >
                  {tx.risk_level}
                </span>
              </td>
              <td>{new Date(tx.timestamp).toLocaleDateString()}</td>
              <td>
                <span className="material-icons">
                  {expandedId === tx.transaction_id
                    ? "expand_less"
                    : "expand_more"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable