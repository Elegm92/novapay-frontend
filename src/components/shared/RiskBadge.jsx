import styles from "./RiskBadge.module.css";

function RiskBadge({ level }) {
  const levels = {
    high: styles.high,
    medium: styles.medium,
    low: styles.low,
  };

  const labels = {
    high: "ALTO",
    medium: "MEDIO",
    low: "BAJO",
  };

  return (
    <span className={`${styles.badge} ${levels[level] ?? ""}`}>
      {labels[level] ?? level?.toUpperCase() ?? "—"}
    </span>
  );
}

export default RiskBadge;