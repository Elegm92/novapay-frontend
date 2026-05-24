import { useState } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { useNavigate } from "react-router-dom";
import styles from "./LoginForm.module.css";

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
      <div className={styles.wrapper}>
        {/* Brand */}
        <div className={styles.brand}>
          <h1 className={styles.brandTitle}>Sentinel NovaPay</h1>
          <p className={styles.brandSub}>Fraud Analysis Unit</p>
        </div>

        {/* Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Portal Access</h2>
            <p className={styles.cardSubtitle}>
              Enter your credentials to access the secure surveillance
              dashboard.
            </p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {/* Email */}
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="email">
                Work Email
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
                  placeholder="analyst@novapay.com"
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div className={styles.fieldGroup}>
              <div className={styles.fieldHeader}>
                <label className={styles.label} htmlFor="password">
                  Security Key
                </label>
              </div>
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
              {loading ? "Authenticating..." : "Sign In"}
              {!loading && (
                <span className="material-icons">arrow_forward</span>
              )}
            </button>
          </form>

          <div className={styles.cardFooter}>
            <p>
              Authorized use only. All activities are monitored and logged by
              the Sentinel NovaPay security protocols.
            </p>
          </div>
        </div>

        {/* Status bar */}
        <div className={styles.statusBar}>
          <div className={styles.statusIndicator}>
            <span className={styles.statusDot} />
            <span className={styles.statusText}>Network Secure</span>
          </div>
          <span className={styles.statusVersion}>v4.2.0-PROD</span>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
