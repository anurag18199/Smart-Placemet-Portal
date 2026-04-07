import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role") as "STUDENT" | "COMPANY" | "ADMIN" | null;
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const navLinks = {
    STUDENT: [
      { label: "Dashboard", path: "/student/dashboard" },
      { label: "Browse Jobs", path: "/jobs" },
      { label: "My Applications", path: "/student/applications" },
    ],
    COMPANY: [
      { label: "Dashboard", path: "/company/dashboard" },
      { label: "Post a Job", path: "/company/create-job" },
      { label: "Applicants", path: "/company/applicants" },
    ],
    ADMIN: [
      { label: "Dashboard", path: "/admin/dashboard" },
      { label: "Students", path: "/admin/students" },
      { label: "Companies", path: "/admin/companies" },
      { label: "Announce", path: "/admin/announce" },
    ],
  };

  const links = role ? navLinks[role] : [];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-[#e5e5e0] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#1a1a2e] rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <span className="text-[#1a1a2e] font-semibold text-sm tracking-tight">
              PlacementPortal
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                  isActive(link.path)
                    ? "bg-[#1a1a2e] text-white"
                    : "text-[#6b6b6b] hover:text-[#1a1a2e] hover:bg-[#f5f5f0]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Role Badge */}
            <NotificationBell />
            {role && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#f0f0eb] text-[#6b6b6b] font-medium capitalize">
                {role.toLowerCase()}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="text-sm text-[#6b6b6b] hover:text-red-500 font-medium transition"
            >
              Sign out
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-[#6b6b6b] hover:text-[#1a1a2e]"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-[#e5e5e0] py-3 space-y-1">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium transition ${
                  isActive(link.path)
                    ? "bg-[#1a1a2e] text-white"
                    : "text-[#6b6b6b] hover:text-[#1a1a2e] hover:bg-[#f5f5f0]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-[#e5e5e0] flex items-center justify-between px-3">
              {role && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#f0f0eb] text-[#6b6b6b] font-medium capitalize">
                  {role.toLowerCase()}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="text-sm text-[#6b6b6b] hover:text-red-500 font-medium transition"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}