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
import AdminCriteriaTemplatesPage from "./pages/admin/AdminCriteriaTemplatesPage";
import AdminCompaniesPage from "./pages/admin/AdminCompaniesPage";
import AdminInternshipPeriodsPage from "./pages/admin/AdminInternshipPeriodsPage";
import AdminReportsPage from "./pages/admin/AdminReportsPage";
import AdminAuditLogsPage from "./pages/admin/AdminAuditLogsPage";

import MentorEvaluationsPage from "./pages/mentor/MentorEvaluationsPage";
import ReviewerEvaluationsPage from "./pages/reviewer/ReviewerEvaluationsPage";

import StudentResultsPage from "./pages/student/StudentResultsPage";
import StudentApplicationsPage from "./pages/student/StudentApplicationsPage";

import { useAuth } from "./context/AuthContext";

// =========================================================
// HOME REDIRECT
// Chuyển user về đúng màn hình theo role
// =========================================================

function HomeRedirect() {
  const { hasRole } = useAuth();

  if (hasRole("ADMIN")) {
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

// =========================================================
// ROLE GUARD
// Kiểm tra cả Role + Permission
// =========================================================

interface RoleRouteProps {
  role: string;
  permission: string;
  children: React.ReactNode;
}

function RoleRoute({
  role,
  permission,
  children,
}: RoleRouteProps) {
  const { hasRole, hasPermission } = useAuth();

  if (
    !hasRole(role) ||
    !hasPermission(permission)
  ) {
    return <HomeRedirect />;
  }

  return <>{children}</>;
}

// =========================================================
// APP
// =========================================================

function App() {
  return (
    <Routes>
      {/* ================= PUBLIC ================= */}

      <Route
        path="/login"
        element={<LoginPage />}
      />

      {/* ================= AUTHENTICATED ================= */}

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>

          {/* ================= ADMIN ================= */}

          <Route
            path="/dashboard"
            element={
              <RoleRoute
                role="ADMIN"
                permission="DASHBOARD_VIEW"
              >
                <DashboardPage />
              </RoleRoute>
            }
          />

          <Route
            path="/admin/applications"
            element={
              <RoleRoute
                role="ADMIN"
                permission="APPLICATION_VIEW_ALL"
              >
                <AdminApplicationsPage />
              </RoleRoute>
            }
          />

          <Route
            path="/assignments"
            element={
              <RoleRoute
                role="ADMIN"
                permission="ASSIGNMENT_VIEW_ALL"
              >
                <AdminAssignmentsPage />
              </RoleRoute>
            }
          />

          <Route
            path="/admin/companies"
            element={
              <RoleRoute
                role="ADMIN"
                permission="COMPANY_MANAGE"
              >
                <AdminCompaniesPage />
              </RoleRoute>
            }
          />

          <Route
            path="/admin/periods"
            element={
              <RoleRoute
                role="ADMIN"
                permission="INTERNSHIP_PERIOD_MANAGE"
              >
                <AdminInternshipPeriodsPage />
              </RoleRoute>
            }
          />

          <Route
            path="/admin/criteria"
            element={
              <RoleRoute
                role="ADMIN"
                permission="CRITERIA_TEMPLATE_MANAGE"
              >
                <AdminCriteriaTemplatesPage />
              </RoleRoute>
            }
          />

          <Route
            path="/admin/reports"
            element={
              <RoleRoute
                role="ADMIN"
                permission="REPORT_VIEW"
              >
                <AdminReportsPage />
              </RoleRoute>
            }
          />

          <Route
            path="/admin/audit-logs"
            element={
              <RoleRoute
                role="ADMIN"
                permission="AUDIT_VIEW"
              >
                <AdminAuditLogsPage />
              </RoleRoute>
            }
          />

          {/* ================= STUDENT ================= */}

          <Route
            path="/applications"
            element={
              <RoleRoute
                role="STUDENT"
                permission="APPLICATION_VIEW_SELF"
              >
                <StudentApplicationsPage />
              </RoleRoute>
            }
          />

          <Route
            path="/results"
            element={
              <RoleRoute
                role="STUDENT"
                permission="RESULT_VIEW_SELF"
              >
                <StudentResultsPage />
              </RoleRoute>
            }
          />

          {/* ================= MENTOR ================= */}

          <Route
            path="/evaluations"
            element={
              <RoleRoute
                role="MENTOR"
                permission="EVALUATION_SCORE"
              >
                <MentorEvaluationsPage />
              </RoleRoute>
            }
          />

          {/* ================= REVIEWER ================= */}

          <Route
            path="/review"
            element={
              <RoleRoute
                role="REVIEWER"
                permission="EVALUATION_REVIEW"
              >
                <ReviewerEvaluationsPage />
              </RoleRoute>
            }
          />

        </Route>
      </Route>

      {/* ================= REDIRECT ================= */}

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