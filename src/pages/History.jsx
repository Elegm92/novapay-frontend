import { useState, useEffect } from 'react'
import { getDecisions } from '../services/api.js'
import HistoryTable from '../components/history/HistoryTable.jsx'
import HistoryDetailModal from '../components/history/HistoryDetailModal.jsx'
import styles from './History.module.css'

const History = () => {
  const [decisions, setDecisions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    verdict: '',
    dateFrom: '',
    dateTo: ''
  })
  const [selectedDecision, setSelectedDecision] = useState(null)

  useEffect(() => {
    fetchDecisions()
  }, [filters])

  const fetchDecisions = async () => {
    try {
      setLoading(true)
      const data = await getDecisions(filters)
      setDecisions(data || [])
    } catch (error) {
      console.error('Error fetching decisions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRowClick = (decision) => {
    setSelectedDecision(decision)
  }

  const handleModalClose = () => {
    setSelectedDecision(null)
  }

  return (
    <div className={styles.container}>

      {/* Header */}
      <div className={styles.pageHeader}>
        <h2>Decision History</h2>
        <p>Review all past verdicts and analyst rationales.</p>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label>Verdict</label>
          <select
            value={filters.verdict}
            onChange={(e) => setFilters({ ...filters, verdict: e.target.value })}
          >
            <option value="">All Verdicts</option>
            <option value="fraud">Fraud</option>
            <option value="legitimate">Legitimate</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label>From</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
          />
        </div>
        <div className={styles.filterGroup}>
          <label>To</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
          />
        </div>
        <button
          className={styles.filterBtn}
          onClick={fetchDecisions}
        >
          Apply Filters
        </button>
      </div>

      {/* Tabla */}
      {loading ? (
        <div className={styles.loading}>Loading decisions...</div>
      ) : (
        <HistoryTable
          decisions={decisions}
          onRowClick={handleRowClick}
        />
      )}

      {/* Modal de detalle */}
      <HistoryDetailModal
        decision={selectedDecision}
        isOpen={!!selectedDecision}
        onClose={handleModalClose}
      />
    </div>
  )
}

export default History