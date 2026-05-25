import { useState } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { useNavigate } from "react-router-dom";
import AvatarSelector from "./AvatarSelector.jsx";
import styles from "./Header.module.css";
import { getAvatarUrl } from "../../utils/avatar.js";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
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
              src={getAvatarUrl(user?.avatar_style, user?.email)}
              alt="Avatar"
              className={styles.avatar}
              onClick={() => setShowAvatarSelector(true)}
              title="Change avatar"
              style={{ cursor: "pointer" }}
            />
          </section>
          <button className={styles.logout} onClick={handleLogout}>
            <span className="material-icons">logout</span>
            <span>Logout</span>
          </button>
        </section>
      </header>
      {showAvatarSelector && (
        <AvatarSelector onClose={() => setShowAvatarSelector(false)} />
      )}
    </>
  );
}

export default Header;
