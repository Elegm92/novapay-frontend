import { useState, useEffect } from "react";
import { getQueue } from "../services/api.js";
import Layout from "../components/shared/Layout.jsx";
import TransactionTable from "../components/transactions/TransactionTable.jsx";
import TransactionDetailPanel from "../components/transactions/TransactionDetailPanel.jsx";
import Spinner from "../components/shared/Spinner.jsx";
import styles from "./Transactions.module.css";
import CustomSelect from "../components/shared/CustomSelect.jsx";

const LIMIT = 50;

const Transactions = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ risk_level: "", type: "" });
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "timestamp",
    direction: "desc",
  });
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
      setTotal(data.total_pending || data.total || 0);
    } catch (error) {
      console.error("Error fetching queue:", error);
      setError("Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setOffset(0);
    setSelectedTransaction(null);
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
    setTimeout(() => {
      document
        .getElementById("detail-panel")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleVerdictClose = () => {
    setSelectedTransaction(null);
    fetchQueue();
  };

  const TABS = [
    {
      key: "pending",
      label: "Pending",
      filter: (tx) =>
        tx.status === "pending" &&
        tx.decision?.toLowerCase() !== "block" &&
        tx.decision?.toLowerCase() !== "allow",
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
  ];

  const visibleTransactions = transactions.filter((tx) => {
    const matchesSearch =
      searchTerm === ""
        ? true
        : [
            tx.transaction_id,
            tx.nameOrig,
            tx.nameDest,
            tx.type,
            tx.ip_country,
            tx.merchant_category,
          ]
            .filter(Boolean)
            .some((value) =>
              value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
            );

    const activeTabDef = TABS.find((t) => t.key === activeTab);
    const matchesTab = activeTabDef ? activeTabDef.filter(tx) : true;

    return matchesSearch && matchesTab;
  });

  const sortedTransactions = [...visibleTransactions].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue == null) return 1;
    if (bValue == null) return -1;
    if (sortConfig.key === "timestamp") {
      return sortConfig.direction === "asc"
        ? new Date(aValue) - new Date(bValue)
        : new Date(bValue) - new Date(aValue);
    }
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
    }
    return sortConfig.direction === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  const totalPages = Math.ceil(total / LIMIT);
  const currentPage = Math.floor(offset / LIMIT) + 1;

  return (
    <Layout>
      <div className={styles.container}>
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

        <div className={styles.tabs}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.tab} ${
                activeTab === tab.key ? styles.activeTab : ""
              }`}
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

        <div className={styles.searchBox}>
          <span className="material-icons">search</span>
          <input
            type="text"
            placeholder="Search by ID, account, type, country or category..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedTransaction(null);
            }}
          />
        </div>

        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label>Risk Level</label>
            <CustomSelect
              value={filters.risk_level}
              onChange={(val) => {
                setFilters({ ...filters, risk_level: val });
                setSelectedTransaction(null);
                setOffset(0);
              }}
              options={[
                { value: "", label: "All Risks" },
                { value: "high", label: "High" },
                { value: "medium", label: "Medium" },
                { value: "low", label: "Low" },
              ]}
            />
          </div>
          <div className={styles.filterGroup}>
            <label>Transaction Type</label>
            <CustomSelect
              value={filters.type}
              onChange={(val) => {
                setFilters({ ...filters, type: val });
                setSelectedTransaction(null);
                setOffset(0);
              }}
              options={[
                { value: "", label: "All Types" },
                { value: "TRANSFER", label: "Transfer" },
                { value: "CASH_OUT", label: "Cash Out" },
                { value: "PAYMENT", label: "Payment" },
                { value: "DEBIT", label: "Debit" },
                { value: "CASH_IN", label: "Cash In" },
              ]}
            />
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {loading ? (
          <Spinner />
        ) : (
          <>
            <TransactionTable
              transactions={sortedTransactions}
              onRowClick={handleRowClick}
              expandedId={selectedTransaction?.transaction_id}
              onSort={handleSort}
              sortConfig={sortConfig}
              activeTab={activeTab}
            />

            {selectedTransaction && (
              <TransactionDetailPanel
                transaction={selectedTransaction}
                onClose={handleVerdictClose}
                isReviewed={activeTab !== "pending"}
              />
            )}

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles.pageBtn}
                  onClick={() => setOffset(offset - LIMIT)}
                  disabled={offset === 0}
                >
                  <span className="material-icons">chevron_left</span>
                </button>
                <span className={styles.pageInfo}>
                  {currentPage} / {totalPages}
                </span>
                <button
                  className={styles.pageBtn}
                  onClick={() => setOffset(offset + LIMIT)}
                  disabled={currentPage >= totalPages}
                >
                  <span className="material-icons">chevron_right</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Transactions;
