import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import LoginPage from "./pages/auth/LoginPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import DashboardPage from "./pages/dashboard/DashboardPage";
import AdminApplicationsPage from "./pages/admin/AdminApplicationsPage";
import AdminAssignmentsPage from "./pages/admin/AdminAssignmentsPage";
import MentorEvaluationsPage from "./pages/mentor/MentorEvaluationsPage";
import ReviewerEvaluationsPage from "./pages/reviewer/ReviewerEvaluationsPage";
import StudentResultsPage from "./pages/student/StudentResultsPage";
import StudentApplicationsPage from "./pages/student/StudentApplicationsPage";
import AdminCriteriaTemplatesPage from "./pages/admin/AdminCriteriaTemplatesPage";
import AdminCompaniesPage from "./pages/admin/AdminCompaniesPage";
import AdminInternshipPeriodsPage from "./pages/admin/AdminInternshipPeriodsPage";
import AdminReportsPage from "./pages/admin/AdminReportsPage";
import AdminAuditLogsPage from "./pages/admin/AdminAuditLogsPage";
import { useAuth } from "./context/AuthContext";

function HomeRedirect() {
  const { hasPermission, hasRole } = useAuth();

  if (hasPermission("DASHBOARD_VIEW")) {
    return <Navigate to="/dashboard" replace />;
  }

  if (hasRole("STUDENT")) {
    return <Navigate to="/applications" replace />;
  }

  if (hasRole("MENTOR")) {
    return <Navigate to="/evaluations" replace />;
  }

  if (hasRole("REVIEWER")) {
    return <Navigate to="/review" replace />;
  }

  return <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
        <Route
            path="/dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="/applications"
            element={<StudentApplicationsPage />}
          />

          <Route
            path="/assignments"
            element={<AdminAssignmentsPage />}
          />

          <Route
            path="/evaluations"
            element={<MentorEvaluationsPage />}
          />

          <Route
            path="/review"
            element={<ReviewerEvaluationsPage />}
          />

          <Route
            path="/results"
            element={<StudentResultsPage />}
          />

          <Route
            path="/admin/applications"
            element={<AdminApplicationsPage />}
          />

          <Route
            path="/admin/companies"
            element={<AdminCompaniesPage />}
          />

          <Route
            path="/admin/periods"
            element={<AdminInternshipPeriodsPage />}
          />

          <Route
            path="/admin/criteria"
            element={<AdminCriteriaTemplatesPage />}
          />

          <Route
            path="/admin/reports"
            element={<AdminReportsPage />}
          />

          <Route
            path="/admin/audit-logs"
            element={<AdminAuditLogsPage />}
          />
        </Route>
      </Route>

      <Route
        path="/"
        element={<HomeRedirect />}
      />

      <Route
        path="*"
        element={<HomeRedirect />}
      />
    </Routes>
  );
}

export default App;