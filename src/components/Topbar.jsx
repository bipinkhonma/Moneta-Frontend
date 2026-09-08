import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Topbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const displayName = user?.full_name || "Moneta customer";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="topbar">
      <div className="topbar-context"><span className="topbar-dot" />Personal banking</div>
      <div className="topbar-actions">
        <button className="topbar-icon" onClick={() => navigate("/notifications")} aria-label="Notifications">🔔</button>
        <div className="profile-menu">
          <button
            className="profile-chip"
            onClick={() => setIsProfileOpen((isOpen) => !isOpen)}
            aria-expanded={isProfileOpen}
            aria-haspopup="true"
          >
            <span className="avatar">{initials}</span>
            <span className="profile-name">My account</span>
            <span className="profile-chevron" aria-hidden="true">▾</span>
          </button>
          {isProfileOpen && (
            <div className="profile-popover" role="menu">
              <span className="eyebrow">My account</span>
              <p className="profile-full-name">{displayName}</p>
              <p className="profile-email">{user?.email || "No email available"}</p>
              <button onClick={handleLogout} className="profile-logout" role="menuitem">
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;