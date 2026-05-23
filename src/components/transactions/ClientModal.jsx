import { useState, useEffect } from 'react'
import { getClientProfile } from '../../services/api.js'
import styles from './ClientModal.module.css'

const ClientModal = ({ clientId, isOpen, onClose }) => {
  const [clientData, setClientData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen && clientId) {
      fetchClientProfile()
    }
  }, [isOpen, clientId])

  const fetchClientProfile = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getClientProfile(clientId)
      setClientData(data)
    } catch (error) {
      console.error('Error fetching client profile:', error)
      setError('Client profile not available yet.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleArea}>
            <span className="material-icons">person</span>
            <div>
              <h3>Client ID: {clientId}</h3>
              {clientData && (
                <span className={`${styles.riskBadge} ${styles[clientData.risk_profile]}`}>
                  {clientData.risk_profile?.toUpperCase()}
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
                <h3>{clientData.total_transactions}</h3>
              </div>
              <div className={styles.statCard}>
                <p>Total Amount</p>
                <h3>€{clientData.total_amount?.toLocaleString()}</h3>
              </div>
              <div className={styles.statCard}>
                <p>Fraud Flags</p>
                <h3 className={styles.dangerText}>{clientData.fraud_flags}</h3>
              </div>
              <div className={styles.statCard}>
                <p>Last Seen</p>
                <h3>{new Date(clientData.last_seen).toLocaleDateString()}</h3>
              </div>
            </div>

            {/* Historial de transacciones */}
            <div className={styles.transactionList}>
              <h4>Last 10 Transactions</h4>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {clientData.transactions?.map((tx) => (
                    <tr
                      key={tx.transaction_id}
                      className={tx.status === 'fraud' ? styles.fraudRow : ''}
                    >
                      <td className={styles.monoText}>{tx.transaction_id}</td>
                      <td>{new Date(tx.timestamp).toLocaleDateString()}</td>
                      <td>€{tx.amount?.toLocaleString()}</td>
                      <td>{tx.type}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles[tx.status]}`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.closeButton} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

export default ClientModal