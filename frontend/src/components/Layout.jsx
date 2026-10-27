import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Layers,
  Activity,
  ShieldAlert,
  ClipboardCheck,
  Wrench,
  Sliders,
  History,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Bell,
  Home,
  Users,
  KeyRound,
  RotateCcw,
} from "lucide-react";
import { getCurrentUser, setCurrentUser, logoutUser, getAlerts } from "../api/client.js";

const baseNavLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/pipelines", label: "Pipelines", icon: Layers },
  { to: "/monitoring", label: "Monitoring", icon: Activity },
  { to: "/alerts", label: "Alerts", icon: ShieldAlert },
  { to: "/inspections", label: "Inspections", icon: ClipboardCheck },
  { to: "/maintenance", label: "Maintenance", icon: Wrench },
  { to: "/simulator", label: "Risk Simulator", icon: Sliders },
  { to: "/simulations", label: "Simulation History", icon: History },
];

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openAlertsCount, setOpenAlertsCount] = useState(0);
  const [user, setUser] = useState(getCurrentUser());
  const navigate = useNavigate();
  const location = useLocation();

  const syncUser = () => {
    const current = getCurrentUser();
    setUser(current);
  };

  useEffect(() => {
    syncUser();
    getAlerts({ status: "OPEN" })
      .then((data) => setOpenAlertsCount(data.length))
      .catch(() => {});

    window.addEventListener("userRoleChanged", syncUser);
    return () => window.removeEventListener("userRoleChanged", syncUser);
  }, [location.pathname]);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  // 1-Click quick role switcher
  const handleToggleDemoRole = () => {
    if (user?.role === "Administrator") {
      setCurrentUser({
        id: "demo-operator-id",
        name: "Operator",
        email: "operator@pipelineguard.com",
        role: "Operator",
      });
    } else {
      setCurrentUser({
        id: "demo-admin-id",
        name: "Administrator",
        email: "admin@pipelineguard.com",
        role: "Administrator",
      });
    }
  };

  const getPageTitle = () => {
    if (location.pathname.startsWith("/admin")) return "System Governance & RBAC Authority";
    const current = baseNavLinks.find((l) => location.pathname.startsWith(l.to));
    return current ? current.label : "PipelineGuard Control Center";
  };

  const isAdmin = user?.role === "Administrator";

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="brand-icon">
            <ShieldCheck size={22} />
          </div>
          <div className="brand-info">
            <h1>PipelineGuard</h1>
            <span>Safety Intelligence</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={() => setMobileOpen(false)}
          >
            <Home size={18} />
            Landing Page
          </NavLink>

          {baseNavLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}

          {/* Exclusive Admin Governance in Sidebar */}
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
              style={{
                color: "var(--lavender-accent)",
                border: "1px dashed var(--lavender-border)",
                background: "var(--lavender-light)",
                marginTop: 8,
              }}
              onClick={() => setMobileOpen(false)}
            >
              <Users size={18} />
              System Governance
            </NavLink>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="system-status-pill">
            <span className="status-dot"></span>
            <span>
              {isAdmin ? "Admin Security Mode" : "Operator Telemetry Active"}
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-wrapper">
        {/* Top Navigation Bar */}
        <header className="top-navbar">
          <div className="top-navbar-left">
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <span className="top-navbar-title">{getPageTitle()}</span>
          </div>

          <div className="top-navbar-right">
            {/* Quick Demonstration Role Switcher */}
            <button
              className="btn-role-switch"
              onClick={handleToggleDemoRole}
              title="Click to switch between Operator and Administrator roles"
            >
              <RotateCcw size={13} color="var(--blue-primary)" />
              <span>
                Switch to {isAdmin ? "Operator" : "Admin"}
              </span>
            </button>

            <NavLink to="/alerts" className="badge-alert-indicator">
              <Bell size={14} />
              <span>{openAlertsCount} Open</span>
            </NavLink>

            {user ? (
              <div className="user-profile-menu">
                <div
                  className="user-avatar"
                  style={{
                    background: isAdmin
                      ? "linear-gradient(135deg, var(--lavender-accent), #ec4899)"
                      : "linear-gradient(135deg, var(--blue-primary), #06b6d4)",
                  }}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="user-meta">
                  <span className="user-name">{user.name}</span>
                  <span
                    className={`role-badge ${isAdmin ? "administrator" : "operator"}`}
                    style={{ fontSize: 9.5, padding: "1px 6px", marginTop: 2 }}
                  >
                    {user.role}
                  </span>
                </div>
                <button
                  className="btn-logout"
                  onClick={handleLogout}
                  title="Sign out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <NavLink to="/login" className="btn btn-primary btn-sm">
                Sign In
              </NavLink>
            )}
          </div>
        </header>

        {/* Content View */}
        <main className="page-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
