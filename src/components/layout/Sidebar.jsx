import { NavLink } from "react-router-dom";

function Sidebar() {
  const linkStyle = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 16px",
    borderRadius: "8px",
    textDecoration: "none",
    color: isActive ? "#000" : "#666",
    backgroundColor: isActive ? "#f0f0f0" : "transparent",
    fontWeight: isActive ? 600 : 400,
  });

  return (
    <div
      style={{
        width: "220px",
        height: "100vh",
        borderRight: "1px solid #eee",
        padding: "20px 12px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
      }}
    >
      <div style={{ padding: "0 16px 24px", fontWeight: "bold", fontSize: "18px" }}>
        Moneta
      </div>

      <NavLink to="/dashboard" style={linkStyle}>Overview</NavLink>
      <NavLink to="/deposit" style={linkStyle}>Deposit</NavLink>
      <NavLink to="/withdraw" style={linkStyle}>Withdraw</NavLink>
      <NavLink to="/transfer" style={linkStyle}>Transfer</NavLink>
      <NavLink to="/transactions" style={linkStyle}>Transactions</NavLink>
      <NavLink to="/beneficiaries" style={linkStyle}>Beneficiaries</NavLink>
      <NavLink to="/notifications" style={linkStyle}>Notifications</NavLink>
    </div>
  );
}

export default Sidebar;