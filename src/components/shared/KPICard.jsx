import styles from "./KPICard.module.css";

function KPICard({ label, value, icon, trend }) {
  const formattedValue =
    typeof value === "number" ? value.toLocaleString("es-ES") : value;

  return (
    <article className={styles.card}>
      <header className={styles.top}>
        <p className={styles.label}>{label}</p>
        {icon && <span className="material-icons">{icon}</span>}
      </header>
      <h3 className={styles.value}>{formattedValue ?? "—"}</h3>
      {trend && <span className={styles.trend}>{trend}</span>}
    </article>
  );
}

export default KPICard;
