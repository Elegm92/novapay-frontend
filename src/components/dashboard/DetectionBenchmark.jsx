import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "./DetectionBenchmark.module.css";

const metricsData = [
  { metric: "Precision", R1: 94, R2: 99.21 },
  { metric: "Recall", R1: 99, R2: 99.76 },
  { metric: "F1", R1: 97, R2: 99 },
];

const detectionData = [
  { metric: "Detectados", R1: 1631, R2: 3279 },
  { metric: "Perdidos", R1: 12, R2: 8 },
  { metric: "Falsas alarmas", R1: 96, R2: 26 },
];

function DetectionBenchmark() {
  return (
    <article className={styles.benchmark}>
      <header className={styles.header}>
        <h3>Análisis de Rendimiento del Modelo</h3>
        <p className={styles.subtitle}>
          XGBoost R1 vs R2 — Modelos en producción
        </p>
      </header>

      <div className={styles.charts}>
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Precision · Recall · F2</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={metricsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis
                dataKey="metric"
                tick={{ fill: "#9ca3af", fontSize: 12 }}
              />
              <YAxis
                domain={[80, 100]}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                unit="%"
              />
              <Tooltip
                isAnimationActive={false}
                contentStyle={{
                  background: "#111827",
                  border: "1px solid #1f2937",
                  borderRadius: 4,
                }}
                labelStyle={{ color: "#eef0ff" }}
                formatter={(value) => `${value}%`}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: "#9ca3af" }} />
              <Line
                type="monotone"
                dataKey="R1"
                name="R1 (threshold 0.45)"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="R2"
                name="R2 (threshold 0.55)"
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>
            Detección Real · 3.279 fraudes en test set
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={detectionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis
                dataKey="metric"
                tick={{ fill: "#9ca3af", fontSize: 12 }}
              />
              <YAxis
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                domain={[0, 3500]}
                ticks={[0, 700, 1400, 2100, 2800, 3500]}
              />
              <Tooltip
                isAnimationActive={false}
                contentStyle={{
                  background: "#111827",
                  border: "1px solid #1f2937",
                  borderRadius: 4,
                }}
                labelStyle={{ color: "#eef0ff" }}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: "#9ca3af" }} />
              <Line
                type="monotone"
                dataKey="R1"
                name="R1 (threshold 0.45)"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="R2"
                name="R2 (threshold 0.55)"
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryCard}>
          <p className={styles.summaryLabel}>R1 — Fraude obvio</p>
          <p className={styles.summaryValue}>
            12 <span>perdidos</span>
          </p>
          <p className={styles.summaryValue}>
            96 <span>falsas alarmas</span>
          </p>
          <p className={styles.summaryThreshold}>Threshold: 0.45</p>
        </div>
        <div className={`${styles.summaryCard} ${styles.summaryCardHighlight}`}>
          <p className={styles.summaryLabel}>R2 — Fraude sigiloso</p>
          <p className={styles.summaryValue}>
            8 <span>perdidos</span>
          </p>
          <p className={styles.summaryValue}>
            26 <span>falsas alarmas</span>
          </p>
          <p className={styles.summaryThreshold}>Threshold: 0.55</p>
        </div>
      </div>
    </article>
  );
}

export default DetectionBenchmark;
