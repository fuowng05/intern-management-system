import axios from "axios";
import {
  CalendarDays,
  Edit3,
  Eye,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import internshipPeriodService from "../../services/internshipPeriodService";

import type {
  CreateInternshipPeriodRequest,
  InternshipPeriodResponse,
  InternshipPeriodStatus,
  UpdateInternshipPeriodRequest,
} from "../../types/internshipPeriod";

type PeriodForm = {
  code: string;
  name: string;
  startDate: string;
  endDate: string;
  status: InternshipPeriodStatus;
};

const emptyForm: PeriodForm = {
  code: "",
  name: "",
  startDate: "",
  endDate: "",
  status: "DRAFT",
};

function AdminInternshipPeriodsPage() {
  const [periods, setPeriods] = useState<
    InternshipPeriodResponse[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] =
    useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"ALL" | InternshipPeriodStatus>(
      "ALL"
    );

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selected, setSelected] =
    useState<InternshipPeriodResponse | null>(
      null
    );

  const [editing, setEditing] =
    useState<InternshipPeriodResponse | null>(
      null
    );

  const [showForm, setShowForm] =
    useState(false);

  const [form, setForm] =
    useState<PeriodForm>(emptyForm);

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

  const loadPeriods = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data =
        await internshipPeriodService.getAll();

      setPeriods(data);
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Không thể tải danh sách đợt thực tập."
        )
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPeriods();
  }, [loadPeriods]);

  const counts = useMemo(
    () => ({
      total: periods.length,
      draft: periods.filter(
        (period) => period.status === "DRAFT"
      ).length,
      open: periods.filter(
        (period) => period.status === "OPEN"
      ).length,
      closed: periods.filter(
        (period) => period.status === "CLOSED"
      ).length,
    }),
    [periods]
  );

  const filteredPeriods = useMemo(() => {
    const keyword = search
      .trim()
      .toLowerCase();

    return periods.filter((period) => {
      const matchesStatus =
        statusFilter === "ALL" ||
        period.status === statusFilter;

      const matchesSearch =
        !keyword ||
        period.code
          .toLowerCase()
          .includes(keyword) ||
        period.name
          .toLowerCase()
          .includes(keyword);

      return matchesStatus && matchesSearch;
    });
  }, [periods, search, statusFilter]);

  const toDateInput = (value: string) => {
    if (!value) {
      return "";
    }

    return value.substring(0, 10);
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const openEdit = (
    period: InternshipPeriodResponse
  ) => {
    setEditing(period);

    setForm({
      code: period.code,
      name: period.name,
      startDate: toDateInput(
        period.startDate
      ),
      endDate: toDateInput(period.endDate),
      status: period.status,
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const closeForm = () => {
    if (processing) {
      return;
    }

    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (
      new Date(form.endDate) <
      new Date(form.startDate)
    ) {
      setError(
        "Ngày kết thúc phải từ ngày bắt đầu trở đi."
      );
      return;
    }

    setProcessing(true);
    setError("");
    setSuccess("");

    try {
      if (editing) {
        const request: UpdateInternshipPeriodRequest =
          {
            code: form.code.trim(),
            name: form.name.trim(),
            startDate: form.startDate,
            endDate: form.endDate,
            status: form.status,
          };

        const updated =
          await internshipPeriodService.update(
            editing.id,
            request
          );

        setPeriods((current) =>
          current.map((period) =>
            period.id === updated.id
              ? updated
              : period
          )
        );

        setSelected((current) =>
          current?.id === updated.id
            ? updated
            : current
        );

        setSuccess(
          "Cập nhật đợt thực tập thành công."
        );
      } else {
        const request: CreateInternshipPeriodRequest =
          {
            code: form.code.trim(),
            name: form.name.trim(),
            startDate: form.startDate,
            endDate: form.endDate,
          };

        const created =
          await internshipPeriodService.create(
            request
          );

        setPeriods((current) => [
          created,
          ...current,
        ]);

        setSuccess(
          "Tạo đợt thực tập thành công."
        );
      }

      setShowForm(false);
      setEditing(null);
      setForm(emptyForm);
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          editing
            ? "Không thể cập nhật đợt thực tập."
            : "Không thể tạo đợt thực tập."
        )
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (
    period: InternshipPeriodResponse
  ) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa đợt "${period.code} - ${period.name}"?`
    );

    if (!confirmed) {
      return;
    }

    setProcessing(true);
    setError("");
    setSuccess("");

    try {
      await internshipPeriodService.remove(
        period.id
      );

      setPeriods((current) =>
        current.filter(
          (item) => item.id !== period.id
        )
      );

      setSelected(null);

      setSuccess(
        "Xóa đợt thực tập thành công."
      );
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Không thể xóa đợt thực tập."
        )
      );
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(value));

  const statusLabel = (
    status: InternshipPeriodStatus
  ) => {
    switch (status) {
      case "OPEN":
        return "Đang mở";
      case "CLOSED":
        return "Đã đóng";
      default:
        return "Bản nháp";
    }
  };

  const statusClass = (
    status: InternshipPeriodStatus
  ) => {
    switch (status) {
      case "OPEN":
        return "approved";
      case "CLOSED":
        return "rejected";
      default:
        return "pending";
    }
  };

  return (
    <div className="applications-page">
      <div className="page-heading applications-heading">
        <div>
          <h1>Quản lý đợt thực tập</h1>
          <p>
            Tạo và quản lý các đợt đăng ký thực
            tập của sinh viên.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
          }}
        >
          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              void loadPeriods()
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

          <button
            type="button"
            className="primary-button"
            onClick={openCreate}
          >
            <Plus size={16} />
            Tạo đợt thực tập
          </button>
        </div>
      </div>

      <section className="application-summary-grid">
        <div className="application-summary-card">
          <div className="summary-icon all">
            <CalendarDays size={19} />
          </div>
          <div>
            <span>Tổng số</span>
            <strong>{counts.total}</strong>
          </div>
        </div>

        <div className="application-summary-card">
          <div>
            <span>Bản nháp</span>
            <strong>{counts.draft}</strong>
          </div>
        </div>

        <div className="application-summary-card">
          <div>
            <span>Đang mở</span>
            <strong>{counts.open}</strong>
          </div>
        </div>

        <div className="application-summary-card">
          <div>
            <span>Đã đóng</span>
            <strong>{counts.closed}</strong>
          </div>
        </div>
      </section>

      {error && (
        <div className="applications-error">
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            marginBottom: 16,
            padding: "11px 14px",
            color: "#067647",
            background: "#ecfdf3",
            border:
              "1px solid #abefc6",
            borderRadius: 8,
            fontSize: 13,
          }}
        >
          {success}
        </div>
      )}

      <section className="table-panel">
        <div className="table-toolbar">
          <div className="table-search">
            <Search size={17} />
            <input
              type="text"
              placeholder="Tìm mã hoặc tên đợt thực tập..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <select
            className="status-filter"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as
                  | "ALL"
                  | InternshipPeriodStatus
              )
            }
          >
            <option value="ALL">
              Tất cả trạng thái
            </option>
            <option value="DRAFT">
              Bản nháp
            </option>
            <option value="OPEN">
              Đang mở
            </option>
            <option value="CLOSED">
              Đã đóng
            </option>
          </select>
        </div>

        {loading ? (
          <div className="table-empty">
            Đang tải đợt thực tập...
          </div>
        ) : filteredPeriods.length === 0 ? (
          <div className="table-empty">
            Không tìm thấy đợt thực tập.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã đợt</th>
                  <th>Tên đợt</th>
                  <th>Thời gian</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {filteredPeriods.map(
                  (period) => (
                    <tr key={period.id}>
                      <td>
                        <strong className="table-primary">
                          {period.code}
                        </strong>
                      </td>

                      <td>{period.name}</td>

                      <td>
                        {formatDate(
                          period.startDate
                        )}
                        {" → "}
                        {formatDate(
                          period.endDate
                        )}
                      </td>

                      <td>
                        <span
                          className={`status-badge ${statusClass(
                            period.status
                          )}`}
                        >
                          {statusLabel(
                            period.status
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
                                period
                              )
                            }
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            type="button"
                            className="icon-action approve"
                            title="Chỉnh sửa"
                            onClick={() =>
                              openEdit(period)
                            }
                          >
                            <Edit3
                              size={16}
                            />
                          </button>

                          <button
                            type="button"
                            className="icon-action reject"
                            title="Xóa"
                            disabled={
                              processing
                            }
                            onClick={() =>
                              void handleDelete(
                                period
                              )
                            }
                          >
                            <Trash2
                              size={16}
                            />
                          </button>
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

      {showForm && (
        <div
          className="modal-backdrop"
          onMouseDown={closeForm}
        >
          <div
            className="detail-modal"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <h2>
                  {editing
                    ? "Cập nhật đợt thực tập"
                    : "Tạo đợt thực tập"}
                </h2>
                <p>
                  Thiết lập thời gian và trạng
                  thái của đợt thực tập.
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={closeForm}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div
                className="detail-grid"
                style={{ padding: 20 }}
              >
                <label className="application-form-field">
                  <span>Mã đợt</span>
                  <input
                    required
                    maxLength={50}
                    value={form.code}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        code: event.target.value,
                      })
                    }
                    placeholder="TT-2026-03"
                  />
                </label>

                <label className="application-form-field">
                  <span>Tên đợt</span>
                  <input
                    required
                    maxLength={200}
                    value={form.name}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        name: event.target.value,
                      })
                    }
                    placeholder="Đợt thực tập..."
                  />
                </label>

                <label className="application-form-field">
                  <span>Ngày bắt đầu</span>
                  <input
                    required
                    type="date"
                    value={form.startDate}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        startDate:
                          event.target.value,
                      })
                    }
                  />
                </label>

                <label className="application-form-field">
                  <span>Ngày kết thúc</span>
                  <input
                    required
                    type="date"
                    value={form.endDate}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        endDate:
                          event.target.value,
                      })
                    }
                  />
                </label>

                {editing && (
                  <label className="application-form-field">
                    <span>Trạng thái</span>

                    <select
                      value={form.status}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          status:
                            event.target
                              .value as InternshipPeriodStatus,
                        })
                      }
                    >
                      <option value="DRAFT">
                        Bản nháp
                      </option>
                      <option value="OPEN">
                        Đang mở
                      </option>
                      <option value="CLOSED">
                        Đã đóng
                      </option>
                    </select>
                  </label>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeForm}
                  disabled={processing}
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={processing}
                >
                  {processing
                    ? "Đang lưu..."
                    : editing
                    ? "Lưu thay đổi"
                    : "Tạo đợt"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                <h2>{selected.code}</h2>
                <p>{selected.name}</p>
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
                <span>Mã đợt</span>
                <strong>
                  {selected.code}
                </strong>
              </div>

              <div>
                <span>Trạng thái</span>
                <strong>
                  {statusLabel(
                    selected.status
                  )}
                </strong>
              </div>

              <div>
                <span>Ngày bắt đầu</span>
                <strong>
                  {formatDate(
                    selected.startDate
                  )}
                </strong>
              </div>

              <div>
                <span>Ngày kết thúc</span>
                <strong>
                  {formatDate(
                    selected.endDate
                  )}
                </strong>
              </div>

              <div>
                <span>Ngày tạo</span>
                <strong>
                  {formatDate(
                    selected.createdAt
                  )}
                </strong>
              </div>

              <div>
                <span>Cập nhật</span>
                <strong>
                  {formatDate(
                    selected.updatedAt
                  )}
                </strong>
              </div>
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

              <button
                type="button"
                className="primary-button"
                onClick={() => {
                  const period = selected;
                  setSelected(null);
                  openEdit(period);
                }}
              >
                <Edit3 size={16} />
                Chỉnh sửa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminInternshipPeriodsPage;