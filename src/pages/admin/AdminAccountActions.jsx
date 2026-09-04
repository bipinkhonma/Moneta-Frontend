import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import axiosClient from "../../api/axiosClient";

function AdminAccountActions() {
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient
      .get("/admin/accounts")
      .then((res) => setAccounts(res.data.accounts))
      .catch(() => setError("Could not load accounts — make sure you're logged in as an Admin"))
      .finally(() => setLoading(false));
  }, []);

  const loadAccounts = () => {
    axiosClient
      .get("/admin/accounts")
      .then((res) => setAccounts(res.data.accounts))
      .catch(() => setError("Could not load accounts — make sure you're logged in as an Admin"));
  };

  const handleStatusChange = async (account_id, status) => {
    setError("");
    setMessage("");
    try {
      const res = await axiosClient.put("/admin/accounts/status", { account_id, status });
      setMessage(res.data.message);
      loadAccounts();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update status");
    }
  };

  return (
    <DashboardLayout>
      <div className="page-heading"><div><span className="eyebrow">Administration</span><h1 className="page-title">Account actions</h1><p className="page-subtitle">Update account status with care and clear visibility.</p></div></div>

      {loading && <div className="surface loading-panel">Loading accounts...</div>}
      {error && <p className="feedback-error">{error}</p>}
      {message && <p className="feedback-success">{message}</p>}

      {!loading && !error && (
        <div className="admin-list surface">
          {accounts.map((acc) => (
            <div
              key={acc.account_id}
              className="admin-row admin-action-row"
            >
              <span>{acc.account_number} — {acc.currency} {acc.balance} — <strong>{acc.status}</strong></span>
              <select
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value) {
                    handleStatusChange(acc.account_id, e.target.value);
                    e.target.value = "";
                  }
                }}
              >
                <option value="" disabled>Change status</option>
                <option value="active">Active</option>
                <option value="frozen">Frozen</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default AdminAccountActions;