import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import axiosClient from "../../api/axiosClient";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient
      .get("/admin/users")
      .then((res) => setUsers(res.data.users))
      .catch(() => setError("Could not load users — make sure you're logged in as an Admin"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="page-heading"><div><span className="eyebrow">Administration</span><h1 className="page-title">Users</h1><p className="page-subtitle">Review registered Moneta customers and account access.</p></div></div>

      {loading && <div className="surface loading-panel">Loading users...</div>}
      {error && <p className="feedback-error">Unable to load users. Check your admin access.</p>}

      {!loading && !error && (
        <div className="admin-list surface">
          {users.map((u) => (
            <div
              key={u.user_id}
              className="admin-row"
            >
              <span>{u.full_name} ({u.email})</span>
              <span className={`status-badge ${u.is_active ? "status-active" : "status-muted"}`}>
                {u.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default AdminUsers;