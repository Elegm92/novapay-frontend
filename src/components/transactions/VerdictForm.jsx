import { useState } from "react";
import { createDecision } from "../../services/api.js";
import styles from "./VerdictForm.module.css";

const VerdictForm = ({ transaction, onClose }) => {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerdict = async (verdict) => {
    if (!notes.trim()) {
      setError("Notes are mandatory before submitting a verdict.");
      return;
    }
    if (!transaction?.transaction_id) {
      setError("Transaction ID not available.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Guardar en nuestra BD
      await createDecision({
        transaction_id: transaction.transaction_id,
        verdict,
        notes,
      });

      onClose();
    } catch (error) {
      console.error("Error submitting verdict:", error);
      setError("Failed to submit verdict. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.form}>
      <h3>Analyst Verdict</h3>

      <div className={styles.inputGroup}>
        <label>
          Analyst Notes <span className={styles.required}>*</span>
        </label>
        <textarea
          className={styles.textarea}
          placeholder="Explain your decision (Mandatory)..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.buttons}>
        <button
          className={styles.fraudBtn}
          onClick={() => handleVerdict("fraud")}
          disabled={loading || !notes.trim()}
        >
          {loading ? "Submitting..." : "Confirm Fraud"}
        </button>
        <button
          className={styles.legitimateBtn}
          onClick={() => handleVerdict("legitimate")}
          disabled={loading || !notes.trim()}
        >
          {loading ? "Submitting..." : "Approve Legitimate"}
        </button>
      </div>
    </div>
  );
};

export default VerdictForm;
