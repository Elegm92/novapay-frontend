import { useState } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { useNavigate } from "react-router-dom";
import styles from "./LoginForm.module.css";
import sentinelLogo from "../../assets/sentinel-logo.png";

function LoginForm() {
  const { login, error, setError } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Orbs */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.orb3} />

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerBrand}>
          
          <span className={styles.headerTitle}>Sentinel NovaPay</span>
        </div>
      </header>

      {/* Main */}
      <main className={styles.main}>
        <div className={styles.wrapper}>
          {/* Portal header */}
          <div className={styles.portalHeader}>
            <img
              src={sentinelLogo}
              alt="Sentinel Logo"
              style={{ width: 120, height: 120, objectFit: "contain" }}
            />
            <h1 className={styles.portalTitle}>Portal de acceso</h1>
          </div>

          {/* Card */}
          <div className={styles.card}>
            <div className={styles.cardGlow} />

            <form className={styles.form} onSubmit={handleSubmit}>
              {/* Email */}
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="email">
                  Usuario
                </label>
                <div className={styles.inputWrapper}>
                  <span className={`material-icons ${styles.inputIcon}`}>
                    mail
                  </span>
                  <input
                    className={styles.input}
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="mail@example.com"
                    required
                    autoFocus
                  />
                </div>
              </div>

              {/* Password */}
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="password">
                  Contraseña
                </label>
                <div className={styles.inputWrapper}>
                  <span className={`material-icons ${styles.inputIcon}`}>
                    key
                  </span>
                  <input
                    className={`${styles.input} ${styles.inputMono}`}
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    required
                  />
                  <button
                    type="button"
                    className={styles.toggleBtn}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-icons">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <button
                className={styles.submitBtn}
                type="submit"
                disabled={loading}
              >
                {loading ? "Authenticating..." : "Iniciar Sesion"}
                {!loading && (
                  <span className="material-icons">arrow_forward</span>
                )}
              </button>
            </form>

            {/* System message */}
            <div className={styles.systemMsg}>
              <span
                className="material-icons"
                style={{
                  fontSize: 16,
                  color: "var(--color-primary)",
                  marginTop: 2,
                }}
              >
                info
              </span>
              <p className={styles.systemMsgText}>
                El acceso está registrado y auditado. Múltiples intentos
                fallidos resultarán en el bloqueo temporal de la cuenta.
              </p>
            </div>
          </div>

          {/* Footer note */}
          <p className={styles.footerNote}>
            Property of Sentinel Global SecOps. Unauthorized use is strictly
            prohibited and subject to legal action under Directive 99-A.
          </p>
        </div>
      </main>
    </div>
  );
}

export default LoginForm;