import { useState } from "react";
import { previewThreshold } from "../../services/api.js";
import styles from "./ThresholdSimulator.module.css";

function ThresholdSimulator() {
  const [thresholdBlock, setThresholdBlock] = useState(0.8);
  const [thresholdReview, setThresholdReview] = useState(0.5);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePreview = async () => {
    setLoading(true);
    try {
      const data = await previewThreshold({
        threshold_block: thresholdBlock,
        threshold_review: thresholdReview,
        test_set: "round_2",
        compare: true,
      });
      setPreview(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className={styles.simulator}>
      <header className={styles.simulatorHeader}>
        <h3>Threshold Simulator</h3>
      </header>

      <section className={styles.sliders}>
        <section className={styles.sliderGroup}>
          <label>Block threshold: {thresholdBlock}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={thresholdBlock}
            onChange={(e) => setThresholdBlock(parseFloat(e.target.value))}
          />
        </section>
        <section className={styles.sliderGroup}>
          <label>Review threshold: {thresholdReview}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={thresholdReview}
            onChange={(e) => setThresholdReview(parseFloat(e.target.value))}
          />
        </section>
      </section>

      <button onClick={handlePreview} disabled={loading}>
        {loading ? "Calculating..." : "Preview"}
      </button>

      {preview && (
        <>
          {/* Resultados de la configuración actual */}
          <section className={styles.results}>
            <article className={styles.resultItem}>
              <span>Blocked</span>
              <strong>{preview.preview_config?.blocked}</strong>
            </article>
            <article className={styles.resultItem}>
              <span>Reviewed</span>
              <strong>{preview.preview_config?.reviewed}</strong>
            </article>
            <article className={styles.resultItem}>
              <span>Allowed</span>
              <strong>{preview.preview_config?.allowed}</strong>
            </article>
            <article className={styles.resultItem}>
              <span>Fraud caught</span>
              <strong>{preview.preview_config?.fraud_caught}</strong>
            </article>
            <article className={styles.resultItem}>
              <span>False positives</span>
              <strong>{preview.preview_config?.false_positives}</strong>
            </article>
            <article className={styles.resultItem}>
              <span>Money saved</span>
              <strong>€{preview.preview_config?.money_saved_eur}</strong>
            </article>
            {preview.delta?.recommendation && (
              <p className={styles.recommendation}>
                {preview.delta.recommendation}
              </p>
            )}
          </section>

          {/* Benchmark R1 vs R2 — solo si compare=true lo devuelve */}
          {preview.comparison && (
            <section className={styles.comparison}>
              <h4>Round 1 vs Round 2</h4>
              <table className={styles.comparisonTable}>
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Round 1</th>
                    <th>Round 2</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Recall</td>
                    <td>{preview.comparison.round_1?.recall ?? "—"}</td>
                    <td>{preview.comparison.round_2?.recall ?? "—"}</td>
                  </tr>
                  <tr>
                    <td>Precision</td>
                    <td>{preview.comparison.round_1?.precision ?? "—"}</td>
                    <td>{preview.comparison.round_2?.precision ?? "—"}</td>
                  </tr>
                  <tr>
                    <td>F1</td>
                    <td>{preview.comparison.round_1?.f1 ?? "—"}</td>
                    <td>{preview.comparison.round_2?.f1 ?? "—"}</td>
                  </tr>
                  <tr>
                    <td>Fraud detected (€)</td>
                    <td>
                      {preview.comparison.round_1?.fraud_detected_eur ?? "—"}
                    </td>
                    <td>
                      {preview.comparison.round_2?.fraud_detected_eur ?? "—"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>
          )}
        </>
      )}
    </article>
  );
}

export default ThresholdSimulator;
