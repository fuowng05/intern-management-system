import axios from "axios";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Plus,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import applicationService from "../../services/applicationService";
import companyService from "../../services/companyService";
import internshipPeriodService from "../../services/internshipPeriodService";

import type { ApplicationResponse } from "../../types/application";
import type { CompanyResponse } from "../../types/company";
import type { InternshipPeriodResponse } from "../../types/internshipPeriod";

function StudentApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationResponse[]>([]);
  const [companies, setCompanies] = useState<CompanyResponse[]>([]);
  const [periods, setPeriods] = useState<InternshipPeriodResponse[]>([]);

  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [periodId, setPeriodId] = useState("");
  const [companyId, setCompanyId] = useState("");

  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");

  const getErrorMessage = (err: unknown, fallback: string) => {
    if (axios.isAxiosError(err)) {
      return (
        err.response?.data?.message ??
        err.response?.data?.title ??
        fallback
      );
    }

    return fallback;
  };

  const loadApplications = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await applicationService.getMyApplications();
      setApplications(data);
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Không thể tải danh sách đơn thực tập."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadApplications();
  }, []);

  const openModal = async () => {
    setShowModal(true);
    setFormLoading(true);
    setFormError("");
    setSuccess("");
    setPeriodId("");
    setCompanyId("");

    try {
      const [periodData, companyData] = await Promise.all([
        internshipPeriodService.getAll(),
        companyService.getAll(),
      ]);

      setPeriods(periodData);
      setCompanies(companyData);
    } catch (err) {
      setFormError(
        getErrorMessage(
          err,
          "Không thể tải dữ liệu đăng ký."
        )
      );
    } finally {
      setFormLoading(false);
    }
  };

  const closeModal = () => {
    if (submitting) return;

    setShowModal(false);
    setFormError("");
  };

  const availablePeriods = useMemo(() => {
    const registeredPeriodIds = new Set(
      applications.map((item) => item.periodId)
    );

    return periods.filter(
      (period) =>
        period.status.toUpperCase() === "OPEN" &&
        !registeredPeriodIds.has(period.id)
    );
  }, [periods, applications]);

  const activeCompanies = useMemo(
    () => companies.filter((company) => company.isActive),
    [companies]
  );

  const selectedPeriod = availablePeriods.find(
    (period) => period.id === periodId
  );

  const selectedCompany = activeCompanies.find(
    (company) => company.id === companyId
  );

  const handleCreate = async () => {
    if (!periodId) {
      setFormError("Vui lòng chọn đợt thực tập.");
      return;
    }

    if (!companyId) {
      setFormError("Vui lòng chọn doanh nghiệp.");
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      const created = await applicationService.create({
        periodId,
        companyId,
      });

      setApplications((current) =>
        [created, ...current].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        )
      );

      setShowModal(false);
      setPeriodId("");
      setCompanyId("");
      setSuccess("Nộp đơn thực tập thành công.");
    } catch (err) {
      setFormError(
        getErrorMessage(err, "Không thể nộp đơn thực tập.")
      );
    } finally {
      setSubmitting(false);
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "Đã duyệt";
      case "REJECTED":
        return "Từ chối";
      default:
        return "Chờ duyệt";
    }
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle2 size={13} />;
      case "REJECTED":
        return <XCircle size={13} />;
      default:
        return <Clock3 size={13} />;
    }
  };

  const formatDate = (value: string | null) => {
    if (!value) return "—";

    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(value));
  };

  return (
    <div className="student-applications-page">
      <div className="page-heading">
        <div>
          <h1>Đơn thực tập</h1>
          <p>Theo dõi và đăng ký các đợt thực tập của bạn.</p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() => void openModal()}
        >
          <Plus size={16} />
          Nộp đơn thực tập
        </button>
      </div>

      {error && (
        <div className="applications-error">{error}</div>
      )}

      {success && (
        <div className="evaluation-success">
          <CheckCircle2 size={16} />
          {success}
        </div>
      )}

      {loading ? (
        <div className="table-panel table-empty">
          Đang tải danh sách đơn thực tập...
        </div>
      ) : applications.length === 0 ? (
        <div className="student-application-empty">
          <div className="student-application-empty-icon">
            <FileText size={28} />
          </div>

          <h2>Bạn chưa có đơn thực tập</h2>

          <p>
            Hãy chọn đợt thực tập và doanh nghiệp để gửi
            đơn đăng ký.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={() => void openModal()}
          >
            <Plus size={16} />
            Nộp đơn đầu tiên
          </button>
        </div>
      ) : (
        <div className="student-application-list">
          {applications.map((application) => (
            <article
              key={application.id}
              className="student-application-card"
            >
              <div className="student-application-card-main">
                <div className="application-company-icon">
                  <Building2 size={21} />
                </div>

                <div className="application-main-info">
                  <div className="application-title-row">
                    <h2>{application.companyName}</h2>

                    <span
                      className={`student-application-status ${application.status.toLowerCase()}`}
                    >
                      {statusIcon(application.status)}
                      {statusLabel(application.status)}
                    </span>
                  </div>

                  <div className="application-period">
                    <strong>{application.periodCode}</strong>
                    <span>{application.periodName}</span>
                  </div>

                  <div className="application-dates">
                    <span>
                      <CalendarDays size={13} />
                      Nộp ngày {formatDate(application.createdAt)}
                    </span>

                    {application.decidedAt && (
                      <span>
                        <CheckCircle2 size={13} />
                        Xử lý ngày{" "}
                        {formatDate(application.decidedAt)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="student-application-card-footer">
                {application.status === "PENDING" &&
                  "Đơn đang chờ quản trị viên xét duyệt."}

                {application.status === "APPROVED" && (
                  <span className="approved-message">
                    <CheckCircle2 size={14} />
                    Đơn đã được phê duyệt.
                  </span>
                )}

                {application.status === "REJECTED" && (
                  <span className="rejected-message">
                    <XCircle size={14} />
                    Đơn đã bị từ chối.
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {showModal && (
        <div
          className="modal-backdrop"
          onMouseDown={closeModal}
        >
          <div
            className="detail-modal student-application-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>Nộp đơn thực tập</h2>
                <p>
                  Chọn đợt thực tập và doanh nghiệp bạn
                  muốn đăng ký.
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={closeModal}
                disabled={submitting}
              >
                <X size={20} />
              </button>
            </div>

            <div className="student-application-form">
              {formError && (
                <div className="applications-error">
                  {formError}
                </div>
              )}

              {formLoading ? (
                <div className="application-form-loading">
                  Đang tải dữ liệu đăng ký...
                </div>
              ) : (
                <>
                  <div className="application-form-field">
                    <label>Đợt thực tập</label>

                    <select
                      value={periodId}
                      onChange={(event) => {
                        setPeriodId(event.target.value);
                        setFormError("");
                      }}
                    >
                      <option value="">
                        -- Chọn đợt thực tập --
                      </option>

                      {availablePeriods.map((period) => (
                        <option
                          key={period.id}
                          value={period.id}
                        >
                          {period.code} - {period.name}
                        </option>
                      ))}
                    </select>

                    {availablePeriods.length === 0 && (
                      <small>
                        Không có đợt thực tập đang mở mà
                        bạn có thể đăng ký.
                      </small>
                    )}
                  </div>

                  {selectedPeriod && (
                    <div className="selected-period-info">
                      <CalendarDays size={17} />

                      <div>
                        <strong>{selectedPeriod.name}</strong>
                        <span>
                          {formatDate(selectedPeriod.startDate)}
                          {" - "}
                          {formatDate(selectedPeriod.endDate)}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="application-form-field">
                    <label>Doanh nghiệp</label>

                    <select
                      value={companyId}
                      onChange={(event) => {
                        setCompanyId(event.target.value);
                        setFormError("");
                      }}
                    >
                      <option value="">
                        -- Chọn doanh nghiệp --
                      </option>

                      {activeCompanies.map((company) => (
                        <option
                          key={company.id}
                          value={company.id}
                        >
                          {company.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedCompany && (
                    <div className="selected-company-info">
                      <Building2 size={17} />

                      <div>
                        <strong>{selectedCompany.name}</strong>
                        <span>
                          MST: {selectedCompany.taxCode}
                        </span>

                        {selectedCompany.contactEmail && (
                          <span>
                            {selectedCompany.contactEmail}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="secondary-button"
                onClick={closeModal}
                disabled={submitting}
              >
                Hủy
              </button>

              <button
                type="button"
                className="primary-button"
                onClick={() => void handleCreate()}
                disabled={
                  submitting ||
                  formLoading ||
                  !periodId ||
                  !companyId
                }
              >
                <FileText size={15} />
                {submitting ? "Đang nộp..." : "Nộp đơn"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentApplicationsPage;