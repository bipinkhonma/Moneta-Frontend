import { NavLink } from "react-router-dom";

function Sidebar() {
  const role = localStorage.getItem("role");

  const linkClass = ({ isActive }) =>
    `sidebar-link${isActive ? " is-active" : ""}`;

  return (
    <aside className="sidebar">
      <div className="brand-lockup">
        <span className="brand-mark">M</span>
        <span className="brand-name">Moneta</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={linkClass}>Overview</NavLink>
        <NavLink to="/deposit" className={linkClass}>Deposit</NavLink>
        <NavLink to="/withdraw" className={linkClass}>Withdraw</NavLink>
        <NavLink to="/transfer" className={linkClass}>Transfer</NavLink>
        <NavLink to="/transactions" className={linkClass}>Transactions</NavLink>
        <NavLink to="/beneficiaries" className={linkClass}>Beneficiaries</NavLink>
        <NavLink to="/notifications" className={linkClass}>Notifications</NavLink>
      </nav>

      {role === "Admin" && (
        <div className="sidebar-admin">
          <span className="sidebar-label">Admin</span>
          <nav className="sidebar-nav">
            <NavLink to="/admin/users" className={linkClass}>Users</NavLink>
            <NavLink to="/admin/accounts" className={linkClass}>Accounts</NavLink>
            <NavLink to="/admin/actions" className={linkClass}>Account actions</NavLink>
          </nav>
        </div>
      )}

      <div className="sidebar-footer">
        <span className="sidebar-footnote">Personal banking</span>
      </div>
    </aside>
  );
}

export default Sidebar;