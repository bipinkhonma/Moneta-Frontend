import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import axiosClient from "../../api/axiosClient";

function AdminAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient
      .get("/admin/accounts")
      .then((res) => setAccounts(res.data.accounts))
      .catch(() => setError("Could not load accounts — make sure you're logged in as an Admin"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="page-heading"><div><span className="eyebrow">Administration</span><h1 className="page-title">Accounts</h1><p className="page-subtitle">Monitor account balances and current standing.</p></div></div>

      {loading && <div className="surface loading-panel">Loading accounts...</div>}
      {error && <p className="feedback-error">Unable to load accounts. Check your admin access.</p>}

      {!loading && !error && (
        <div className="admin-list surface">
          {accounts.map((acc) => (
            <div
              key={acc.account_id}
              className="admin-row"
            >
              <span>{acc.account_number} — {acc.currency} {acc.balance}</span>
              <strong className={`status-badge ${acc.status === "active" ? "status-active" : "status-muted"}`}>{acc.status}</strong>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default AdminAccounts;