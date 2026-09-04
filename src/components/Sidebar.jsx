import { NavLink } from "react-router-dom";

function Sidebar() {
  const linkClass = ({ isActive }) => `sidebar-link ${isActive ? "is-active" : ""}`;

  return (
    <aside className="sidebar">
      <div className="brand-lockup">
        <span className="brand-mark">M</span>
        <span className="brand-name">MONETA</span>
      </div>

      <nav className="sidebar-nav">
        <span className="sidebar-label">Main</span>
        <NavLink to="/dashboard" className={linkClass}><span>◌</span>Overview</NavLink>
        <NavLink to="/deposit" className={linkClass}><span>＋</span>Deposit</NavLink>
        <NavLink to="/withdraw" className={linkClass}><span>−</span>Withdraw</NavLink>
        <NavLink to="/transfer" className={linkClass}><span>↗</span>Transfer</NavLink>
        <NavLink to="/transactions" className={linkClass}><span>≡</span>Transactions</NavLink>
        <NavLink to="/beneficiaries" className={linkClass}><span>◇</span>Beneficiaries</NavLink>
        <NavLink to="/notifications" className={linkClass}><span>•</span>Notifications</NavLink>
      </nav>

      <div className="sidebar-nav sidebar-admin">
        <span className="sidebar-label">Administration</span>
        <NavLink to="/admin/users" className={linkClass}><span>◉</span>Users</NavLink>
        <NavLink to="/admin/accounts" className={linkClass}><span>▣</span>Accounts</NavLink>
        <NavLink to="/admin/actions" className={linkClass}><span>⚙</span>Account actions</NavLink>
      </div>

      <div className="sidebar-footer">
        <span className="sidebar-footnote">Thoughtful banking<br />for everyday life.</span>
      </div>
    </aside>
  );
}

export default Sidebar;