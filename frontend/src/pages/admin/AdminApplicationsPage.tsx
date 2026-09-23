import {
    Check,
    Clock3,
    Eye,
    FileText,
    RefreshCw,
    Search,
    X,
  } from "lucide-react";
  import axios from "axios";
  import {
    useCallback,
    useEffect,
    useMemo,
    useState,
  } from "react";
  
  import applicationService from "../../services/applicationService";
  import type {
    ApplicationResponse,
    ApplicationStatus,
  } from "../../types/application";
  
  type FilterStatus = "ALL" | ApplicationStatus;
  
  function AdminApplicationsPage() {
    const [applications, setApplications] = useState<
      ApplicationResponse[]
    >([]);
  
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
  
    const [search, setSearch] = useState("");
    const [status, setStatus] =
      useState<FilterStatus>("ALL");
  
    const [selected, setSelected] =
      useState<ApplicationResponse | null>(null);
  
    const [processingId, setProcessingId] =
      useState<string | null>(null);
  
    const loadApplications = useCallback(async () => {
      setLoading(true);
      setError("");
  
      try {
        const data = await applicationService.getAll();
        setApplications(data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (!err.response) {
            setError(
              "Không thể kết nối đến máy chủ. Hãy kiểm tra backend."
            );
          } else if (err.response.status === 403) {
            setError(
              "Bạn không có quyền xem danh sách đơn thực tập."
            );
          } else {
            setError(
              err.response.data?.message ??
                "Không thể tải danh sách đơn thực tập."
            );
          }
        } else {
          setError(
            "Không thể tải danh sách đơn thực tập."
          );
        }
      } finally {
        setLoading(false);
      }
    }, []);
  
    useEffect(() => {
      void loadApplications();
    }, [loadApplications]);
  
    const filteredApplications = useMemo(() => {
      const keyword = search.trim().toLowerCase();
  
      return applications.filter((application) => {
        const matchesStatus =
          status === "ALL" ||
          application.status === status;
  
        const matchesSearch =
          !keyword ||
          application.studentName
            .toLowerCase()
            .includes(keyword) ||
          application.studentEmail
            .toLowerCase()
            .includes(keyword) ||
          application.companyName
            .toLowerCase()
            .includes(keyword) ||
          application.periodCode
            .toLowerCase()
            .includes(keyword);
  
        return matchesStatus && matchesSearch;
      });
    }, [applications, search, status]);
  
    const counts = useMemo(
      () => ({
        all: applications.length,
        pending: applications.filter(
          (item) => item.status === "PENDING"
        ).length,
        approved: applications.filter(
          (item) => item.status === "APPROVED"
        ).length,
        rejected: applications.filter(
          (item) => item.status === "REJECTED"
        ).length,
      }),
      [applications]
    );
  
    const handleDecision = async (
      application: ApplicationResponse,
      decision: "APPROVED" | "REJECTED"
    ) => {
      const action =
        decision === "APPROVED"
          ? "duyệt"
          : "từ chối";
  
      const confirmed = window.confirm(
        `Bạn có chắc muốn ${action} đơn của ${application.studentName}?`
      );
  
      if (!confirmed) {
        return;
      }
  
      setProcessingId(application.id);
      setError("");
  
      try {
        const updated =
          await applicationService.decide(
            application.id,
            decision
          );
  
        setApplications((current) =>
          current.map((item) =>
            item.id === updated.id ? updated : item
          )
        );
  
        setSelected((current) =>
          current?.id === updated.id
            ? updated
            : current
        );
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ??
              `Không thể ${action} đơn thực tập.`
          );
        } else {
          setError(
            `Không thể ${action} đơn thực tập.`
          );
        }
      } finally {
        setProcessingId(null);
      }
    };
  
    const formatDate = (
      value: string | null
    ): string => {
      if (!value) {
        return "—";
      }
  
      return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(value));
    };
  
    const getStatusLabel = (
      applicationStatus: ApplicationStatus
    ) => {
      switch (applicationStatus) {
        case "APPROVED":
          return "Đã duyệt";
        case "REJECTED":
          return "Từ chối";
        default:
          return "Chờ duyệt";
      }
    };
  
    return (
      <div className="applications-page">
        <div className="page-heading applications-heading">
          <div>
            <h1>Quản lý đơn thực tập</h1>
            <p>
              Theo dõi và xử lý các đơn đăng ký thực tập
              của sinh viên.
            </p>
          </div>
  
          <button
            className="secondary-button"
            type="button"
            onClick={() => void loadApplications()}
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
              <FileText size={19} />
            </div>
            <div>
              <span>Tất cả đơn</span>
              <strong>{counts.all}</strong>
            </div>
          </div>
  
          <div className="application-summary-card">
            <div className="summary-icon pending">
              <Clock3 size={19} />
            </div>
            <div>
              <span>Chờ duyệt</span>
              <strong>{counts.pending}</strong>
            </div>
          </div>
  
          <div className="application-summary-card">
            <div className="summary-icon approved">
              <Check size={19} />
            </div>
            <div>
              <span>Đã duyệt</span>
              <strong>{counts.approved}</strong>
            </div>
          </div>
  
          <div className="application-summary-card">
            <div className="summary-icon rejected">
              <X size={19} />
            </div>
            <div>
              <span>Từ chối</span>
              <strong>{counts.rejected}</strong>
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
                placeholder="Tìm sinh viên, email, doanh nghiệp..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>
  
            <select
              className="status-filter"
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value as FilterStatus
                )
              }
            >
              <option value="ALL">
                Tất cả trạng thái
              </option>
              <option value="PENDING">
                Chờ duyệt
              </option>
              <option value="APPROVED">
                Đã duyệt
              </option>
              <option value="REJECTED">
                Từ chối
              </option>
            </select>
          </div>
  
          {loading ? (
            <div className="table-empty">
              Đang tải danh sách đơn...
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="table-empty">
              Không tìm thấy đơn thực tập phù hợp.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Sinh viên</th>
                    <th>Đợt thực tập</th>
                    <th>Doanh nghiệp</th>
                    <th>Ngày tạo</th>
                    <th>Trạng thái</th>
                    <th className="actions-column">
                      Thao tác
                    </th>
                  </tr>
                </thead>
  
                <tbody>
                  {filteredApplications.map(
                    (application) => (
                      <tr key={application.id}>
                        <td>
                          <div className="student-cell">
                            <div className="student-avatar">
                              {application.studentName
                                .charAt(0)
                                .toUpperCase()}
                            </div>
  
                            <div>
                              <strong>
                                {
                                  application.studentName
                                }
                              </strong>
                              <span>
                                {
                                  application.studentEmail
                                }
                              </span>
                            </div>
                          </div>
                        </td>
  
                        <td>
                          <strong className="table-primary">
                            {application.periodCode}
                          </strong>
                          <span className="table-secondary">
                            {application.periodName}
                          </span>
                        </td>
  
                        <td>
                          {application.companyName}
                        </td>
  
                        <td>
                          {formatDate(
                            application.createdAt
                          )}
                        </td>
  
                        <td>
                          <span
                            className={`status-badge ${application.status.toLowerCase()}`}
                          >
                            {getStatusLabel(
                              application.status
                            )}
                          </span>
                        </td>
  
                        <td>
                          <div className="table-actions">
                            <button
                              type="button"
                              className="icon-action view"
                              title="Xem chi tiết"
                              onClick={() =>
                                setSelected(
                                  application
                                )
                              }
                            >
                              <Eye size={16} />
                            </button>
  
                            {application.status ===
                              "PENDING" && (
                              <>
                                <button
                                  type="button"
                                  className="icon-action approve"
                                  title="Duyệt đơn"
                                  disabled={
                                    processingId ===
                                    application.id
                                  }
                                  onClick={() =>
                                    void handleDecision(
                                      application,
                                      "APPROVED"
                                    )
                                  }
                                >
                                  <Check
                                    size={16}
                                  />
                                </button>
  
                                <button
                                  type="button"
                                  className="icon-action reject"
                                  title="Từ chối"
                                  disabled={
                                    processingId ===
                                    application.id
                                  }
                                  onClick={() =>
                                    void handleDecision(
                                      application,
                                      "REJECTED"
                                    )
                                  }
                                >
                                  <X size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
  
        {selected && (
          <div
            className="modal-backdrop"
            onMouseDown={() =>
              setSelected(null)
            }
          >
            <div
              className="detail-modal"
              onMouseDown={(event) =>
                event.stopPropagation()
              }
            >
              <div className="modal-header">
                <div>
                  <h2>Chi tiết đơn thực tập</h2>
                  <p>
                    Thông tin đăng ký của sinh viên
                  </p>
                </div>
  
                <button
                  type="button"
                  className="modal-close"
                  onClick={() =>
                    setSelected(null)
                  }
                >
                  <X size={20} />
                </button>
              </div>
  
              <div className="detail-grid">
                <div>
                  <span>Sinh viên</span>
                  <strong>
                    {selected.studentName}
                  </strong>
                </div>
  
                <div>
                  <span>Email</span>
                  <strong>
                    {selected.studentEmail}
                  </strong>
                </div>
  
                <div>
                  <span>Đợt thực tập</span>
                  <strong>
                    {selected.periodCode}
                  </strong>
                  <small>
                    {selected.periodName}
                  </small>
                </div>
  
                <div>
                  <span>Doanh nghiệp</span>
                  <strong>
                    {selected.companyName}
                  </strong>
                </div>
  
                <div>
                  <span>Ngày đăng ký</span>
                  <strong>
                    {formatDate(
                      selected.createdAt
                    )}
                  </strong>
                </div>
  
                <div>
                  <span>Trạng thái</span>
                  <strong>
                    <span
                      className={`status-badge ${selected.status.toLowerCase()}`}
                    >
                      {getStatusLabel(
                        selected.status
                      )}
                    </span>
                  </strong>
                </div>
  
                {selected.decidedAt && (
                  <div>
                    <span>Ngày xử lý</span>
                    <strong>
                      {formatDate(
                        selected.decidedAt
                      )}
                    </strong>
                  </div>
                )}
              </div>
  
              <div className="modal-footer">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    setSelected(null)
                  }
                >
                  Đóng
                </button>
  
                {selected.status ===
                  "PENDING" && (
                  <>
                    <button
                      type="button"
                      className="danger-button"
                      disabled={
                        processingId ===
                        selected.id
                      }
                      onClick={() =>
                        void handleDecision(
                          selected,
                          "REJECTED"
                        )
                      }
                    >
                      <X size={16} />
                      Từ chối
                    </button>
  
                    <button
                      type="button"
                      className="primary-button"
                      disabled={
                        processingId ===
                        selected.id
                      }
                      onClick={() =>
                        void handleDecision(
                          selected,
                          "APPROVED"
                        )
                      }
                    >
                      <Check size={16} />
                      Duyệt đơn
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  export default AdminApplicationsPage;