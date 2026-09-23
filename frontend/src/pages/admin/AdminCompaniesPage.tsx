import axios from "axios";
import {
  Building2,
  Edit3,
  Eye,
  Plus,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import companyService from "../../services/companyService";

import type {
  CompanyResponse,
  CreateCompanyRequest,
  UpdateCompanyRequest,
} from "../../types/company";

type CompanyForm = {
  name: string;
  taxCode: string;
  contactEmail: string;
  isActive: boolean;
};

const emptyForm: CompanyForm = {
  name: "",
  taxCode: "",
  contactEmail: "",
  isActive: true,
};

function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<
    CompanyResponse[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] =
    useState(false);

  const [search, setSearch] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selected, setSelected] =
    useState<CompanyResponse | null>(null);

  const [editing, setEditing] =
    useState<CompanyResponse | null>(null);

  const [showForm, setShowForm] =
    useState(false);

  const [form, setForm] =
    useState<CompanyForm>(emptyForm);

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

  const loadCompanies = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await companyService.getAll();
      setCompanies(data);
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Không thể tải danh sách doanh nghiệp."
        )
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCompanies();
  }, [loadCompanies]);

  const filteredCompanies = useMemo(() => {
    const keyword = search
      .trim()
      .toLowerCase();

    if (!keyword) {
      return companies;
    }

    return companies.filter((company) => {
      return (
        company.name
          .toLowerCase()
          .includes(keyword) ||
        company.taxCode
          .toLowerCase()
          .includes(keyword) ||
        (company.contactEmail ?? "")
          .toLowerCase()
          .includes(keyword)
      );
    });
  }, [companies, search]);

  const activeCount = useMemo(
    () =>
      companies.filter(
        (company) => company.isActive
      ).length,
    [companies]
  );

  const inactiveCount =
    companies.length - activeCount;

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const openEdit = (
    company: CompanyResponse
  ) => {
    setEditing(company);

    setForm({
      name: company.name,
      taxCode: company.taxCode,
      contactEmail:
        company.contactEmail ?? "",
      isActive: company.isActive,
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

    setProcessing(true);
    setError("");
    setSuccess("");

    try {
      if (editing) {
        const request: UpdateCompanyRequest = {
          name: form.name.trim(),
          taxCode: form.taxCode.trim(),
          contactEmail:
            form.contactEmail.trim() || null,
          isActive: form.isActive,
        };

        const updated =
          await companyService.update(
            editing.id,
            request
          );

        setCompanies((current) =>
          current.map((company) =>
            company.id === updated.id
              ? updated
              : company
          )
        );

        setSelected((current) =>
          current?.id === updated.id
            ? updated
            : current
        );

        setSuccess(
          "Cập nhật doanh nghiệp thành công."
        );
      } else {
        const request: CreateCompanyRequest = {
          name: form.name.trim(),
          taxCode: form.taxCode.trim(),
          contactEmail:
            form.contactEmail.trim() || null,
        };

        const created =
          await companyService.create(request);

        setCompanies((current) => [
          created,
          ...current,
        ]);

        setSuccess(
          "Tạo doanh nghiệp thành công."
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
            ? "Không thể cập nhật doanh nghiệp."
            : "Không thể tạo doanh nghiệp."
        )
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleDeactivate = async (
    company: CompanyResponse
  ) => {
    if (!company.isActive) {
      return;
    }

    const confirmed = window.confirm(
      `Bạn có chắc muốn ngừng hoạt động doanh nghiệp "${company.name}"?`
    );

    if (!confirmed) {
      return;
    }

    setProcessing(true);
    setError("");
    setSuccess("");

    try {
      await companyService.deactivate(
        company.id
      );

      // Backend DELETE là soft-delete nên tải lại
      // để lấy trạng thái IsActive mới nhất.
      await loadCompanies();

      setSelected(null);

      setSuccess(
        "Đã ngừng hoạt động doanh nghiệp."
      );
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Không thể ngừng hoạt động doanh nghiệp."
        )
      );
    } finally {
      setProcessing(false);
    }
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
          <h1>Quản lý doanh nghiệp</h1>
          <p>
            Quản lý các doanh nghiệp tiếp nhận
            sinh viên thực tập.
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
              void loadCompanies()
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
            Thêm doanh nghiệp
          </button>
        </div>
      </div>

      <section className="application-summary-grid">
        <div className="application-summary-card">
          <div className="summary-icon all">
            <Building2 size={19} />
          </div>

          <div>
            <span>Tổng doanh nghiệp</span>
            <strong>{companies.length}</strong>
          </div>
        </div>

        <div className="application-summary-card">
          <div>
            <span>Đang hoạt động</span>
            <strong>{activeCount}</strong>
          </div>
        </div>

        <div className="application-summary-card">
          <div>
            <span>Ngừng hoạt động</span>
            <strong>{inactiveCount}</strong>
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
              placeholder="Tìm tên, mã số thuế, email..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />
          </div>
        </div>

        {loading ? (
          <div className="table-empty">
            Đang tải danh sách doanh nghiệp...
          </div>
        ) : filteredCompanies.length ===
          0 ? (
          <div className="table-empty">
            Không tìm thấy doanh nghiệp.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Doanh nghiệp</th>
                  <th>Mã số thuế</th>
                  <th>Email liên hệ</th>
                  <th>Trạng thái</th>
                  <th>Cập nhật</th>
                  <th>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {filteredCompanies.map(
                  (company) => (
                    <tr key={company.id}>
                      <td>
                        <strong className="table-primary">
                          {company.name}
                        </strong>
                      </td>

                      <td>
                        {company.taxCode}
                      </td>

                      <td>
                        {company.contactEmail ??
                          "—"}
                      </td>

                      <td>
                        <span
                          className={`status-badge ${
                            company.isActive
                              ? "approved"
                              : "rejected"
                          }`}
                        >
                          {company.isActive
                            ? "Hoạt động"
                            : "Ngừng hoạt động"}
                        </span>
                      </td>

                      <td>
                        {formatDate(
                          company.updatedAt
                        )}
                      </td>

                      <td>
                        <div className="table-actions">
                          <button
                            type="button"
                            className="icon-action view"
                            title="Xem chi tiết"
                            onClick={() =>
                              setSelected(
                                company
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
                              openEdit(company)
                            }
                          >
                            <Edit3
                              size={16}
                            />
                          </button>

                          {company.isActive && (
                            <button
                              type="button"
                              className="icon-action reject"
                              title="Ngừng hoạt động"
                              disabled={
                                processing
                              }
                              onClick={() =>
                                void handleDeactivate(
                                  company
                                )
                              }
                            >
                              <X size={16} />
                            </button>
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

      {/* CREATE / EDIT */}
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
                    ? "Cập nhật doanh nghiệp"
                    : "Thêm doanh nghiệp"}
                </h2>

                <p>
                  {editing
                    ? "Chỉnh sửa thông tin doanh nghiệp."
                    : "Thêm doanh nghiệp tiếp nhận thực tập mới."}
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
                  <span>
                    Tên doanh nghiệp
                  </span>

                  <input
                    required
                    maxLength={200}
                    value={form.name}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        name: event.target
                          .value,
                      })
                    }
                  />
                </label>

                <label className="application-form-field">
                  <span>Mã số thuế</span>

                  <input
                    required
                    maxLength={50}
                    value={form.taxCode}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        taxCode:
                          event.target.value,
                      })
                    }
                  />
                </label>

                <label className="application-form-field">
                  <span>Email liên hệ</span>

                  <input
                    type="email"
                    maxLength={320}
                    value={
                      form.contactEmail
                    }
                    onChange={(event) =>
                      setForm({
                        ...form,
                        contactEmail:
                          event.target.value,
                      })
                    }
                  />
                </label>

                {editing && (
                  <label>
                    <input
                      type="checkbox"
                      checked={
                        form.isActive
                      }
                      onChange={(event) =>
                        setForm({
                          ...form,
                          isActive:
                            event.target
                              .checked,
                        })
                      }
                    />{" "}
                    Doanh nghiệp đang
                    hoạt động
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
                    : "Thêm doanh nghiệp"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL */}
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
                <h2>{selected.name}</h2>
                <p>
                  Thông tin chi tiết doanh nghiệp
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
                <span>Tên doanh nghiệp</span>
                <strong>
                  {selected.name}
                </strong>
              </div>

              <div>
                <span>Mã số thuế</span>
                <strong>
                  {selected.taxCode}
                </strong>
              </div>

              <div>
                <span>Email liên hệ</span>
                <strong>
                  {selected.contactEmail ??
                    "—"}
                </strong>
              </div>

              <div>
                <span>Trạng thái</span>
                <strong>
                  {selected.isActive
                    ? "Đang hoạt động"
                    : "Ngừng hoạt động"}
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
                <span>Cập nhật gần nhất</span>
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
                  const company =
                    selected;

                  setSelected(null);
                  openEdit(company);
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

export default AdminCompaniesPage;