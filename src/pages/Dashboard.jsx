import { useEffect, useState } from 'react'
import { getDashboardStats } from '../services/api.js'

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats()
        setStats(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) return <p>Cargando...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <div>
          <h3>Total transacciones</h3>
          <p>{stats.total_transactions}</p>
        </div>
        <div>
          <h3>Transacciones hoy</h3>
          <p>{stats.transactions_today}</p>
        </div>
        <div>
          <h3>Casos pendientes</h3>
          <p>{stats.pending_cases}</p>
        </div>
        <div>
          <h3>Tasa de detección</h3>
          <p>{stats.detection_rate}</p>
        </div>
        <div>
          <h3>Bloqueadas</h3>
          <p>{stats.blocked_transactions}</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard