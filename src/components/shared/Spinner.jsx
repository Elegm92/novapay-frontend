import styles from "./Spinner.module.css";

function Spinner({ text = "Cargando..." }) {
  return (
    <div className={styles.containerLoad}>
      <div className={styles.spinner} />
    </div>
  );
}

export default Spinner;
