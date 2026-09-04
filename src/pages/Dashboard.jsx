import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/dashboard/StatCard";
import AccountCard from "../components/dashboard/AccountCard";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/useAuth";

function Dashboard() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient
      .get("/accounts")
      .then((res) => setAccounts(res.data.accounts))
      .catch(() => setError("Could not load account data"))
      .finally(() => setLoading(false));
  }, []);

  const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);
  const activeCount = accounts.filter((acc) => acc.status === "active").length;

  return (
    <DashboardLayout>
      <div className="page-heading">
        <div>
          <span className="eyebrow">Overview</span>
          <h1 className="page-title">Good morning{user?.full_name ? `, ${user.full_name.split(" ")[0]}` : ""}.</h1>
          <p className="page-subtitle">Here is your financial overview.</p>
        </div>
        <div className="quick-actions">
          <a href="/deposit" className="button-secondary">Deposit</a>
          <a href="/transfer" className="button-primary">Make a transfer</a>
        </div>
      </div>

      {loading && <div className="surface loading-panel">Loading your accounts...</div>}
      {error && <div className="feedback-error">Unable to load your accounts. Please try again.</div>}

      {!loading && !error && (
        <>
          <div className="dashboard-summary">
            <section className="balance-feature surface">
              <div><span className="eyebrow">Total balance</span><p className="balance-amount">NPR {totalBalance.toFixed(2)}</p><p className="balance-caption">Available across {accounts.length} account{accounts.length === 1 ? "" : "s"}</p></div>
              <span className="balance-seal">M</span>
            </section>
            <div className="stat-grid">
              <StatCard label="Accounts" value={accounts.length} detail="All accounts" />
              <StatCard label="Active accounts" value={activeCount} detail="In good standing" />
            </div>
          </div>

          <div className="section-heading"><div><span className="eyebrow">Your money</span><h2>Accounts</h2></div><span className="section-count">{accounts.length} total</span></div>
          <div className="account-grid">
            {accounts.map((acc) => (
              <AccountCard
                key={acc.account_id}
                accountNumber={acc.account_number}
                status={acc.status}
                balance={acc.balance}
                currency={acc.currency}
              />
            ))}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

export default Dashboard;