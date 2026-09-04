import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import axiosClient from "../api/axiosClient";

function Withdraw() {
  const [accounts, setAccounts] = useState([]);
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await axiosClient.post("/accounts/withdraw", {
        account_id: Number(accountId),
        amount: Number(amount),
      });
      setMessage(`${res.data.message} — New balance: ${res.data.new_balance}`);
      setAmount("");
    } catch (err) {
      setError(err.response?.data?.message || "Withdrawal failed");
    }
  };

  return (
    <DashboardLayout>
      <div className="page-heading"><div><span className="eyebrow">Move money</span><h1 className="page-title">Withdraw money</h1><p className="page-subtitle">Move available funds out of your Moneta account.</p></div></div>

      <form onSubmit={handleSubmit} className="money-form surface">
        <div>
          <label className="field-label">From account</label>
          <select
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="field-control"
            required
          >
            {accounts.map((acc) => (
              <option key={acc.account_id} value={acc.account_id}>
                {acc.account_number} ({acc.status}) — {acc.currency} {acc.balance}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="field-label">Amount</label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="field-control"
            required
          />
        </div>

        <button
          type="submit"
          className="button-primary"
        >
          Withdraw
        </button>
      </form>

      {message && <p className="feedback-success">{message}</p>}
      {error && <p className="feedback-error">{error}</p>}
    </DashboardLayout>
  );
}

export default Withdraw;