import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import axiosClient from "../api/axiosClient";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient
      .get("/notifications")
      .then((res) => setNotifications(res.data.notifications))
      .catch(() => setError("Could not load notifications"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="page-heading"><div><span className="eyebrow">Stay informed</span><h1 className="page-title">Notifications</h1><p className="page-subtitle">Important updates from your Moneta account.</p></div></div>

      {loading && <div className="surface loading-panel">Loading notifications...</div>}
      {error && <p className="feedback-error">Unable to load notifications.</p>}

      {!loading && !error && notifications.length === 0 && (
        <div className="surface empty-panel">No notifications yet. You are all caught up.</div>
      )}

      <div className="notification-list">
        {notifications.map((n) => (
          <div
            key={n.notification_id}
            className={`notification-item surface ${n.is_read ? "" : "is-unread"}`}
          >
            <div className="notification-topline">
              <p className="notification-title">{n.title}</p>
              <span className="notification-time">
                {new Date(n.created_at).toLocaleString()}
              </span>
            </div>
            <p className="notification-message">{n.message}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default Notifications;