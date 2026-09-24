import { useEffect, useState } from "react";
import {
  Building2,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Star,
  Users,
} from "lucide-react";
import axios from "axios";

import dashboardService from "../../services/dashboardService";
import type { DashboardResponse } from "../../types/dashboard";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


function DashboardPage() {
  const [data, setData] =
    useState<DashboardResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { hasPermission, hasRole } = useAuth();

  const canViewDashboard =
    hasPermission("DASHBOARD_VIEW");

    useEffect(() => {
      if (!canViewDashboard) {
        setLoading(false);
        return;
      }

      const loadDashboard = async () => {
        try {
          const result =
            await dashboardService.getDashboard();

          setData(result);
        } catch (err) {
          if (axios.isAxiosError(err)) {
            if (!err.response) {
              setError(
                "Không thể kết nối đến máy chủ."
              );
            } else if (err.response.status === 403) {
              setError(
                "Bạn không có quyền xem Dashboard."
              );
            } else {
              setError(
                err.response.data?.message ??
                  "Không thể tải dữ liệu Dashboard."
              );
            }
          } else {
            setError(
              "Không thể tải dữ liệu Dashboard."
            );
          }
        } finally {
          setLoading(false);
        }
      };

      void loadDashboard();
    }, [canViewDashboard]);
    if (!canViewDashboard) {
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
  if (loading) {
    return (
      <div className="dashboard-state">
        Đang tải dữ liệu...
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <strong>Không thể tải Dashboard</strong>
        <span>{error}</span>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const stats = [
    {
      label: "Sinh viên",
      value: data.totalStudents,
      description: "Sinh viên đang hoạt động",
      icon: Users,
    },
    {
      label: "Doanh nghiệp",
      value: data.totalCompanies,
      description: "Doanh nghiệp trong hệ thống",
      icon: Building2,
    },
    {
      label: "Đơn thực tập",
      value: data.totalApplications,
      description: "Tổng số đơn đăng ký",
      icon: FileText,
    },
    {
      label: "Phân công",
      value: data.totalAssignments,
      description: "Sinh viên đã được phân công",
      icon: ClipboardCheck,
    },
  ];

  return (
    <div className="dashboard-page">
      <div className="page-heading">
        <div>
          <h1>Tổng quan</h1>
          <p>
            Theo dõi tình hình thực tập sinh và hoạt
            động của hệ thống.
          </p>
        </div>

        <div className="dashboard-status">
          <span />
          Hệ thống hoạt động
        </div>
      </div>

      <section className="stats-grid">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <article
              className="stat-card"
              key={item.label}
            >
              <div className="stat-card-top">
                <div className="stat-icon">
                  <Icon size={21} />
                </div>

                <span className="stat-label">
                  {item.label}
                </span>
              </div>

              <strong className="stat-value">
                {item.value}
              </strong>

              <span className="stat-description">
                {item.description}
              </span>
            </article>
          );
        })}
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <h2>Đơn thực tập</h2>
              <p>
                Trạng thái xử lý đơn đăng ký
              </p>
            </div>

            <FileText size={20} />
          </div>

          <div className="status-list">
            <div className="status-row">
              <div>
                <span className="status-dot pending" />
                Chờ duyệt
              </div>

              <strong>
                {data.applications.pending}
              </strong>
            </div>

            <div className="status-row">
              <div>
                <span className="status-dot approved" />
                Đã duyệt
              </div>

              <strong>
                {data.applications.approved}
              </strong>
            </div>

            <div className="status-row">
              <div>
                <span className="status-dot rejected" />
                Từ chối
              </div>

              <strong>
                {data.applications.rejected}
              </strong>
            </div>
          </div>
        </article>

        <article className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <h2>Đánh giá thực tập</h2>
              <p>
                Tiến độ đánh giá sinh viên
              </p>
            </div>

            <Star size={20} />
          </div>

          <div className="evaluation-summary">
            <div>
              <span>Tổng đánh giá</span>
              <strong>
                {data.evaluations.total}
              </strong>
            </div>

            <div>
              <span>Điểm trung bình</span>
              <strong>
                {data.evaluations.averageScore ??
                  "—"}
              </strong>
            </div>
          </div>

          <div className="evaluation-status-grid">
            <div>
              <span>Nháp</span>
              <strong>
                {data.evaluations.draft}
              </strong>
            </div>

            <div>
              <span>Chờ duyệt</span>
              <strong>
                {data.evaluations.submitted}
              </strong>
            </div>

            <div>
              <span>Trả lại</span>
              <strong>
                {data.evaluations.returned}
              </strong>
            </div>

            <div>
              <span>Đã công bố</span>
              <strong>
                {data.evaluations.published}
              </strong>
            </div>
          </div>
        </article>
      </section>

      <section className="result-panel">
        <div className="result-icon">
          <GraduationCap size={23} />
        </div>

        <div className="result-copy">
          <h2>Kết quả thực tập</h2>
          <p>
            Thống kê kết quả của các đánh giá đã
            được công bố.
          </p>
        </div>

        <div className="result-number passed">
          <strong>
            {data.evaluations.passed}
          </strong>
          <span>Đạt</span>
        </div>

        <div className="result-number failed">
          <strong>
            {data.evaluations.failed}
          </strong>
          <span>Không đạt</span>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;