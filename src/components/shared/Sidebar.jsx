import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import AvatarSelector from "./AvatarSelector.jsx";
import styles from "./Sidebar.module.css";
import { getAvatarUrl } from "../../utils/avatar.js";

function Sidebar({ isOpen, isCollapsed, onClose, onToggleCollapse }) {
  const { user } = useAuth();
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  const tabs = [
    { to: "/dashboard", label: "Home", icon: "grid_view" },
    { to: "/transactions", label: "Transacciones", icon: "receipt_long" },
    { to: "/history", label: "Historial", icon: "history" },
  ];

  return (
    <>
      <aside
        className={`${styles.sidebar} ${isOpen ? styles.open : ""} ${
          isCollapsed ? styles.collapsed : ""
        }`}
      >
        {/* Brand */}
        <section className={styles.brand}>
          <section className={styles.logo}>
            <span className="material-icons">security</span>
          </section>
          {!isCollapsed && (
            <section className={styles.brandText}>
              <h1>Sentinel NovaPay</h1>
              <p>Centro de Detección de Fraude</p>
            </section>
          )}
        </section>

        {/* Nav */}
        <nav className={styles.nav}>
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ""} ${
                  isCollapsed ? styles.navItemCollapsed : ""
                }`
              }
              onClick={onClose}
              title={isCollapsed ? tab.label : ""}
            >
              <span className="material-icons">{tab.icon}</span>
              {!isCollapsed && <span>{tab.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Toggle collapse — solo desktop */}
        <button
          className={styles.collapseBtn}
          onClick={onToggleCollapse}
          title={isCollapsed ? "Expandir menú" : "Colapsar menú"}
        >
          <span className="material-icons">
            {isCollapsed ? "chevron_right" : "chevron_left"}
          </span>
        </button>

        {/* Footer */}
        <footer className={styles.footer}>
          <section
            className={`${styles.userProfile} ${
              isCollapsed ? styles.userProfileCollapsed : ""
            }`}
            onClick={() => setShowAvatarSelector(true)}
            title={isCollapsed ? user?.name || "Analista" : "Cambiar avatar"}
          >
            <img
              src={getAvatarUrl(user?.avatar_style, user?.email)}
              alt="Avatar"
              className={styles.avatar}
            />
            {!isCollapsed && (
              <section className={styles.userInfo}>
                <p className={styles.userName}>{user?.name || "Analista"}</p>
                <p className={styles.userRole}>
                  {user?.role === "analyst" ? "Analista" : user?.role || "Analista"}
                </p>
              </section>
            )}
          </section>
        </footer>
      </aside>

      {showAvatarSelector && (
        <AvatarSelector onClose={() => setShowAvatarSelector(false)} />
      )}
    </>
  );
}

export default Sidebar;