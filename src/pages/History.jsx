import { useState, useEffect } from "react";
import { getDecisions, getHistoryStats } from "../services/api.js";
import Layout from "../components/shared/Layout.jsx";
import HistoryTable from "../components/history/HistoryTable.jsx";
import HistoryDetailModal from "../components/history/HistoryDetailModal.jsx";
import KPICard from "../components/shared/KPICard.jsx";
import Spinner from "../components/shared/Spinner.jsx";
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
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [decisionsData, statsData] = await Promise.all([
        getDecisions(filters),
        getHistoryStats(),
      ]);

      setDecisions(decisionsData || []);
      setStats(statsData);

    } catch (error) {
      console.error("Error fetching decisions:", error);
      setError("Error al cargar el historial de decisiones.");
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (decision) => setSelectedDecision(decision);
  const handleModalClose = () => setSelectedDecision(null);

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h2>Historial de Decisiones</h2>
          <p>Revisa todos los veredictos y decisiones anteriores.</p>
        </div>

        <section className={styles.kpiGrid}>
          <KPICard
            label="Total Aprobadas"
            value={stats?.total_approved ?? "—"}
            icon="check_circle"
          />
          <KPICard
            label="Total Bloqueadas"
            value={stats?.total_blocked ?? "—"}
            icon="block"
          />
          <KPICard
            label="Revisiones Manuales"
            value={stats?.manual_flags ?? "—"}
            icon="flag"
          />
        </section>

        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label>Veredicto</label>
            <select
              value={filters.verdict}
              onChange={(e) =>
                setFilters({ ...filters, verdict: e.target.value })
              }
              style={{ colorScheme: "dark" }}
            >
              <option value="">Todos</option>
              <option value="fraud">Fraude</option>
              <option value="legitimate">Legítima</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label>Desde</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) =>
                setFilters({ ...filters, dateFrom: e.target.value })
              }
            />
          </div>
          <div className={styles.filterGroup}>
            <label>Hasta</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) =>
                setFilters({ ...filters, dateTo: e.target.value })
              }
            />
          </div>
          <button className={styles.filterBtn} onClick={fetchData}>
            Aplicar Filtros
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {loading ? (
          <Spinner />
        ) : decisions.length === 0 ? (
          <div className={styles.emptyState}>No se encontraron decisiones.</div>
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