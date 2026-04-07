// import { useState } from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentDashboard from "./pages/student/Dashboard";
import CompanyDashboard from "./pages/company/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import JobsListing from "./pages/jobs/JobsListing";
import JobDetail from "./pages/jobs/JobDetail";
import CreateJob from "./pages/company/CreateJob";
import MyApplications from "./pages/student/Applications";
import CompanyApplicants from "./pages/company/Applicants";
import NotificationsPage from "./pages/Notifications";
import Announce from "./pages/admin/Announce";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/notifications" element={
        <ProtectedRoute allowedRoles={["STUDENT", "COMPANY", "ADMIN"]}>
          <NotificationsPage />
        </ProtectedRoute>
      } />

      {/* student */}
      <Route path="/student/dashboard" element={
        <ProtectedRoute allowedRoles={["STUDENT"]}>
          <StudentDashboard />
        </ProtectedRoute>
      } />

      <Route path="/jobs" element={
        <ProtectedRoute allowedRoles={["STUDENT"]}>
          <JobsListing />
        </ProtectedRoute>
      } />

      <Route path="/jobs/:id" element={
        <ProtectedRoute allowedRoles={["STUDENT"]}>
          <JobDetail />
        </ProtectedRoute>
      } />

      <Route path="/student/applications" element={
        <ProtectedRoute allowedRoles={["STUDENT"]}>
          <MyApplications />
        </ProtectedRoute>
      } />

      {/* company */}
      <Route path="/company/dashboard" element={
        <ProtectedRoute allowedRoles={["COMPANY"]}>
          <CompanyDashboard />
        </ProtectedRoute>
      } />

      <Route path="/company/create-job" element={
        <ProtectedRoute allowedRoles={["COMPANY"]}>
          <CreateJob />
        </ProtectedRoute>
      } />

      <Route path="/company/applicants" element={
        <ProtectedRoute allowedRoles={["COMPANY"]}>
          <CompanyApplicants />
        </ProtectedRoute>
      } />

      {/* Admin  */}

      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <AdminDashboard />
        </ProtectedRoute>
      } />

      <Route path="/admin/announce" element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <Announce />
        </ProtectedRoute>
      } />
      
      {/* Fallback route for unmatched paths */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
