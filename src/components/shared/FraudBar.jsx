import styles from "./FraudBar.module.css";

function FraudBar({ value }) {
  const percentage = value ? (value * 100).toFixed(1) : 0;

  const getColor = () => {
    if (value >= 0.7) return styles.high;
    if (value >= 0.4) return styles.medium;
    return styles.low;
  };

  return (
    <figure className={styles.wrapper}>
      <section className={styles.bar}>
        <section
          className={`${styles.fill} ${getColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </section>
      <figcaption className={styles.label}>{percentage}%</figcaption>
    </figure>
  );
}

export default FraudBar;
