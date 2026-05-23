import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import styles from "./Layout.module.css";

function Layout({ children }) {
  return (
    <section className={styles.layout}>
      <Sidebar />
      <section className={styles.main}>
        <Header />
        <main className={styles.content}>{children}</main>
      </section>
    </section>
  );
}

export default Layout;
