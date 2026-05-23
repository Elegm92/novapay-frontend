import { useState } from 'react'
import { createDecision, sendFeedback } from '../../services/api.js'
import { useAuth } from '../../hooks/useAuth.js'
import styles from './VerdictForm.module.css'

const VerdictForm = ({ transaction, decision, onClose }) => {
  const { user } = useAuth()
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleVerdict = async (verdict) => {
    if (!notes.trim()) {
      setError('Notes are mandatory before submitting a verdict.')
      return
    }

    try {
      setLoading(true)
      setError('')

      // 1. Feedback a DS
      await sendFeedback({
        transaction_id: transaction.transaction_id,
        analyst_decision: verdict,
        analyst_notes: notes,
        analyst_id: user?.id,
      })

      // 2. Guardar en nuestra BD
      await createDecision({
        transaction_id: transaction.transaction_id,
        verdict,
        notes,
      })

      onClose()

    } catch (error) {
      console.error('Error submitting verdict:', error)
      setError('Failed to submit verdict. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.form}>
      <h3>Analyst Verdict</h3>

      <div className={styles.inputGroup}>
        <label>Analyst Notes <span className={styles.required}>*</span></label>
        <textarea
          className={styles.textarea}
          placeholder="Explain your decision (Mandatory)..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.buttons}>
        <button
          className={styles.fraudBtn}
          onClick={() => handleVerdict('fraud')}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Confirm Fraud'}
        </button>
        <button
          className={styles.legitimateBtn}
          onClick={() => handleVerdict('legitimate')}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Approve Legitimate'}
        </button>
      </div>
    </div>
  )
}

export default VerdictForm