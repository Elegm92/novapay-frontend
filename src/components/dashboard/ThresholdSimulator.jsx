import { useState } from "react";
import { previewThreshold } from "../../services/api.js";
import styles from "./ThresholdSimulator.module.css";
import { formatNumber, formatCurrency } from "../../utils/formatters.js";

function ThresholdSimulator() {
  const [thresholdBlock, setThresholdBlock] = useState(0.75);
  const [thresholdReview, setThresholdReview] = useState(0.45);
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
        <h3>Simulador de Umbrales</h3>
      </header>

      <section className={styles.sliders}>
        <section className={styles.sliderGroup}>
          <label>
            <span>UMBRAL DE BLOQUEO</span>
            <span className={styles.sliderValue}>
              {thresholdBlock.toFixed(2)}
            </span>
          </label>
          <p className={styles.sliderHint}>Bloqueadas: 0.75 – 1.00</p>
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
          <label>
            <span>UMBRAL DE REVISIÓN</span>
            <span className={styles.sliderValue}>
              {thresholdReview.toFixed(2)}
            </span>
          </label>
          <p className={styles.sliderHint}>
            Revisión: 0.45 – 0.74 · Aprobadas: 0.00 – 0.44
          </p>
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
        {loading ? "Calculando..." : "Previsualizar"}
      </button>

      {preview && (
        <>
          <section className={styles.results}>
            <article className={styles.resultItem}>
              <span>Bloqueadas</span>
              <strong>{formatNumber(preview.preview_config?.blocked)}</strong>
            </article>
            <article className={styles.resultItem}>
              <span>En revisión</span>
              <strong>{formatNumber(preview.preview_config?.reviewed)}</strong>
            </article>
            <article className={styles.resultItem}>
              <span>Aprobadas</span>
              <strong>{formatNumber(preview.preview_config?.allowed)}</strong>
            </article>
            <article className={styles.resultItem}>
              <span>Fraude detectado</span>
              <strong>
                {formatNumber(preview.preview_config?.fraud_caught)}
              </strong>
            </article>
            <article className={styles.resultItem}>
              <span>Falsos positivos</span>
              <strong>
                {formatNumber(preview.preview_config?.false_positives)}
              </strong>
            </article>
            <article className={styles.resultItem}>
              <span>Dinero salvado</span>
              <strong>
                {formatCurrency(preview.preview_config?.money_saved_eur)}
              </strong>
            </article>
            {preview.delta?.recommendation && (
              <p className={styles.recommendation}>
                {preview.delta.recommendation}
              </p>
            )}
          </section>

          {preview.comparison && (
            <section className={styles.comparison}>
              <h4>Round 1 vs Round 2</h4>
              <table className={styles.comparisonTable}>
                <thead>
                  <tr>
                    <th>Métrica</th>
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
                    <td>Fraude detectado (€)</td>
                    <td>
                      {formatCurrency(preview.comparison.round_1?.fraud_detected_eur)}
                    </td>
                    <td>
                      {formatCurrency(preview.comparison.round_2?.fraud_detected_eur)}
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