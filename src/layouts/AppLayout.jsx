import { Link, Outlet, useLocation } from "react-router-dom";
import { Button, Drawer, message, Modal } from "antd";
import {
  LogoutOutlined,
  MenuOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

const AppLayout = () => {
  const location = useLocation();
  const { profile, signOut, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    Modal.confirm({
      title: "Log out?",
      content: "You will need to sign in again to access your smoothie dashboard.",
      okText: "Logout",
      okType: "primary",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await signOut();
          message.success("Signed out successfully.");
        } catch (error) {
          console.error(error);
          message.error("Could not sign out. Please try again.");
        }
      },
    });
  };

  const displayName =
    profile?.full_name?.trim() ||
    user?.user_metadata?.full_name ||
    "Smoothie lover";
  const avatarLabel =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "S";

  return (
    <>
      <nav className="topbar">
        <div className="topbar__brand">
          <Link to="/" className="brand-mark">
            Supa Smoothies
          </Link>
          <p>Fresh recipes, now with your own secure dashboard.</p>
        </div>

        <div className="topbar__content">
          <div className="topbar__nav">
            <Link
              to="/"
              className={
                location.pathname === "/" ? "nav-link active" : "nav-link"
              }
            >
              Home
            </Link>
            <Link
              to="/explore"
              className={
                location.pathname.startsWith("/explore")
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              Explore
            </Link>
            <Link
              to="/create"
              className={
                location.pathname === "/create" ? "nav-link active" : "nav-link"
              }
            >
              Create
            </Link>
          </div>

          <div className="topbar__actions">
            <div className="user-badge">
              <span className="user-badge__avatar">{avatarLabel}</span>
              <span className="user-badge__content">
                <span className="user-badge__label">Signed in as</span>
                <span className="user-badge__name">{displayName}</span>
              </span>
            </div>
            <Link
              to="/settings"
              className={
                location.pathname.startsWith("/settings")
                  ? "topbar-action topbar-action--settings active"
                  : "topbar-action topbar-action--settings"
              }
              aria-label="Settings"
              title="Settings"
            >
              <span className="topbar-action__content">
                <SettingOutlined />
                <span className="topbar-action__label">Settings</span>
              </span>
            </Link>
            <Button
              className="topbar-action topbar-action--button topbar-action--logout"
              onClick={handleSignOut}
              aria-label="Logout"
              title="Logout"
            >
              <span className="topbar-action__content">
                <LogoutOutlined />
                <span className="topbar-action__label">Logout</span>
              </span>
            </Button>
          </div>
        </div>

        <Button
          className="topbar-menu-button"
          aria-label="Open navigation menu"
          title="Menu"
          icon={<MenuOutlined />}
          onClick={() => setIsMobileMenuOpen(true)}
        />
      </nav>

      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setIsMobileMenuOpen(false)}
        open={isMobileMenuOpen}
        className="mobile-menu-drawer"
      >
        <div className="mobile-menu">
          <div className="mobile-menu__profile">
            <span className="user-badge__avatar">{avatarLabel}</span>
            <div className="mobile-menu__profile-copy">
              <span className="user-badge__label">Signed in as</span>
              <span className="user-badge__name">{displayName}</span>
            </div>
          </div>

          <div className="mobile-menu__links">
            <Link
              to="/"
              className={location.pathname === "/" ? "mobile-menu-link active" : "mobile-menu-link"}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/explore"
              className={
                location.pathname.startsWith("/explore")
                  ? "mobile-menu-link active"
                  : "mobile-menu-link"
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Explore
            </Link>
            <Link
              to="/create"
              className={
                location.pathname === "/create"
                  ? "mobile-menu-link active"
                  : "mobile-menu-link"
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Create
            </Link>
            <Link
              to="/settings"
              className={
                location.pathname.startsWith("/settings")
                  ? "mobile-menu-link active"
                  : "mobile-menu-link"
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Settings
            </Link>
          </div>

          <Button
            className="mobile-menu__logout"
            onClick={() => {
              setIsMobileMenuOpen(false);
              handleSignOut();
            }}
            icon={<LogoutOutlined />}
          >
            Logout
          </Button>
        </div>
      </Drawer>

      <Outlet />
    </>
  );
};

export default AppLayout;
