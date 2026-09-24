import {
  Bell,
  ChevronDown,
  LogOut,
  UserRound,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import {
  getUserEmail,
  getUserName,
} from "../../utils/token";

function Header() {
  const navigate = useNavigate();
  const { roles, logout } = useAuth();

  const [notificationOpen, setNotificationOpen] =
    useState(false);
  const [userMenuOpen, setUserMenuOpen] =
    useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const name = getUserName() || "Người dùng";
  const email = getUserEmail() || "";
  const role = roles[0] || "User";

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const handleLogout = async () => {
    setUserMenuOpen(false);
    setNotificationOpen(false);

    await logout();

    navigate("/login", {
      replace: true,
    });
  };

  const handleNotificationClick = () => {
    setNotificationOpen((prev) => !prev);
    setUserMenuOpen(false);
  };

  const handleUserMenuClick = () => {
    setUserMenuOpen((prev) => !prev);
    setNotificationOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        notificationRef.current &&
        !notificationRef.current.contains(target)
      ) {
        setNotificationOpen(false);
      }

      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(target)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <header className="main-header">
      <div className="header-title">
        <h2>Hệ thống quản lý thực tập sinh</h2>
        <span>
          Quản lý và theo dõi hoạt động thực tập
        </span>
      </div>

      <div className="header-actions">
        {/* NOTIFICATION */}
        <div
          className="header-dropdown-wrapper"
          ref={notificationRef}
        >
          <button
            className="header-icon-button"
            type="button"
            aria-label="Thông báo"
            aria-expanded={notificationOpen}
            onClick={handleNotificationClick}
          >
            <Bell size={20} />
            <span className="notification-dot" />
          </button>

          {notificationOpen && (
            <div className="header-dropdown notification-dropdown">
              <div className="header-dropdown-title">
                <strong>Thông báo</strong>
              </div>

              <div className="notification-empty">
                <Bell size={24} />

                <div>
                  <strong>Chưa có thông báo mới</strong>
                  <span>
                    Các thông báo của hệ thống sẽ xuất
                    hiện tại đây.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="header-divider" />

        {/* USER MENU */}
        <div
          className="header-user-wrapper"
          ref={userMenuRef}
        >
          <button
            type="button"
            className="header-user-trigger"
            onClick={handleUserMenuClick}
            aria-label="Mở menu tài khoản"
            aria-expanded={userMenuOpen}
          >
            <div className="user-avatar">
              {initials || <UserRound size={20} />}
            </div>

            <div className="user-info">
              <strong>{name}</strong>

              <span>
                {role}
                {email ? ` · ${email}` : ""}
              </span>
            </div>

            <ChevronDown
              className={`user-chevron ${
                userMenuOpen
                  ? "user-chevron-open"
                  : ""
              }`}
              size={17}
            />
          </button>

          {userMenuOpen && (
            <div className="header-dropdown user-dropdown">
              <div className="user-dropdown-profile">
                <div className="user-avatar user-avatar-large">
                  {initials || <UserRound size={22} />}
                </div>

                <div>
                  <strong>{name}</strong>
                  <span>{email}</span>
                </div>
              </div>

              <div className="user-dropdown-role">
                <span>Vai trò</span>
                <strong>{role}</strong>
              </div>

              <div className="user-dropdown-divider" />

              <button
                type="button"
                className="user-dropdown-logout"
                onClick={handleLogout}
              >
                <LogOut size={17} />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>

        {/* NÚT ĐĂNG XUẤT CŨ */}
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