import axios from "axios";
import {
  BarChart3,
  CheckCircle2,
  RefreshCw,
  Search,
  Trophy,
  Users,
  XCircle,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import reportService from "../../services/reportService";

import type {
  EvaluationResultReportResponse,
} from "../../types/report";

function AdminReportsPage() {
  const [reports, setReports] = useState<
    EvaluationResultReportResponse[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [periodFilter, setPeriodFilter] =
    useState("ALL");

  const getErrorMessage = (
    err: unknown,
    fallback: string
  ) => {
    if (axios.isAxiosError(err)) {
      return (
        err.response?.data?.message ??
        err.response?.data?.error?.message ??
        fallback
      );
    }

    return fallback;
  };

  const loadReports = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data =
        await reportService.getEvaluationResults();

      setReports(data);
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Không thể tải báo cáo kết quả thực tập."
        )
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadReports();
  }, [loadReports]);

  const periods = useMemo(() => {
    const map = new Map<
      string,
      {
        code: string;
        name: string;
      }
    >();

    reports.forEach((report) => {
      map.set(report.periodCode, {
        code: report.periodCode,
        name: report.periodName,
      });
    });

    return Array.from(map.values()).sort(
      (a, b) =>
        a.code.localeCompare(b.code)
    );
  }, [reports]);

  const filteredReports = useMemo(() => {
    const keyword = search
      .trim()
      .toLowerCase();

    return reports.filter((report) => {
      const matchesPeriod =
        periodFilter === "ALL" ||
        report.periodCode === periodFilter;

      const matchesSearch =
        !keyword ||
        report.studentCode
          .toLowerCase()
          .includes(keyword) ||
        report.studentName
          .toLowerCase()
          .includes(keyword) ||
        report.companyName
          .toLowerCase()
          .includes(keyword) ||
        report.mentorName
          .toLowerCase()
          .includes(keyword);

      return matchesPeriod && matchesSearch;
    });
  }, [reports, search, periodFilter]);

  const statistics = useMemo(() => {
    const total = filteredReports.length;

    const passed = filteredReports.filter(
      (item) => item.result === "PASSED"
    ).length;

    const failed = filteredReports.filter(
      (item) => item.result === "FAILED"
    ).length;

    const average =
      total === 0
        ? 0
        : filteredReports.reduce(
            (sum, item) =>
              sum + item.totalScore,
            0
          ) / total;

    return {
      total,
      passed,
      failed,
      average,
    };
  }, [filteredReports]);

  const classificationLabel = (
    value: string
  ) => {
    switch (value) {
      case "EXCELLENT":
        return "Xuất sắc";

      case "VERY_GOOD":
        return "Giỏi";

      case "GOOD":
        return "Khá";

      case "AVERAGE":
        return "Trung bình";

      case "WEAK_AVERAGE":
        return "Trung bình yếu";

      case "FAIL":
        return "Không đạt";

      default:
        return value;
    }
  };

  const resultLabel = (value: string) => {
    if (value === "PASSED") {
      return "Đạt";
    }

    if (value === "FAILED") {
      return "Không đạt";
    }

    return value;
  };

  const formatDate = (
    value: string | null
  ) => {
    if (!value) {
      return "—";
    }

    return new Intl.DateTimeFormat(
      "vi-VN",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    ).format(new Date(value));
  };

  return (
    <div className="applications-page">
      <div className="page-heading applications-heading">
        <div>
          <h1>Báo cáo kết quả thực tập</h1>

          <p>
            Tổng hợp các kết quả đánh giá đã
            được công bố.
          </p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={() =>
            void loadReports()
          }
          disabled={loading}
        >
          <RefreshCw
            size={16}
            className={
              loading ? "spin-icon" : ""
            }
          />
          Làm mới
        </button>
      </div>

      <section className="application-summary-grid">
        <div className="application-summary-card">
          <div className="summary-icon all">
            <Users size={19} />
          </div>

          <div>
            <span>Tổng kết quả</span>
            <strong>
              {statistics.total}
            </strong>
          </div>
        </div>

        <div className="application-summary-card">
          <div>
            <CheckCircle2 size={19} />
          </div>

          <div>
            <span>Đạt</span>
            <strong>
              {statistics.passed}
            </strong>
          </div>
        </div>

        <div className="application-summary-card">
          <div>
            <XCircle size={19} />
          </div>

          <div>
            <span>Không đạt</span>
            <strong>
              {statistics.failed}
            </strong>
          </div>
        </div>

        <div className="application-summary-card">
          <div>
            <Trophy size={19} />
          </div>

          <div>
            <span>Điểm trung bình</span>
            <strong>
              {statistics.average.toFixed(
                2
              )}
            </strong>
          </div>
        </div>
      </section>

      {error && (
        <div className="applications-error">
          {error}
        </div>
      )}

      <section className="table-panel">
        <div className="table-toolbar">
          <div className="table-search">
            <Search size={17} />

            <input
              type="text"
              placeholder="Tìm sinh viên, doanh nghiệp, mentor..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />
          </div>

          <select
            className="status-filter"
            value={periodFilter}
            onChange={(event) =>
              setPeriodFilter(
                event.target.value
              )
            }
          >
            <option value="ALL">
              Tất cả đợt thực tập
            </option>

            {periods.map((period) => (
              <option
                key={period.code}
                value={period.code}
              >
                {period.code} -{" "}
                {period.name}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="table-empty">
            Đang tải báo cáo...
          </div>
        ) : filteredReports.length ===
          0 ? (
          <div className="table-empty">
            <BarChart3 size={28} />

            <p>
              Chưa có kết quả phù hợp.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Sinh viên</th>
                  <th>Doanh nghiệp</th>
                  <th>Đợt</th>
                  <th>Mentor</th>
                  <th>Điểm</th>
                  <th>Xếp loại</th>
                  <th>Kết quả</th>
                  <th>Công bố</th>
                </tr>
              </thead>

              <tbody>
                {filteredReports.map(
                  (report) => (
                    <tr
                      key={
                        report.evaluationId
                      }
                    >
                      <td>
                        <strong className="table-primary">
                          {
                            report.studentName
                          }
                        </strong>

                        <div
                          style={{
                            fontSize: 12,
                            marginTop: 3,
                            opacity: 0.65,
                          }}
                        >
                          {
                            report.studentCode
                          }
                        </div>
                      </td>

                      <td>
                        {
                          report.companyName
                        }
                      </td>

                      <td>
                        <strong>
                          {
                            report.periodCode
                          }
                        </strong>

                        <div
                          style={{
                            fontSize: 12,
                            marginTop: 3,
                            opacity: 0.65,
                          }}
                        >
                          {
                            report.periodName
                          }
                        </div>
                      </td>

                      <td>
                        {report.mentorName}
                      </td>

                      <td>
                        <strong>
                          {report.totalScore.toFixed(
                            2
                          )}
                        </strong>
                      </td>

                      <td>
                        {classificationLabel(
                          report.classification
                        )}
                      </td>

                      <td>
                        <span
                          className={`status-badge ${
                            report.result ===
                            "PASSED"
                              ? "approved"
                              : "rejected"
                          }`}
                        >
                          {resultLabel(
                            report.result
                          )}
                        </span>
                      </td>

                      <td>
                        {formatDate(
                          report.publishedAt
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminReportsPage;