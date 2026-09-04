import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import axiosClient from "../api/axiosClient";

function Transfer() {
  const [accounts, setAccounts] = useState([]);
  const [fromAccountId, setFromAccountId] = useState("");
  const [toAccountNumber, setToAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    axiosClient
      .get("/accounts")
      .then((res) => {
        setAccounts(res.data.accounts);
        if (res.data.accounts.length > 0) {
          setFromAccountId(res.data.accounts[0].account_id);
        }
      })
      .catch(() => setError("Could not load accounts"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await axiosClient.post("/accounts/transfer", {
        from_account_id: Number(fromAccountId),
        to_account_number: toAccountNumber,
        amount: Number(amount),
      });
      setMessage(`${res.data.message} — New balance: ${res.data.new_balance}`);
      setAmount("");
      setToAccountNumber("");
    } catch (err) {
      setError(err.response?.data?.message || "Transfer failed");
    }
  };

  return (
    <DashboardLayout>
      <div className="page-heading"><div><span className="eyebrow">Move money</span><h1 className="page-title">Make a transfer</h1><p className="page-subtitle">Send money securely to another Moneta account.</p></div></div>

      <form onSubmit={handleSubmit} className="money-form surface">
        <div>
          <label className="field-label">From account</label>
          <select
            value={fromAccountId}
            onChange={(e) => setFromAccountId(e.target.value)}
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
          <label className="field-label">To account number</label>
          <input
            type="text"
            value={toAccountNumber}
            onChange={(e) => setToAccountNumber(e.target.value)}
            placeholder="ACC..."
            className="field-control"
            required
          />
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
          Transfer
        </button>
      </form>

      {message && <p className="feedback-success">{message}</p>}
      {error && <p className="feedback-error">{error}</p>}
    </DashboardLayout>
  );
}

export default Transfer;