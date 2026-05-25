import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import AvatarSelector from "./AvatarSelector.jsx";
import styles from "./Sidebar.module.css";
import { getAvatarUrl } from "../../utils/avatar.js";

function Sidebar() {
  const { user } = useAuth();
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  const tabs = [
    { to: "/dashboard", label: "Dashboard", icon: "grid_view" },
    { to: "/transactions", label: "Transactions", icon: "receipt_long" },
    { to: "/history", label: "History", icon: "history" },
  ];

  return (
    <>
      <aside className={styles.sidebar}>
        <section className={styles.brand}>
          <section className={styles.logo}>
            <span className="material-icons">security</span>
          </section>
          <section className={styles.brandText}>
            <h1>Sentinel NovaPay</h1>
            <p>Fraud Analysis Unit</p>
          </section>
        </section>
        <nav className={styles.nav}>
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ""}`
              }
            >
              <span className="material-icons">{tab.icon}</span>
              <span>{tab.label}</span>
            </NavLink>
          ))}
        </nav>
        <footer className={styles.footer}>
          <section
            className={styles.userProfile}
            onClick={() => setShowAvatarSelector(true)}
            title="Change avatar"
          >
            <img
              src={getAvatarUrl(user?.avatar_style, user?.email)}
              alt="Avatar"
              className={styles.avatar}
            />
            <section className={styles.userInfo}>
              <p className={styles.userName}>{user?.name || "Analyst"}</p>
              <p className={styles.userRole}>{user?.role || "analyst"}</p>
            </section>
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
