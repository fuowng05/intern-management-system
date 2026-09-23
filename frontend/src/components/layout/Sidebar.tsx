import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  UserCheck,
  Star,
  BadgeCheck,
  Building2,
  CalendarDays,
  ListChecks,
  BarChart3,
  ScrollText,
  GraduationCap,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

interface MenuItem {
  label: string;
  path: string;
  permission: string;
  icon: React.ElementType;
}

const menuItems: MenuItem[] = [
  {
    label: "Tổng quan",
    path: "/dashboard",
    permission: "DASHBOARD_VIEW",
    icon: LayoutDashboard,
  },
  {
    label: "Đơn thực tập",
    path: "/applications",
    permission: "APPLICATION_VIEW_SELF",
    icon: FileText,
  },
  {
    label: "Quản lý đơn",
    path: "/admin/applications",
    permission: "APPLICATION_VIEW_ALL",
    icon: ClipboardList,
  },
  {
    label: "Phân công",
    path: "/assignments",
    permission: "ASSIGNMENT_VIEW_ALL",
    icon: UserCheck,
  },
  {
    label: "Đánh giá thực tập",
    path: "/evaluations",
    permission: "EVALUATION_SCORE",
    icon: Star,
  },
  {
    label: "Duyệt đánh giá",
    path: "/review",
    permission: "EVALUATION_REVIEW",
    icon: BadgeCheck,
  },
  {
    label: "Kết quả thực tập",
    path: "/results",
    permission: "RESULT_VIEW_SELF",
    icon: GraduationCap,
  },
  {
    label: "Doanh nghiệp",
    path: "/admin/companies",
    permission: "COMPANY_MANAGE",
    icon: Building2,
  },
  {
    label: "Đợt thực tập",
    path: "/admin/periods",
    permission: "INTERNSHIP_PERIOD_MANAGE",
    icon: CalendarDays,
  },
  {
    label: "Bộ tiêu chí",
    path: "/admin/criteria",
    permission: "CRITERIA_TEMPLATE_MANAGE",
    icon: ListChecks,
  },
  {
    label: "Báo cáo",
    path: "/admin/reports",
    permission: "REPORT_VIEW",
    icon: BarChart3,
  },
  {
    label: "Nhật ký hệ thống",
    path: "/admin/audit-logs",
    permission: "AUDIT_VIEW",
    icon: ScrollText,
  },
];

function Sidebar() {
  const { hasPermission } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <GraduationCap size={27} />
        </div>

        <div>
          <h1>InternHub</h1>
          <span>Internship Management</span>
        </div>
      </div>

      <div className="sidebar-section-title">MENU</div>

      <nav className="sidebar-nav">
        {menuItems
          .filter((item) => hasPermission(item.permission))
          .map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
      </nav>

      <div className="sidebar-footer">
        <span>InternHub</span>
        <small>Quản lý thực tập sinh</small>
      </div>
    </aside>
  );
}

export default Sidebar;