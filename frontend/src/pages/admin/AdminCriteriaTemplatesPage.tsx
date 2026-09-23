import axios from "axios";
import {
  CheckCircle2,
  Eye,
  Plus,
  RefreshCw,
  Send,
  Trash2,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import criteriaTemplateService from "../../services/criteriaTemplateService";
import internshipPeriodService from "../../services/internshipPeriodService";

import type {
  AddCriteriaTemplateItemRequest,
  CriteriaTemplateResponse,
  CreateCriteriaTemplateRequest,
} from "../../types/criteriaTemplate";

import type {
  InternshipPeriodResponse,
} from "../../types/internshipPeriod";

const emptyTemplateForm: CreateCriteriaTemplateRequest = {
  periodId: "",
  code: "",
  name: "",
  minItems: 3,
  maxItems: 8,
  allowWeightEdit: true,
};

const emptyItemForm: AddCriteriaTemplateItemRequest = {
  name: "",
  defaultWeight: 0,
  isMandatory: true,
  minPassScore: 5,
  displayOrder: 1,
};

function AdminCriteriaTemplatesPage() {
  const [templates, setTemplates] = useState<
    CriteriaTemplateResponse[]
  >([]);

  const [periods, setPeriods] = useState<
    InternshipPeriodResponse[]
  >([]);

  const [selected, setSelected] =
    useState<CriteriaTemplateResponse | null>(null);

  const [showCreate, setShowCreate] =
    useState(false);

  const [templateForm, setTemplateForm] =
    useState<CreateCriteriaTemplateRequest>(
      emptyTemplateForm
    );

  const [itemForm, setItemForm] =
    useState<AddCriteriaTemplateItemRequest>(
      emptyItemForm
    );

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [templateData, periodData] =
        await Promise.all([
          criteriaTemplateService.getAll(),
          internshipPeriodService.getAll(),
        ]);

      setTemplates(templateData);
      setPeriods(periodData);
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Không thể tải danh sách bộ tiêu chí."
        )
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const draftCount = useMemo(
    () =>
      templates.filter(
        (item) => item.status === "DRAFT"
      ).length,
    [templates]
  );

  const publishedCount = useMemo(
    () =>
      templates.filter(
        (item) => item.status === "PUBLISHED"
      ).length,
    [templates]
  );

  const refreshSelected = async (
    id: string
  ) => {
    const updated =
      await criteriaTemplateService.getById(id);

    setSelected(updated);

    setTemplates((current) =>
      current.map((item) =>
        item.id === updated.id ? updated : item
      )
    );

    return updated;
  };

  const handleCreate = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setProcessing(true);
    setError("");
    setSuccess("");

    try {
      const created =
        await criteriaTemplateService.create(
          templateForm
        );

      setTemplates((current) => [
        created,
        ...current,
      ]);

      setSelected(created);
      setShowCreate(false);
      setTemplateForm(emptyTemplateForm);

      setSuccess(
        "Tạo bộ tiêu chí thành công. Hãy thêm các tiêu chí trước khi phát hành."
      );
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Không thể tạo bộ tiêu chí."
        )
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleAddItem = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!selected) {
      return;
    }

    setProcessing(true);
    setError("");
    setSuccess("");

    try {
      const updated =
        await criteriaTemplateService.addItem(
          selected.id,
          itemForm
        );

      setSelected(updated);

      setTemplates((current) =>
        current.map((item) =>
          item.id === updated.id
            ? updated
            : item
        )
      );

      setItemForm({
        ...emptyItemForm,
        displayOrder: updated.items.length + 1,
      });

      setSuccess("Thêm tiêu chí thành công.");
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Không thể thêm tiêu chí."
        )
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteItem = async (
    itemId: string
  ) => {
    if (!selected) {
      return;
    }

    if (
      !window.confirm(
        "Bạn có chắc muốn xóa tiêu chí này?"
      )
    ) {
      return;
    }

    setProcessing(true);
    setError("");
    setSuccess("");

    try {
      await criteriaTemplateService.deleteItem(
        selected.id,
        itemId
      );

      await refreshSelected(selected.id);

      setSuccess("Xóa tiêu chí thành công.");
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Không thể xóa tiêu chí."
        )
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleIssue = async () => {
    if (!selected) {
      return;
    }

    if (selected.items.length < selected.minItems) {
      setError(
        `Template cần ít nhất ${selected.minItems} tiêu chí.`
      );
      return;
    }

    if (selected.items.length > selected.maxItems) {
      setError(
        `Template chỉ được tối đa ${selected.maxItems} tiêu chí.`
      );
      return;
    }

    if (Number(selected.weightTotal) !== 100) {
      setError(
        `Tổng trọng số hiện tại là ${selected.weightTotal}%. Cần đúng 100% trước khi phát hành.`
      );
      return;
    }

    if (
      !window.confirm(
        "Sau khi phát hành, bộ tiêu chí sẽ được sử dụng để tạo Evaluation. Bạn có chắc muốn tiếp tục?"
      )
    ) {
      return;
    }

    setProcessing(true);
    setError("");
    setSuccess("");

    try {
      const updated =
        await criteriaTemplateService.issue(
          selected.id
        );

      setSelected(updated);

      setTemplates((current) =>
        current.map((item) =>
          item.id === updated.id
            ? updated
            : item
        )
      );

      setSuccess(
        "Phát hành bộ tiêu chí thành công."
      );
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Không thể phát hành bộ tiêu chí."
        )
      );
    } finally {
      setProcessing(false);
    }
  };

  const openDetail = async (
    template: CriteriaTemplateResponse
  ) => {
    setError("");

    try {
      const detail =
        await criteriaTemplateService.getById(
          template.id
        );

      setSelected(detail);

      setItemForm({
        ...emptyItemForm,
        displayOrder: detail.items.length + 1,
      });
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Không thể tải chi tiết bộ tiêu chí."
        )
      );
    }
  };

  return (
    <div className="applications-page">
      <div className="page-heading applications-heading">
        <div>
          <h1>Quản lý bộ tiêu chí</h1>
          <p>
            Tạo và phát hành bộ tiêu chí đánh giá
            cho từng đợt thực tập.
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
            onClick={() => void loadData()}
            disabled={loading}
          >
            <RefreshCw
              size={16}
              className={loading ? "spin-icon" : ""}
            />
            Làm mới
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={() => {
              setError("");
              setSuccess("");
              setShowCreate(true);
            }}
          >
            <Plus size={16} />
            Tạo bộ tiêu chí
          </button>
        </div>
      </div>

      <section className="application-summary-grid">
        <div className="application-summary-card">
          <div>
            <span>Tổng số</span>
            <strong>{templates.length}</strong>
          </div>
        </div>

        <div className="application-summary-card">
          <div>
            <span>Bản nháp</span>
            <strong>{draftCount}</strong>
          </div>
        </div>

        <div className="application-summary-card">
          <div>
            <span>Đã phát hành</span>
            <strong>{publishedCount}</strong>
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
            border: "1px solid #abefc6",
            borderRadius: 8,
            fontSize: 13,
          }}
        >
          {success}
        </div>
      )}

      <section className="table-panel">
        {loading ? (
          <div className="table-empty">
            Đang tải bộ tiêu chí...
          </div>
        ) : templates.length === 0 ? (
          <div className="table-empty">
            Chưa có bộ tiêu chí nào.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Tên bộ tiêu chí</th>
                  <th>Đợt thực tập</th>
                  <th>Phiên bản</th>
                  <th>Tiêu chí</th>
                  <th>Trọng số</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {templates.map((template) => (
                  <tr key={template.id}>
                    <td>
                      <strong className="table-primary">
                        {template.code}
                      </strong>
                    </td>

                    <td>{template.name}</td>

                    <td>{template.periodCode}</td>

                    <td>v{template.version}</td>

                    <td>
                      {template.items.length}
                    </td>

                    <td>
                      <strong>
                        {template.weightTotal}%
                      </strong>
                    </td>

                    <td>
                      <span
                        className={`status-badge ${
                          template.status ===
                          "PUBLISHED"
                            ? "approved"
                            : "pending"
                        }`}
                      >
                        {template.status ===
                        "PUBLISHED"
                          ? "Đã phát hành"
                          : "Bản nháp"}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="icon-action view"
                        title="Xem chi tiết"
                        onClick={() =>
                          void openDetail(template)
                        }
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* CREATE TEMPLATE */}
      {showCreate && (
        <div
          className="modal-backdrop"
          onMouseDown={() =>
            setShowCreate(false)
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
                <h2>Tạo bộ tiêu chí</h2>
                <p>
                  Tạo template đánh giá cho một
                  đợt thực tập.
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={() =>
                  setShowCreate(false)
                }
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div
                className="detail-grid"
                style={{ padding: 20 }}
              >
                <label className="application-form-field">
                  <span>Đợt thực tập</span>

                  <select
                    required
                    value={templateForm.periodId}
                    onChange={(event) =>
                      setTemplateForm({
                        ...templateForm,
                        periodId:
                          event.target.value,
                      })
                    }
                  >
                    <option value="">
                      -- Chọn đợt --
                    </option>

                    {periods.map((period) => (
                      <option
                        key={period.id}
                        value={period.id}
                      >
                        {period.code} -{" "}
                        {period.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="application-form-field">
                  <span>Mã bộ tiêu chí</span>
                  <input
                    required
                    value={templateForm.code}
                    onChange={(event) =>
                      setTemplateForm({
                        ...templateForm,
                        code: event.target.value,
                      })
                    }
                    placeholder="EVAL-2026-02"
                  />
                </label>

                <label className="application-form-field">
                  <span>Tên bộ tiêu chí</span>
                  <input
                    required
                    value={templateForm.name}
                    onChange={(event) =>
                      setTemplateForm({
                        ...templateForm,
                        name: event.target.value,
                      })
                    }
                    placeholder="Bộ tiêu chí đánh giá thực tập học kỳ II 2026"
                  />
                </label>

                <label className="application-form-field">
                  <span>Số tiêu chí tối thiểu</span>
                  <input
                    type="number"
                    min={1}
                    value={templateForm.minItems}
                    onChange={(event) =>
                      setTemplateForm({
                        ...templateForm,
                        minItems: Number(
                          event.target.value
                        ),
                      })
                    }
                  />
                </label>

                <label className="application-form-field">
                  <span>Số tiêu chí tối đa</span>
                  <input
                    type="number"
                    min={1}
                    value={templateForm.maxItems}
                    onChange={(event) =>
                      setTemplateForm({
                        ...templateForm,
                        maxItems: Number(
                          event.target.value
                        ),
                      })
                    }
                  />
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={
                      templateForm.allowWeightEdit
                    }
                    onChange={(event) =>
                      setTemplateForm({
                        ...templateForm,
                        allowWeightEdit:
                          event.target.checked,
                      })
                    }
                  />{" "}
                  Cho phép sửa trọng số
                </label>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    setShowCreate(false)
                  }
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={processing}
                >
                  <Plus size={16} />
                  {processing
                    ? "Đang tạo..."
                    : "Tạo template"}
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
            style={{ maxWidth: 900 }}
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <h2>{selected.name}</h2>
                <p>
                  {selected.code} ·{" "}
                  {selected.periodCode} · v
                  {selected.version}
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

            <div style={{ padding: 20 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  marginBottom: 16,
                }}
              >
                <div>
                  <strong>
                    Tổng trọng số:{" "}
                    {selected.weightTotal}%
                  </strong>
                </div>

                <span
                  className={`status-badge ${
                    selected.status === "PUBLISHED"
                      ? "approved"
                      : "pending"
                  }`}
                >
                  {selected.status}
                </span>
              </div>

              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Tiêu chí</th>
                      <th>Trọng số</th>
                      <th>Bắt buộc</th>
                      <th>Điểm đạt</th>
                      {selected.status ===
                        "DRAFT" && <th />}
                    </tr>
                  </thead>

                  <tbody>
                    {selected.items.length ===
                    0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          style={{
                            textAlign: "center",
                          }}
                        >
                          Chưa có tiêu chí.
                        </td>
                      </tr>
                    ) : (
                      selected.items
                        .slice()
                        .sort(
                          (a, b) =>
                            a.displayOrder -
                            b.displayOrder
                        )
                        .map((item) => (
                          <tr key={item.id}>
                            <td>
                              {item.displayOrder}
                            </td>
                            <td>{item.name}</td>
                            <td>
                              {item.defaultWeight}%
                            </td>
                            <td>
                              {item.isMandatory
                                ? "Có"
                                : "Không"}
                            </td>
                            <td>
                              {item.minPassScore ??
                                "—"}
                            </td>

                            {selected.status ===
                              "DRAFT" && (
                              <td>
                                <button
                                  type="button"
                                  className="icon-action reject"
                                  title="Xóa"
                                  disabled={
                                    processing
                                  }
                                  onClick={() =>
                                    void handleDeleteItem(
                                      item.id
                                    )
                                  }
                                >
                                  <Trash2
                                    size={15}
                                  />
                                </button>
                              </td>
                            )}
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>

              {selected.status === "DRAFT" && (
                <form
                  onSubmit={handleAddItem}
                  style={{
                    marginTop: 20,
                    paddingTop: 20,
                    borderTop:
                      "1px solid #eaecf0",
                  }}
                >
                  <h3>Thêm tiêu chí</h3>

                  <div
                    className="detail-grid"
                    style={{ marginTop: 14 }}
                  >
                    <label className="application-form-field">
                      <span>Tên tiêu chí</span>
                      <input
                        required
                        value={itemForm.name}
                        onChange={(event) =>
                          setItemForm({
                            ...itemForm,
                            name: event.target.value,
                          })
                        }
                      />
                    </label>

                    <label className="application-form-field">
                      <span>Trọng số (%)</span>
                      <input
                        required
                        type="number"
                        min="0.01"
                        max="100"
                        step="0.01"
                        value={
                          itemForm.defaultWeight
                        }
                        onChange={(event) =>
                          setItemForm({
                            ...itemForm,
                            defaultWeight: Number(
                              event.target.value
                            ),
                          })
                        }
                      />
                    </label>

                    <label className="application-form-field">
                      <span>Điểm đạt tối thiểu</span>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={
                          itemForm.minPassScore ??
                          ""
                        }
                        onChange={(event) =>
                          setItemForm({
                            ...itemForm,
                            minPassScore:
                              event.target.value ===
                              ""
                                ? null
                                : Number(
                                    event.target
                                      .value
                                  ),
                          })
                        }
                      />
                    </label>

                    <label className="application-form-field">
                      <span>Thứ tự</span>
                      <input
                        type="number"
                        value={
                          itemForm.displayOrder
                        }
                        onChange={(event) =>
                          setItemForm({
                            ...itemForm,
                            displayOrder: Number(
                              event.target.value
                            ),
                          })
                        }
                      />
                    </label>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent:
                        "space-between",
                      marginTop: 14,
                    }}
                  >
                    <label>
                      <input
                        type="checkbox"
                        checked={
                          itemForm.isMandatory
                        }
                        onChange={(event) =>
                          setItemForm({
                            ...itemForm,
                            isMandatory:
                              event.target.checked,
                          })
                        }
                      />{" "}
                      Tiêu chí bắt buộc
                    </label>

                    <button
                      type="submit"
                      className="secondary-button"
                      disabled={processing}
                    >
                      <Plus size={16} />
                      Thêm tiêu chí
                    </button>
                  </div>
                </form>
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

              {selected.status === "DRAFT" && (
                <button
                  type="button"
                  className="primary-button"
                  disabled={processing}
                  onClick={() =>
                    void handleIssue()
                  }
                >
                  {selected.weightTotal === 100 ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <Send size={16} />
                  )}

                  Phát hành
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCriteriaTemplatesPage;