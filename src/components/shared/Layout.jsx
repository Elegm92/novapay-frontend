import { useState, useEffect } from "react";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import styles from "./Layout.module.css";

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (window.innerWidth >= 1024) setSidebarOpen(true);
  }, []);

  const toggleMobile = () => setSidebarOpen((prev) => !prev);
  const closeMobile = () => setSidebarOpen(false);
  const toggleCollapse = () => setSidebarCollapsed((prev) => !prev);

  return (
    <section className={styles.layout}>
      <Sidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={closeMobile}
        onToggleCollapse={toggleCollapse}
      />

      {/* Overlay solo mobile */}
      {sidebarOpen && <div className={styles.overlay} onClick={closeMobile} />}

      <section
        className={`${styles.main} ${
          sidebarOpen
            ? sidebarCollapsed
              ? styles.mainCollapsed
              : styles.mainExpanded
            : ""
        }`}
      >
        <Header
          onToggleSidebar={toggleMobile}
          sidebarOpen={sidebarOpen}
          isCollapsed={sidebarCollapsed}
        />
        <main className={styles.content}>{children}</main>
      </section>
    </section>
  );
}

export default Layout;
