import { useState } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { useNavigate } from "react-router-dom";
import AvatarSelector from "./AvatarSelector.jsx";
import styles from "./Header.module.css";
import { getAvatarUrl } from "../../utils/avatar.js";

function Header({ onToggleSidebar, sidebarOpen, isCollapsed }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <header
        className={`${styles.header} ${isCollapsed ? styles.headerCollapsed : ""}`}
      >
        <button
          className={styles.hamburger}
          onClick={onToggleSidebar}
          title={sidebarOpen ? "Cerrar Menú" : "Abrir Menú"}
        >
          <span className="material-icons">
            {sidebarOpen ? "close" : "menu"}
          </span>
        </button>

        <section className={styles.actions}>
          <section className={styles.user}>
            <section className={styles.userText}>
              <p className={styles.name}>{user?.name || "Analista"}</p>
              <p className={styles.role}>
                {user?.role === "analyst"
                  ? "Analista"
                  : user?.role || "Analista"}
              </p>
            </section>
            <img
              src={getAvatarUrl(user?.avatar_style, user?.email)}
              alt="Avatar"
              className={styles.avatar}
              onClick={() => setShowAvatarSelector(true)}
              title="Cambiar Avatar"
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
