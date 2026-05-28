import styles from "./KPICard.module.css";
import { formatNumber } from "../../utils/formatters.js";

function KPICard({ label, value, icon, trend }) {

  return (
    <article className={styles.card}>
      <header className={styles.top}>
        <p className={styles.label}>{label}</p>
        {icon && <span className="material-icons">{icon}</span>}
      </header>
      <h3 className={styles.value}>{formatNumber(value)}</h3>
      {trend && <span className={styles.trend}>{trend}</span>}
    </article>
  );
}

export default KPICard;
