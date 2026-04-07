import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  allowedRoles: ("STUDENT" | "COMPANY" | "ADMIN")[];
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role") as "STUDENT" | "COMPANY" | "ADMIN" | null;

  if (!token || !role) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    if (role === "STUDENT") return <Navigate to="/student/dashboard" replace />;
    if (role === "COMPANY") return <Navigate to="/company/dashboard" replace />;
    if (role === "ADMIN") return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
}