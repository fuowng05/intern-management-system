import {
  Bell,
  ChevronDown,
  LogOut,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import {
  getUserEmail,
  getUserName,
} from "../../utils/token";

function Header() {
  const navigate = useNavigate();
  const { roles, logout } = useAuth();

  const name = getUserName() || "Người dùng";
  const email = getUserEmail();
  const role = roles[0] || "User";

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="main-header">
      <div className="header-title">
        <h2>Hệ thống quản lý thực tập sinh</h2>
        <span>Quản lý và theo dõi hoạt động thực tập</span>
      </div>

      <div className="header-actions">
        <button
          className="header-icon-button"
          type="button"
          aria-label="Thông báo"
        >
          <Bell size={20} />
          <span className="notification-dot" />
        </button>

        <div className="header-divider" />

        <div className="user-avatar">
          {initials || <UserRound size={20} />}
        </div>

        <div className="user-info">
          <strong>{name}</strong>
          <span>
            {role} · {email}
          </span>
        </div>

        <ChevronDown
          className="user-chevron"
          size={17}
        />

        <button
          className="logout-button"
          type="button"
          onClick={handleLogout}
          title="Đăng xuất"
        >
          <LogOut size={18} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </header>
  );
}

export default Header;