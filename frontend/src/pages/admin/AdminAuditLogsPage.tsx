import axios from "axios";
import {
  Activity,
  Eye,
  FileClock,
  RefreshCw,
  Search,
  UserRound,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import auditLogService from "../../services/auditLogService";

import type {
  AuditLogResponse,
} from "../../types/auditLog";

function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<
    AuditLogResponse[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] =
    useState("");

  const [actionFilter, setActionFilter] =
    useState("ALL");

  const [
    entityTypeFilter,
    setEntityTypeFilter,
  ] = useState("ALL");

  const [selected, setSelected] =
    useState<AuditLogResponse | null>(
      null
    );

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

  const loadLogs = useCallback(
    async () => {
      setLoading(true);
      setError("");

      try {
        const data =
          await auditLogService.getAll();

        setLogs(data);
      } catch (err) {
        setError(
          getErrorMessage(
            err,
            "Không thể tải nhật ký hệ thống."
          )
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    void loadLogs();
  }, [loadLogs]);

  const actions = useMemo(() => {
    return Array.from(
      new Set(
        logs
          .map((log) => log.action)
          .filter(Boolean)
      )
    ).sort();
  }, [logs]);

  const entityTypes = useMemo(() => {
    return Array.from(
      new Set(
        logs
          .map(
            (log) => log.entityType
          )
          .filter(Boolean)
      )
    ).sort();
  }, [logs]);

  const filteredLogs = useMemo(() => {
    const keyword = search
      .trim()
      .toLowerCase();

    return logs.filter((log) => {
      const matchesAction =
        actionFilter === "ALL" ||
        log.action === actionFilter;

      const matchesEntity =
        entityTypeFilter === "ALL" ||
        log.entityType ===
          entityTypeFilter;

      const matchesSearch =
        !keyword ||
        (log.actorName ?? "")
          .toLowerCase()
          .includes(keyword) ||
        (log.actorEmail ?? "")
          .toLowerCase()
          .includes(keyword) ||
        log.action
          .toLowerCase()
          .includes(keyword) ||
        log.entityType
          .toLowerCase()
          .includes(keyword) ||
        log.entityId
          .toLowerCase()
          .includes(keyword) ||
        log.correlationId
          .toLowerCase()
          .includes(keyword) ||
        (log.reason ?? "")
          .toLowerCase()
          .includes(keyword);

      return (
        matchesAction &&
        matchesEntity &&
        matchesSearch
      );
    });
  }, [
    logs,
    search,
    actionFilter,
    entityTypeFilter,
  ]);

  const actorCount = useMemo(() => {
    const actors = new Set(
      logs
        .map(
          (log) =>
            log.actorUserId ??
            log.actorEmail
        )
        .filter(Boolean)
    );

    return actors.size;
  }, [logs]);

  const entityCount = useMemo(() => {
    return new Set(
      logs.map(
        (log) =>
          `${log.entityType}:${log.entityId}`
      )
    ).size;
  }, [logs]);

  const formatDate = (
    value: string
  ) => {
    return new Intl.DateTimeFormat(
      "vi-VN",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }
    ).format(new Date(value));
  };

  const statusLabel = (
    value: string | null
  ) => {
    if (!value) {
      return "—";
    }

    switch (value) {
      case "DRAFT":
        return "Bản nháp";

      case "PENDING":
        return "Chờ xử lý";

      case "APPROVED":
        return "Đã duyệt";

      case "REJECTED":
        return "Từ chối";

      case "SUBMITTED":
        return "Đã gửi";

      case "RETURNED":
        return "Trả lại";

      case "PUBLISHED":
        return "Đã công bố";

      case "OPEN":
        return "Đang mở";

      case "CLOSED":
        return "Đã đóng";

      default:
        return value;
    }
  };

  const actionLabel = (
    value: string
  ) => {
    switch (value) {
      case "CREATE":
        return "Tạo mới";

      case "UPDATE":
        return "Cập nhật";

      case "DELETE":
        return "Xóa";

      case "SUBMIT":
        return "Gửi đánh giá";

      case "RETURN":
        return "Trả lại";

      case "PUBLISH":
        return "Công bố";

      case "APPROVE":
        return "Phê duyệt";

      case "REJECT":
        return "Từ chối";

      case "ASSIGN":
        return "Phân công";

      default:
        return value;
    }
  };

  return (
    <div className="applications-page">
      <div className="page-heading applications-heading">
        <div>
          <h1>Nhật ký hệ thống</h1>

          <p>
            Theo dõi các thao tác và thay
            đổi quan trọng trong hệ thống.
          </p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={() =>
            void loadLogs()
          }
          disabled={loading}
        >
          <RefreshCw
            size={16}
            className={
              loading
                ? "spin-icon"
                : ""
            }
          />

          Làm mới
        </button>
      </div>

      <section className="application-summary-grid">
        <div className="application-summary-card">
          <div className="summary-icon all">
            <FileClock size={19} />
          </div>

          <div>
            <span>Tổng nhật ký</span>
            <strong>
              {logs.length}
            </strong>
          </div>
        </div>

        <div className="application-summary-card">
          <div>
            <UserRound size={19} />
          </div>

          <div>
            <span>Người thực hiện</span>
            <strong>
              {actorCount}
            </strong>
          </div>
        </div>

        <div className="application-summary-card">
          <div>
            <Activity size={19} />
          </div>

          <div>
            <span>Đối tượng thay đổi</span>
            <strong>
              {entityCount}
            </strong>
          </div>
        </div>

        <div className="application-summary-card">
          <div>
            <Activity size={19} />
          </div>

          <div>
            <span>Loại hành động</span>
            <strong>
              {actions.length}
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
              placeholder="Tìm người thực hiện, hành động, entity..."
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
            value={actionFilter}
            onChange={(event) =>
              setActionFilter(
                event.target.value
              )
            }
          >
            <option value="ALL">
              Tất cả hành động
            </option>

            {actions.map((action) => (
              <option
                key={action}
                value={action}
              >
                {actionLabel(action)}
              </option>
            ))}
          </select>

          <select
            className="status-filter"
            value={entityTypeFilter}
            onChange={(event) =>
              setEntityTypeFilter(
                event.target.value
              )
            }
          >
            <option value="ALL">
              Tất cả đối tượng
            </option>

            {entityTypes.map(
              (entityType) => (
                <option
                  key={entityType}
                  value={entityType}
                >
                  {entityType}
                </option>
              )
            )}
          </select>
        </div>

        {loading ? (
          <div className="table-empty">
            Đang tải nhật ký...
          </div>
        ) : filteredLogs.length ===
          0 ? (
          <div className="table-empty">
            Không có nhật ký phù hợp.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Thời gian</th>
                  <th>Người thực hiện</th>
                  <th>Hành động</th>
                  <th>Đối tượng</th>
                  <th>Thay đổi</th>
                  <th>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {filteredLogs.map(
                  (log) => (
                    <tr key={log.id}>
                      <td>
                        {formatDate(
                          log.createdAt
                        )}
                      </td>

                      <td>
                        <strong className="table-primary">
                          {log.actorName ??
                            "Hệ thống"}
                        </strong>

                        {log.actorEmail && (
                          <div
                            style={{
                              fontSize: 12,
                              marginTop: 3,
                              opacity: 0.65,
                            }}
                          >
                            {
                              log.actorEmail
                            }
                          </div>
                        )}
                      </td>

                      <td>
                        <span className="status-badge pending">
                          {actionLabel(
                            log.action
                          )}
                        </span>
                      </td>

                      <td>
                        <strong>
                          {log.entityType}
                        </strong>

                        <div
                          style={{
                            fontSize: 11,
                            marginTop: 3,
                            opacity: 0.55,
                            maxWidth: 160,
                            overflow:
                              "hidden",
                            textOverflow:
                              "ellipsis",
                          }}
                        >
                          {log.entityId}
                        </div>
                      </td>

                      <td>
                        {log.oldStatus ||
                        log.newStatus ? (
                          <div
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap: 6,
                            }}
                          >
                            <span>
                              {statusLabel(
                                log.oldStatus
                              )}
                            </span>

                            <span>→</span>

                            <strong>
                              {statusLabel(
                                log.newStatus
                              )}
                            </strong>
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>

                      <td>
                        <button
                          type="button"
                          className="icon-action view"
                          title="Xem chi tiết"
                          onClick={() =>
                            setSelected(log)
                          }
                        >
                          <Eye size={16} />
                        </button>
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
                <h2>
                  Chi tiết nhật ký
                </h2>

                <p>
                  {formatDate(
                    selected.createdAt
                  )}
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
                <span>
                  Người thực hiện
                </span>

                <strong>
                  {selected.actorName ??
                    "Hệ thống"}
                </strong>
              </div>

              <div>
                <span>Email</span>

                <strong>
                  {selected.actorEmail ??
                    "—"}
                </strong>
              </div>

              <div>
                <span>Hành động</span>

                <strong>
                  {actionLabel(
                    selected.action
                  )}
                </strong>
              </div>

              <div>
                <span>Loại đối tượng</span>

                <strong>
                  {selected.entityType}
                </strong>
              </div>

              <div>
                <span>
                  Trạng thái cũ
                </span>

                <strong>
                  {statusLabel(
                    selected.oldStatus
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Trạng thái mới
                </span>

                <strong>
                  {statusLabel(
                    selected.newStatus
                  )}
                </strong>
              </div>

              <div
                style={{
                  gridColumn:
                    "1 / -1",
                }}
              >
                <span>Entity ID</span>

                <strong
                  style={{
                    wordBreak:
                      "break-all",
                  }}
                >
                  {selected.entityId}
                </strong>
              </div>

              <div
                style={{
                  gridColumn:
                    "1 / -1",
                }}
              >
                <span>
                  Correlation ID
                </span>

                <strong
                  style={{
                    wordBreak:
                      "break-all",
                  }}
                >
                  {selected.correlationId ||
                    "—"}
                </strong>
              </div>

              <div
                style={{
                  gridColumn:
                    "1 / -1",
                }}
              >
                <span>Lý do / Ghi chú</span>

                <strong>
                  {selected.reason ??
                    "—"}
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminAuditLogsPage;