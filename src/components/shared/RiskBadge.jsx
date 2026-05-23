import styles from "./RiskBadge.module.css";

function RiskBadge({ level }) {
  const levels = {
    high: styles.high,
    medium: styles.medium,
    low: styles.low,
  };

  return (
    <span className={`${styles.badge} ${levels[level] ?? ""}`}>
      {level?.toUpperCase() ?? "—"}
    </span>
  );
}

export default RiskBadge;
