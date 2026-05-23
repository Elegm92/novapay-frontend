import { useEffect, useState } from "react";
import { getDSStats } from "../../services/api.js";
import styles from "./RiskMap.module.css";

function RiskMap() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDSStats();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <p>Loading risk map...</p>;
  if (error) return <p>No data available</p>;

  return (
    <article className={styles.riskMap}>
      <header className={styles.riskMapHeader}>
        <h3>Risk Map</h3>
      </header>

      <section className={styles.grid}>
        <section className={styles.column}>
          <h4>Top Risky Countries</h4>
          {stats?.top_risky_countries?.length ? (
            stats.top_risky_countries.map((item, i) => (
              <article key={i} className={styles.riskItem}>
                <span className={styles.name}>{item.country}</span>
                <section className={styles.bar}>
                  <section
                    className={styles.fill}
                    style={{ width: `${(item.fraud_rate * 100).toFixed(1)}%` }}
                  />
                </section>
                <span className={styles.rate}>
                  {(item.fraud_rate * 100).toFixed(1)}%
                </span>
              </article>
            ))
          ) : (
            <p>No data available</p>
          )}
        </section>

        <section className={styles.column}>
          <h4>Top Risky Categories</h4>
          {stats?.top_risky_categories?.length ? (
            stats.top_risky_categories.map((item, i) => (
              <article key={i} className={styles.riskItem}>
                <span className={styles.name}>{item.category}</span>
                <section className={styles.bar}>
                  <section
                    className={styles.fill}
                    style={{ width: `${(item.fraud_rate * 100).toFixed(1)}%` }}
                  />
                </section>
                <span className={styles.rate}>
                  {(item.fraud_rate * 100).toFixed(1)}%
                </span>
              </article>
            ))
          ) : (
            <p>No data available</p>
          )}
        </section>
      </section>
    </article>
  );
}

export default RiskMap;
