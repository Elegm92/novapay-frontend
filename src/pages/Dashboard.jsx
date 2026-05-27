import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../services/api.js";
import Layout from "../components/shared/Layout.jsx";
import ThresholdSimulator from "../components/dashboard/ThresholdSimulator.jsx";
import RiskMap from "../components/dashboard/RiskMap.jsx";
import KPICard from "../components/shared/KPICard.jsx";
import DetectionBenchmark from "../components/dashboard/DetectionBenchmark.jsx";
import styles from "./Dashboard.module.css";
import Spinner from "../components/shared/Spinner.jsx";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

if (loading)
  return (
    <Layout>
      <Spinner />
    </Layout>
  );
if (error)
  return (
    <Layout>
      <div
        style={{
          margin: "32px 24px",
          padding: "16px 20px",
          background: "var(--color-error-bg)",
          color: "var(--color-error)",
          borderRadius: "var(--radius-md)",
          fontSize: "14px",
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <span className="material-icons" style={{ fontSize: "20px" }}>
          error_outline
        </span>
        Could not load dashboard data. Please try reloading the page.
      </div>
    </Layout>
  );

  return (
    <Layout>
      <section className={styles.dashboard}>
        <section className={styles.hero}>
          <section className={styles.heroText}>
            <span className={styles.vigilance}>HIGH VIGILANCE MODE</span>
            <h2>{stats?.pending_cases ?? "—"} Pending Cases</h2>
            <p>Review required. Check the transactions queue.</p>
          </section>
          <button
            className={styles.viewCasesBtn}
            onClick={() => navigate("/transactions")}
          >
            View all cases
          </button>
        </section>

        {stats && (
          <section className={styles.kpiGrid}>
            <KPICard
              label="Total Transactions"
              value={stats.total_transactions}
              icon="receipt_long"
            />
            <KPICard
              label="Transactions Today"
              value={stats.transactions_today}
              icon="today"
            />
            <KPICard
              label="Pending Cases"
              value={stats.pending_cases}
              icon="pending"
            />
            <KPICard
              label="Blocked"
              value={stats.blocked_transactions}
              icon="block"
            />
            <KPICard
              label="Detection Rate"
              value={stats.detection_rate}
              icon="radar"
            />
          </section>
        )}

        <section className={styles.bottomGrid}>
          <RiskMap />
          <ThresholdSimulator />
          <DetectionBenchmark />
        </section>
      </section>
    </Layout>
  );
}

export default Dashboard;
