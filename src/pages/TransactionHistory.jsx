import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import axiosClient from "../api/axiosClient";

function TransactionHistory() {
  const [accounts, setAccounts] = useState([]);
  const [accountId, setAccountId] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient
      .get("/accounts")
      .then((res) => {
        setAccounts(res.data.accounts);
        if (res.data.accounts.length > 0) {
          setAccountId(res.data.accounts[0].account_id);
        }
      })
      .catch(() => setError("Could not load accounts"));
  }, []);

  useEffect(() => {
    if (!accountId) return;
    axiosClient
      .get(`/accounts/${accountId}/transactions`)
      .then((res) => {
        setTransactions(res.data.transactions);
        setError("");
      })
      .catch(() => setError("Could not load transactions"))
      .finally(() => setLoading(false));
  }, [accountId]);

  const getTransactionIcon = (type) => {
    if (type.includes("withdraw")) return "↓";
    if (type.includes("transfer")) return "↔";
    return "↑";
  };

  return (
    <DashboardLayout>
      <div className="page-heading"><div><span className="eyebrow">Account activity</span><h1 className="page-title">Transaction history</h1><p className="page-subtitle">Review activity across your Moneta accounts.</p></div></div>

      <div className="filter-row">
        <label className="field-label">Account
        <select
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          className="field-control"
        >
          {accounts.map((acc) => (
            <option key={acc.account_id} value={acc.account_id}>
              {acc.account_number} — {acc.currency} {acc.balance}
            </option>
          ))}
        </select></label>
      </div>

      {loading && <div className="surface loading-panel">Loading transactions...</div>}
      {error && <p className="feedback-error">Unable to load transactions.</p>}

      {!loading && !error && transactions.length === 0 && (
        <div className="surface empty-panel">No transactions yet. Your account activity will appear here.</div>
      )}

      {!loading && !error && transactions.length > 0 && (
        <div className="transaction-table-wrap surface">
          <table className="transaction-table">
            <thead>
              <tr>
                <th scope="col">Type</th>
                <th scope="col">Reference number</th>
                <th scope="col">Date</th>
                <th scope="col" className="transaction-table-amount">Amount</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => {
                const transactionType = String(txn.type || txn.type_name || "").toLowerCase();
                const isCredit = transactionType.includes("deposit") ||
                  (transactionType.includes("transfer") && Number(txn.destination_account_id) === Number(accountId));
                const amount = Math.abs(Number(txn.amount)).toFixed(2);
                const amountClass = isCredit ? "is-credit" : "is-debit";

                return (
                  <tr key={txn.transaction_id}>
                    <td>
                      <span
                        className={`transaction-icon ${amountClass}`}
                        title={transactionType || "Transaction"}
                        aria-label={transactionType || "Transaction"}
                      >
                        {getTransactionIcon(transactionType)}
                      </span>
                    </td>
                    <td className="transaction-reference">{txn.reference_number}</td>
                    <td className="transaction-date">{new Date(txn.created_at).toLocaleString()}</td>
                    <td className={`transaction-table-amount ${amountClass}`}>
                      {isCredit ? "+" : "-"}NPR {amount}
                    </td>
                    <td>
                      <span className={`status-badge ${txn.status === "completed" ? "status-active" : "status-muted"}`}>
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}

export default TransactionHistory;