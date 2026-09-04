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

      <div className="transaction-list surface">
        {transactions.map((txn) => (
          <div
            key={txn.transaction_id}
            className="transaction-row"
          >
            <div>
              <p className="transaction-reference">{txn.reference_number}</p>
              <p className="transaction-date">
                {new Date(txn.created_at).toLocaleString()}
              </p>
            </div>
            <div className="transaction-amount">
              <p>{txn.amount}</p>
              <span>{txn.status}</span>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default TransactionHistory;