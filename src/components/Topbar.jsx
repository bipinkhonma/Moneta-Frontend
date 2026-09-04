import { useNavigate } from "react-router-dom";

function Topbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="topbar">
      <div className="topbar-context"><span className="topbar-dot" />Personal banking</div>
      <div className="topbar-actions">
        <button className="topbar-icon" onClick={() => navigate("/notifications")} aria-label="Notifications">♧</button>
        <div className="profile-chip">
          <span className="avatar">M</span>
          <span className="profile-name">My account</span>
        </div>
        <button onClick={handleLogout} className="logout-link">Log out</button>
      </div>
    </header>
  );
}

export default Topbar;