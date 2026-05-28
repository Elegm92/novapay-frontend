import { useState } from "react";
import { createDecision } from "../../services/api.js";
import Swal from "sweetalert2";
import styles from "./VerdictForm.module.css";

const VerdictForm = ({ transaction, onClose }) => {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerdict = async (verdict) => {
    if (!notes.trim()) {
      setError("Las notas son obligatorias antes de enviar un veredicto.");
      return;
    }
    if (!transaction?.transaction_id) {
      setError("ID de transacción no disponible.");
      return;
    }

    const isLegitimate = verdict === "legitimate";

    const result = await Swal.fire({
      title: isLegitimate ? "¿Aprobar transacción?" : "¿Confirmar fraude?",
      text: isLegitimate
        ? "Marcarás esta transacción como legítima. Esta acción quedará registrada."
        : "Marcarás esta transacción como fraudulenta. Esta acción quedará registrada.",
      icon: isLegitimate ? "success" : "warning",
      showCancelButton: true,
      confirmButtonText: isLegitimate ? "Sí, aprobar" : "Sí, bloquear",
      cancelButtonText: "Cancelar",
      confirmButtonColor: isLegitimate ? "#006c49" : "#ef4444",
      cancelButtonColor: "#1f2937",
      background: "#111827",
      color: "#eef0ff",
      iconColor: isLegitimate ? "#006c49" : "#ef4444",
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      setError("");

      await createDecision({
        transaction_id: transaction.transaction_id,
        verdict,
        notes,
      });

      await Swal.fire({
        title: isLegitimate ? "Transacción aprobada" : "Fraude confirmado",
        text: isLegitimate
          ? "La transacción se ha marcado como legítima correctamente."
          : "La transacción se ha marcado como fraudulenta correctamente.",
        icon: "success",
        confirmButtonColor: "#06B6D4",
        background: "#111827",
        color: "#EEF0FF",
      });
      
      onClose();
    } catch (error) {
      console.error("Error submitting verdict:", error);
      setError("Error al enviar el veredicto. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.form}>
      <h3>Veredicto del Analista</h3>

      <div className={styles.inputGroup}>
        <label>
          Notas del analista <span className={styles.required}>*</span>
        </label>
        <textarea
          className={styles.textarea}
          placeholder="Explica tu decisión antes de confirmar (obligatorio)..."
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
          {loading ? "Enviando..." : "Confirmar Fraude"}
        </button>
        <button
          className={styles.legitimateBtn}
          onClick={() => handleVerdict("legitimate")}
          disabled={loading || !notes.trim()}
        >
          {loading ? "Enviando..." : "Aprobar Legítima"}
        </button>
      </div>
    </div>
  );
};

export default VerdictForm;