import { useState, useEffect } from 'react'
import { decideTransaction, getChallengeRecommendation } from '../../services/api.js'
import VerdictForm from './VerdictForm.jsx'
import ClientModal from './ClientModal.jsx'
import styles from './TransactionDetailPanel.module.css'

const TransactionDetailPanel = ({ transaction, onClose }) => {
  const [decision, setDecision] = useState(null)
  const [challenge, setChallenge] = useState(null)
  const [loading, setLoading] = useState(true)
  const [clientModalOpen, setClientModalOpen] = useState(false)

  useEffect(() => {
    if (transaction) {
      fetchMLData()
    }
  }, [transaction])

  const fetchMLData = async () => {
    try {
      setLoading(true)

      // 1. Primero POST /fraud/decide
      const decisionData = await decideTransaction({
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
      })
      setDecision(decisionData)

      // 2. Luego POST /fraud/challenge con los valores de decide
      const challengeData = await getChallengeRecommendation({
        transaction_id: transaction.transaction_id,
        fraud_probability: decisionData.fraud_probability,
        risk_level: decisionData.risk_level,
        transaction_context: {
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
        }
      })
      setChallenge(challengeData)

    } catch (error) {
      console.error('Error fetching ML data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!transaction) return null

  return (
    <div className={styles.panel}>
      {/* Columna izquierda — Datos de la transacción */}
      <div className={styles.leftColumn}>
        <div className={styles.sectionHeader}>
          <h3>Transaction Context</h3>
          <button
            className={styles.clientBtn}
            onClick={() => setClientModalOpen(true)}
          >
            <span className="material-icons">person_search</span>
            View Client: {transaction.nameOrig}
          </button>
        </div>

        <div className={styles.dataGrid}>
          <div className={styles.dataItem}>
            <p className={styles.dataLabel}>Source Account</p>
            <p className={styles.dataValue}>{transaction.nameOrig}</p>
          </div>
          <div className={styles.dataItem}>
            <p className={styles.dataLabel}>Destination</p>
            <p className={styles.dataValue}>{transaction.nameDest}</p>
          </div>
          <div className={styles.dataItem}>
            <p className={styles.dataLabel}>Balance Before</p>
            <p className={styles.dataValue}>${transaction.oldbalanceOrg?.toLocaleString()}</p>
          </div>
          <div className={styles.dataItem}>
            <p className={styles.dataLabel}>Balance After</p>
            <p className={styles.dataValue}>${transaction.newbalanceOrig?.toLocaleString()}</p>
          </div>
          <div className={styles.dataItem}>
            <p className={styles.dataLabel}>IP Country</p>
            <p className={styles.dataValue}>{transaction.ip_country}</p>
          </div>
          <div className={styles.dataItem}>
            <p className={styles.dataLabel}>Category</p>
            <p className={styles.dataValue}>{transaction.merchant_category}</p>
          </div>
          <div className={styles.dataItem}>
            <p className={styles.dataLabel}>Step</p>
            <p className={styles.dataValue}>{transaction.step}h</p>
          </div>
        </div>
      </div>

      {/* Columna derecha — Informe ML */}
      <div className={styles.rightColumn}>
        {loading ? (
          <div className={styles.loading}>Loading ML analysis...</div>
        ) : (
          <>
            {/* Decisión del modelo */}
            {decision && (
              <div className={styles.decisionSection}>
                <h3>ML Decision</h3>
                <div className={styles.decisionBadge}>
                  <span className={`${styles.decision} ${styles[decision.decision]}`}>
                    {decision.decision?.toUpperCase()}
                  </span>
                  <span className={styles.probability}>
                    {Math.round(decision.fraud_probability * 100)}% fraud probability
                  </span>
                </div>
              </div>
            )}

            {/* Recomendación de fricción */}
            {challenge && (
              <div className={styles.challengeSection}>
                <h3>Friction Recommendation</h3>
                <div className={`${styles.frictionBadge} ${styles[challenge.primary_option?.friction]}`}>
                  <span className="material-icons">
                    {challenge.primary_option?.friction === 'high' ? 'block' : 'warning'}
                  </span>
                  <span>{challenge.recommended_action?.toUpperCase()}</span>
                </div>
                <p className={styles.reasoning}>{challenge.reasoning}</p>
                {challenge.primary_option?.user_message && (
                  <p className={styles.userMessage}>{challenge.primary_option.user_message}</p>
                )}
              </div>
            )}

            {/* Formulario de veredicto */}
            <VerdictForm
              transaction={transaction}
              decision={decision}
              onClose={onClose}
            />
          </>
        )}
      </div>

      {/* Client Modal */}
      {clientModalOpen && (
        <ClientModal
          clientId={transaction.nameOrig}
          isOpen={clientModalOpen}
          onClose={() => setClientModalOpen(false)}
        />
      )}
    </div>
  )
}

export default TransactionDetailPanel