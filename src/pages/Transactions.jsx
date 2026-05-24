import { useState, useEffect } from "react";
import { getQueue } from "../services/api.js";
import Layout from "../components/shared/Layout.jsx";
import TransactionTable from "../components/transactions/TransactionTable.jsx";
import TransactionDetailPanel from "../components/transactions/TransactionDetailPanel.jsx";
import styles from "./Transactions.module.css";

const LIMIT = 50;

const Transactions = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ risk_level: "", type: "" });
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchQueue();
  }, [filters, offset]);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getQueue({
        risk_level: filters.risk_level || undefined,
        type: filters.type || undefined,
        limit: LIMIT,
        offset,
      });
      setTransactions(data.queue || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Error fetching queue:", error);
      setError("Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setOffset(0);
    fetchQueue();
  };

  const handleExportCSV = () => {
    if (!transactions.length) return;

    const headers = [
      "transaction_id",
      "amount",
      "type",
      "nameOrig",
      "nameDest",
      "oldbalanceOrg",
      "newbalanceOrig",
      "oldbalanceDest",
      "newbalanceDest",
      "ip_country",
      "merchant_category",
      "fraud_probability",
      "risk_level",
      "decision",
      "status",
      "timestamp",
    ];

    const rows = transactions.map((tx) =>
      headers.map((h) => tx[h] ?? "").join(","),
    );

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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

  const visibleTransactions = transactions.filter((tx) =>
    activeTab === "pending"
      ? tx.status === "pending"
      : activeTab === "blocked"
        ? tx.decision?.toLowerCase() === "block"
        : activeTab === "legitimate"
          ? tx.decision?.toLowerCase() === "allow"
          : true,
  );

  const totalPages = Math.ceil(total / LIMIT);
  const currentPage = Math.floor(offset / LIMIT) + 1;

  return (
    <Layout>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.pageHeader}>
          <div className={styles.headerText}>
            <h2>Transaction Monitoring</h2>
            <p>Analyze and resolve flagged financial activities.</p>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.refreshBtn} onClick={handleRefresh}>
              <span className="material-icons">refresh</span>
              Refresh Feed
            </button>
            <button
              className={styles.exportBtn}
              onClick={handleExportCSV}
              disabled={!transactions.length}
            >
              <span className="material-icons">download</span>
              Export CSV
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {[
            {
              key: "pending",
              label: "Pending",
              filter: (tx) => tx.status === "pending",
            },
            {
              key: "blocked",
              label: "Blocked",
              filter: (tx) => tx.decision?.toLowerCase() === "block",
            },
            {
              key: "legitimate",
              label: "Legitimate",
              filter: (tx) => tx.decision?.toLowerCase() === "allow",
            },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`${styles.tab} ${activeTab === tab.key ? styles.activeTab : ""}`}
              onClick={() => {
                setActiveTab(tab.key);
                setSelectedTransaction(null);
              }}
            >
              {tab.label}
              <span className={styles.tabBadge}>
                {transactions.filter(tab.filter).length}
              </span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label>Risk Level</label>
            <select
              value={filters.risk_level}
              onChange={(e) => {
                setOffset(0);
                setFilters({ ...filters, risk_level: e.target.value });
              }}
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
              onChange={(e) => {
                setOffset(0);
                setFilters({ ...filters, type: e.target.value });
              }}
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

        {/* Tabla + Panel */}
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

            {/* Paginación */}
            {total > LIMIT && (
              <div className={styles.pagination}>
                <button
                  className={styles.pageBtn}
                  onClick={() => setOffset(Math.max(0, offset - LIMIT))}
                  disabled={offset === 0}
                >
                  <span className="material-icons">chevron_left</span>
                </button>
                <span className={styles.pageInfo}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className={styles.pageBtn}
                  onClick={() => setOffset(offset + LIMIT)}
                  disabled={offset + LIMIT >= total}
                >
                  <span className="material-icons">chevron_right</span>
                </button>
              </div>
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
