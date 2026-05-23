import { useAuth } from "../../hooks/useAuth.js";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className={styles.header}>
      <section className={styles.search}>
        <span className="material-icons">search</span>
        <input
          type="text"
          placeholder="Search suspicious case, txn hash, or entity..."
        />
      </section>

      <section className={styles.actions}>
        <button className={styles.iconBtn}>
          <span className="material-icons">notifications</span>
          <span className={styles.badge}></span>
        </button>

        <section className={styles.user}>
          <section className={styles.userText}>
            <p className={styles.name}>{user?.name || "Analyst"}</p>
            <p className={styles.role}>{user?.role || "analyst"}</p>
          </section>
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
            alt="Avatar"
          />
        </section>

        <button className={styles.logout} onClick={handleLogout}>
          <span className="material-icons">logout</span>
          <span>Logout</span>
        </button>
      </section>
    </header>
  );
}

export default Header;
