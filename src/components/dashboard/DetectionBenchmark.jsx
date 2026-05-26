import { useState, useEffect } from "react";
import { previewThreshold } from "../../services/api.js";
import Spinner from "../shared/Spinner.jsx";
import styles from "./DetectionBenchmark.module.css";

function DetectionBenchmark() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchBenchmark();
  }, []);

  const fetchBenchmark = async () => {
    try {
      setLoading(true);
      setError(false);
      const result = await previewThreshold({
        threshold_block: 0.8,
        threshold_review: 0.5,
        test_set: "round_2",
        compare: true,
      });
      setData(result);
    } catch (err) {
      console.error("Benchmark error:", err.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;
  if (error || !data?.comparison) return null;

  const r1 = data.comparison.round_1;
  const r2 = data.comparison.round_2;

  return (
    <article className={styles.benchmark}>
      <header className={styles.header}>
        <h3>Detection Benchmark</h3>
      </header>

      <div className={styles.bars}>
        <div className={styles.barGroup}>
          <div className={styles.barLabel}>
            <span>Round 1</span>
            <span className={styles.value}>
              {r1?.recall ? `${(r1.recall * 100).toFixed(1)}%` : "—"}
            </span>
          </div>
          <div className={styles.barTrack}>
            <div
              className={styles.barFill}
              style={{ width: r1?.recall ? `${r1.recall * 100}%` : "0%" }}
            />
          </div>
        </div>

        <div className={styles.barGroup}>
          <div className={styles.barLabel}>
            <span className={styles.primary}>Round 2 (Nova AI)</span>
            <span className={`${styles.value} ${styles.primary}`}>
              {r2?.recall ? `${(r2.recall * 100).toFixed(1)}%` : "—"}
            </span>
          </div>
          <div className={styles.barTrack}>
            <div
              className={`${styles.barFill} ${styles.barFillPrimary}`}
              style={{ width: r2?.recall ? `${r2.recall * 100}%` : "0%" }}
            />
          </div>
        </div>
      </div>

      <div className={styles.metrics}>
        <div className={styles.metric}>
          <span>Precision R1</span>
          <strong>
            {r1?.precision ? `${(r1.precision * 100).toFixed(1)}%` : "—"}
          </strong>
        </div>
        <div className={styles.metric}>
          <span>Precision R2</span>
          <strong className={styles.primary}>
            {r2?.precision ? `${(r2.precision * 100).toFixed(1)}%` : "—"}
          </strong>
        </div>
        <div className={styles.metric}>
          <span>F1 R1</span>
          <strong>{r1?.f1 ? `${(r1.f1 * 100).toFixed(1)}%` : "—"}</strong>
        </div>
        <div className={styles.metric}>
          <span>F1 R2</span>
          <strong className={styles.primary}>
            {r2?.f1 ? `${(r2.f1 * 100).toFixed(1)}%` : "—"}
          </strong>
        </div>
      </div>
    </article>
  );
}

export default DetectionBenchmark;
