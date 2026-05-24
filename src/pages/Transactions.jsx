import { useState, useEffect } from "react";
import { getQueue } from "../services/api.js";
import Layout from "../components/shared/Layout.jsx";
import TransactionTable from "../components/transactions/TransactionTable.jsx";
import TransactionDetailPanel from "../components/transactions/TransactionDetailPanel.jsx";
import styles from "./Transactions.module.css";

const Transactions = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    risk_level: "",
    type: "",
  });
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    fetchQueue();
  }, [filters]);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getQueue({
        risk_level: filters.risk_level || undefined,
        limit: 50,
      });
      setTransactions(data.queue || []);
    } catch (error) {
      console.error("Error fetching queue:", error);
      setError("Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (transaction) => {
    setSelectedTransaction(
      selectedTransaction?.transaction_id === transaction.transaction_id
        ? null
        : transaction,
    );
  };

  const handleVerdictClose = () => {
    setSelectedTransaction(null);
    fetchQueue();
  };

  const visibleTransactions = transactions.filter((tx) => {
    const matchesType = filters.type ? tx.type === filters.type : true;

    const matchesTab =
      activeTab === "pending"
        ? tx.status === "pending"
        : activeTab === "blocked"
          ? tx.decision?.toLowerCase() === "block"
          : activeTab === "legitimate"
            ? tx.decision?.toLowerCase() === "allow"
            : true;

    return matchesType && matchesTab;
  });

  return (
    <Layout>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.pageHeader}>
          <h2>Transaction Monitoring</h2>
          <p>Analyze and resolve flagged financial activities.</p>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === "pending" ? styles.activeTab : ""}`}
            onClick={() => {
              setActiveTab("pending");
              setSelectedTransaction(null);
            }}
          >
            Pending
            <span className={styles.tabBadge}>
              {transactions.filter((tx) => tx.status === "pending").length}
            </span>
          </button>

          <button
            className={`${styles.tab} ${activeTab === "blocked" ? styles.activeTab : ""}`}
            onClick={() => {
              setActiveTab("blocked");
              setSelectedTransaction(null);
            }}
          >
            Blocked
            <span className={styles.tabBadge}>
              {
                transactions.filter(
                  (tx) => tx.decision?.toLowerCase() === "block",
                ).length
              }
            </span>
          </button>

          <button
            className={`${styles.tab} ${activeTab === "legitimate" ? styles.activeTab : ""}`}
            onClick={() => {
              setActiveTab("legitimate");
              setSelectedTransaction(null);
            }}
          >
            Legitimate
            <span className={styles.tabBadge}>
              {
                transactions.filter(
                  (tx) => tx.decision?.toLowerCase() === "allow",
                ).length
              }
            </span>
          </button>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label>Risk Level</label>
            <select
              value={filters.risk_level}
              onChange={(e) =>
                setFilters({ ...filters, risk_level: e.target.value })
              }
            >
              <option value="">All Risks</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label>Transaction Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="">All Types</option>
              <option value="TRANSFER">TRANSFER</option>
              <option value="CASH_OUT">CASH_OUT</option>
              <option value="PAYMENT">PAYMENT</option>
              <option value="DEBIT">DEBIT</option>
              <option value="CASH_IN">CASH_IN</option>
            </select>
          </div>
        </div>

        {/* Tabla + Panel de detalle */}
        {error && <div className={styles.error}>{error}</div>}
        {loading ? (
          <div className={styles.loading}>Loading transactions...</div>
        ) : (
          <>
            {visibleTransactions.length === 0 ? (
              <div className={styles.emptyState}>No transactions found.</div>
            ) : (
              <TransactionTable
                transactions={visibleTransactions}
                onRowClick={handleRowClick}
                expandedId={selectedTransaction?.transaction_id}
              />
            )}

            {selectedTransaction && (
              <TransactionDetailPanel
                transaction={selectedTransaction}
                onClose={handleVerdictClose}
              />
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Transactions;
