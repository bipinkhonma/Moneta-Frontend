function AccountCard({ accountNumber, status, balance, currency }) {
  const maskedNumber = accountNumber ? `•••• •••• ${String(accountNumber).slice(-4)}` : "•••• ••••";

  return (
    <article className="account-card">
      <div className="account-card-top">
        <div>
          <p className="account-kicker">Moneta account</p>
          <p className="account-number">{maskedNumber}</p>
        </div>
        <span className={`status-badge ${status === "active" ? "status-active" : "status-muted"}`}>
          <span className="status-dot" />{status}
        </span>
      </div>
      <div className="account-card-bottom">
        <div><span className="account-currency">{currency}</span><p className="account-balance">{currency} {Number(balance).toFixed(2)}</p></div>
        <span className="account-type">Everyday account</span>
      </div>
    </article>
  );
}

export default AccountCard;