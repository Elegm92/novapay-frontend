import { useState, useEffect } from "react";
import { getDecisions, getHistoryStats } from "../services/api.js";
import Layout from "../components/shared/Layout.jsx";
import HistoryTable from "../components/history/HistoryTable.jsx";
import HistoryDetailModal from "../components/history/HistoryDetailModal.jsx";
import KPICard from "../components/shared/KPICard.jsx";
import styles from "./History.module.css";

const History = () => {
  const [decisions, setDecisions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    verdict: "",
    dateFrom: "",
    dateTo: "",
  });
  const [selectedDecision, setSelectedDecision] = useState(null);

  useEffect(() => {
    fetchDecisions();
    fetchStats();
  }, [filters]);

  const fetchDecisions = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getDecisions(filters);
      setDecisions(data || []);
    } catch (error) {
      console.error("Error fetching decisions:", error);
      setError("Failed to load decision history.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await getHistoryStats();
      setStats(data);
    } catch (error) {
      console.error("Error fetching history stats:", error);
    }
  };

  const handleRowClick = (decision) => setSelectedDecision(decision);
  const handleModalClose = () => setSelectedDecision(null);

  return (
    <Layout>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.pageHeader}>
          <h2>Decision History</h2>
          <p>Review all past verdicts and analyst rationales.</p>
        </div>

        {/* Tarjetas de resumen */}
        <section className={styles.kpiGrid}>
          <KPICard
            label="Total Approved"
            value={stats?.total_approved ?? "—"}
            icon="check_circle"
          />
          <KPICard
            label="Total Blocked"
            value={stats?.total_blocked ?? "—"}
            icon="block"
          />
          <KPICard
            label="Manual Flags"
            value={stats?.manual_flags ?? "—"}
            icon="flag"
          />
          <KPICard
            label="Avg. Resolve Time"
            value={
              stats?.avg_resolve_time_minutes != null
                ? `${stats.avg_resolve_time_minutes} min`
                : "—"
            }
            icon="timer"
          />
        </section>

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label>Verdict</label>
            <select
              value={filters.verdict}
              onChange={(e) =>
                setFilters({ ...filters, verdict: e.target.value })
              }
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
              onChange={(e) =>
                setFilters({ ...filters, dateFrom: e.target.value })
              }
            />
          </div>
          <div className={styles.filterGroup}>
            <label>To</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) =>
                setFilters({ ...filters, dateTo: e.target.value })
              }
            />
          </div>
          <button className={styles.filterBtn} onClick={fetchDecisions}>
            Apply Filters
          </button>
        </div>

        {/* Tabla */}
        {error && <div className={styles.error}>{error}</div>}
        {loading ? (
          <div className={styles.loading}>Loading decisions...</div>
        ) : decisions.length === 0 ? (
          <div className={styles.emptyState}>No decisions found.</div>
        ) : (
          <HistoryTable decisions={decisions} onRowClick={handleRowClick} />
        )}

        <HistoryDetailModal
          decision={selectedDecision}
          isOpen={!!selectedDecision}
          onClose={handleModalClose}
        />
      </div>
    </Layout>
  );
};

export default History;
