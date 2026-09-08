import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/dashboard/StatCard";
import AccountCard from "../components/dashboard/AccountCard";
import BalanceChart from "../components/dashboard/BalanceChart";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/useAuth";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient
      .get("/accounts")
      .then((res) => setAccounts(res.data.accounts))
      .catch(() => setError("Could not load account data"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const fetchAllTransactions = async () => {
      try {
        const allTransactions = [];
        for (const account of accounts) {
          try {
            const res = await axiosClient.get(`/accounts/${account.account_id}/transactions`);
            const txns = res.data.transactions || [];
            allTransactions.push(...txns.map((txn) => ({ ...txn, account_id: account.account_id })));
          } catch (err) {
            console.log(`Could not fetch transactions for account ${account.account_id}`);
          }
        }
        // Sort by date descending and take first 5
        const sorted = allTransactions.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
        setTransactions(sorted.slice(0, 5));
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };

    if (accounts.length > 0) {
      fetchAllTransactions();
    }
  }, [accounts]);

  const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);
  const activeCount = accounts.filter((acc) => acc.status === "active").length;

  const getTransactionIcon = (type) => {
    if (type.includes("withdraw")) return "↓";
    if (type.includes("transfer")) return "↔";
    return "↑";
  };

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
            <div className="balance-column">
              <section className="balance-feature surface">
                <div><span className="eyebrow">Total balance</span><p className="balance-amount">NPR {totalBalance.toFixed(2)}</p><p className="balance-caption">Available across {accounts.length} account{accounts.length === 1 ? "" : "s"}</p></div>
                <span className="balance-seal">M</span>
              </section>
              <div className="dashboard-actions">
                <button onClick={() => navigate("/deposit")} className="button-secondary">Deposit</button>
                <button onClick={() => navigate("/withdraw")} className="button-primary">Withdraw</button>
                <button onClick={() => navigate("/transfer")} className="button-primary">Transfer</button>
                <button onClick={() => navigate("/beneficiaries")} className="button-primary">Beneficiaries</button>
              </div>
            </div>
            <div className="stat-grid">
              <StatCard label="Accounts" value={accounts.length} detail="All accounts" />
              <StatCard label="Active accounts" value={activeCount} detail="In good standing" />
            </div>
          </div>

          <BalanceChart accounts={accounts} />

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

          {transactions.length > 0 && (
            <>
              <div className="section-heading" style={{ marginTop: "44px" }}>
                <div>
                  <span className="eyebrow">Account activity</span>
                  <h2>Recent activity</h2>
                </div>
                <span className="section-count" style={{ cursor: "pointer", color: "var(--copper)" }} onClick={() => navigate("/transactions")}>
                  View all →
                </span>
              </div>
              <div className="transaction-list surface">
                {transactions.map((txn) => {
                  const transactionType = String(txn.type || txn.type_name || "").toLowerCase();
                  const isCredit = transactionType.includes("deposit") ||
                    (transactionType.includes("transfer") && Number(txn.destination_account_id) === Number(txn.account_id));
                  const amount = Math.abs(Number(txn.amount)).toFixed(2);
                  return (
                    <div key={txn.transaction_id} className="transaction-row">
                      <div className="transaction-summary">
                        <span className={`transaction-icon ${isCredit ? "is-credit" : "is-debit"}`}>
                          {getTransactionIcon(transactionType)}
                        </span>
                        <div>
                          <p className="transaction-reference">{txn.reference_number}</p>
                          <p className="transaction-date">
                            {new Date(txn.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className={`transaction-amount ${isCredit ? "is-credit" : "is-debit"}`}>
                        <p>
                          {isCredit ? "+" : "-"}NPR {amount}
                        </p>
                        <span>{txn.status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}
    </DashboardLayout>
  );
}

export default Dashboard;