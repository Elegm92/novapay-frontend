import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import styles from "./Sidebar.module.css";

function Sidebar() {
  const { user } = useAuth();

  const tabs = [
    { to: "/dashboard", label: "Dashboard", icon: "grid_view" },
    { to: "/transactions", label: "Transactions", icon: "receipt_long" },
    { to: "/history", label: "History", icon: "history" },
  ];

  return (
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
        <section className={styles.userProfile}>
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
            alt="User"
          />
          <section className={styles.userInfo}>
            <p className={styles.userName}>{user?.name || "Analyst"}</p>
            <p className={styles.userRole}>{user?.role || "analyst"}</p>
          </section>
        </section>
      </footer>
    </aside>
  );
}

export default Sidebar;
