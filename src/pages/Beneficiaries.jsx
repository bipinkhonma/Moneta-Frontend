import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import axiosClient from "../api/axiosClient";

function Beneficiaries() {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [form, setForm] = useState({
    beneficiary_account_number: "",
    beneficiary_name: "",
    nickname: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const loadBeneficiaries = () => {
    axiosClient
      .get("/beneficiaries")
      .then((res) => setBeneficiaries(res.data.beneficiaries))
      .catch(() => setError("Could not load beneficiaries"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBeneficiaries();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await axiosClient.post("/beneficiaries", form);
      setMessage("Beneficiary added");
      setForm({ beneficiary_account_number: "", beneficiary_name: "", nickname: "" });
      loadBeneficiaries();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add beneficiary");
    }
  };

  return (
    <DashboardLayout>
      <div className="page-heading"><div><span className="eyebrow">Your network</span><h1 className="page-title">Beneficiaries</h1><p className="page-subtitle">Save trusted accounts for faster transfers.</p></div></div>

      <form onSubmit={handleSubmit} className="money-form surface beneficiary-form">
        <div>
          <label className="field-label">Account number</label>
          <input
            type="text"
            name="beneficiary_account_number"
            value={form.beneficiary_account_number}
            onChange={handleChange}
            placeholder="ACC..."
            className="field-control"
            required
          />
        </div>

        <div>
          <label className="field-label">Name</label>
          <input
            type="text"
            name="beneficiary_name"
            value={form.beneficiary_name}
            onChange={handleChange}
            required
            className="field-control"
          />
        </div>

        <div>
          <label className="field-label">Nickname (optional)</label>
          <input
            type="text"
            name="nickname"
            value={form.nickname}
            onChange={handleChange}
            className="field-control"
          />
        </div>

        <button type="submit" className="button-primary">Add beneficiary</button>
      </form>

      {message && <p className="feedback-success">{message}</p>}
      {error && <p className="feedback-error">{error}</p>}

      <div className="section-heading beneficiary-heading"><div><span className="eyebrow">Saved</span><h2>Beneficiary list</h2></div></div>
      {loading && <div className="surface loading-panel">Loading beneficiaries...</div>}

      {!loading && beneficiaries.length === 0 && (
        <div className="surface empty-panel">No beneficiaries added yet.</div>
      )}

      <div className="beneficiary-list">
        {beneficiaries.map((b) => (
          <div
            key={b.beneficiary_id}
            className="beneficiary-item surface"
          >
            <p className="beneficiary-name">
              {b.nickname || b.beneficiary_name}
            </p>
            <p className="beneficiary-meta">
              {b.beneficiary_name} — {b.beneficiary_account_number}
            </p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default Beneficiaries;