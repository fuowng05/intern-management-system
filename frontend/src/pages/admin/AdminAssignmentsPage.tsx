import axios from "axios";
import {
  Building2,
  CheckCircle2,
  Search,
  UserCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import applicationService from "../../services/applicationService";
import assignmentService from "../../services/assignmentService";
import userService from "../../services/userService";

import type { ApplicationResponse } from "../../types/application";
import type { AssignmentResponse } from "../../types/assignment";
import type { MentorResponse } from "../../types/user";

interface AssignmentRow {
  application: ApplicationResponse;
  assignment: AssignmentResponse | null;
}

function AdminAssignmentsPage() {
  const [rows, setRows] = useState<AssignmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [selectedApplication, setSelectedApplication] =
    useState<ApplicationResponse | null>(null);

  const [mentors, setMentors] = useState<MentorResponse[]>([]);
  const [mentorId, setMentorId] = useState("");

  const [loadingMentors, setLoadingMentors] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const applications =
        await applicationService.getAll();

      const approvedApplications =
        applications.filter(
          (item) => item.status === "APPROVED"
        );

      const assignmentResults =
        await Promise.all(
          approvedApplications.map(async (application) => {
            const assignment =
              await assignmentService.getByApplication(
                application.id
              );

            return {
              application,
              assignment,
            };
          })
        );

      setRows(assignmentResults);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ??
            "Không thể tải dữ liệu phân công."
        );
      } else {
        setError(
          "Không thể tải dữ liệu phân công."
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const filteredRows = useMemo(() => {
    const keyword =
      search.trim().toLowerCase();

    if (!keyword) {
      return rows;
    }

    return rows.filter(({ application, assignment }) => {
      return (
        application.studentName
          .toLowerCase()
          .includes(keyword) ||
        application.studentEmail
          .toLowerCase()
          .includes(keyword) ||
        application.companyName
          .toLowerCase()
          .includes(keyword) ||
        assignment?.mentorName
          .toLowerCase()
          .includes(keyword) ||
        assignment?.mentorEmail
          .toLowerCase()
          .includes(keyword)
      );
    });
  }, [rows, search]);

  const assignedCount = rows.filter(
    (row) => row.assignment !== null
  ).length;

  const unassignedCount =
    rows.length - assignedCount;

  const openAssignmentModal = async (
    application: ApplicationResponse
  ) => {
    setSelectedApplication(application);
    setMentorId("");
    setMentors([]);
    setError("");
    setLoadingMentors(true);

    try {
      const result =
        await userService.getMentors(
          application.companyId
        );

      setMentors(result);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ??
            "Không thể tải danh sách Mentor."
        );
      } else {
        setError(
          "Không thể tải danh sách Mentor."
        );
      }
    } finally {
      setLoadingMentors(false);
    }
  };

  const closeModal = () => {
    if (submitting) {
      return;
    }

    setSelectedApplication(null);
    setMentorId("");
    setMentors([]);
  };

  const handleCreateAssignment = async () => {
    if (!selectedApplication || !mentorId) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const created =
        await assignmentService.create({
          applicationId:
            selectedApplication.id,
          mentorId,
        });

      setRows((current) =>
        current.map((row) =>
          row.application.id ===
          selectedApplication.id
            ? {
                ...row,
                assignment: created,
              }
            : row
        )
      );

      closeModal();

      setSelectedApplication(null);
      setMentorId("");
      setMentors([]);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ??
            "Không thể tạo phân công Mentor."
        );
      } else {
        setError(
          "Không thể tạo phân công Mentor."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (value: string) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  };

  return (
    <div className="assignments-page">
      <div className="page-heading">
        <div>
          <h1>Phân công Mentor</h1>
          <p>
            Phân công người hướng dẫn cho sinh viên
            có đơn thực tập đã được duyệt.
          </p>
        </div>
      </div>

      <section className="assignment-summary-grid">
        <div className="assignment-summary-card">
          <div className="summary-icon all">
            <Users size={19} />
          </div>

          <div>
            <span>Đơn đã duyệt</span>
            <strong>{rows.length}</strong>
          </div>
        </div>

        <div className="assignment-summary-card">
          <div className="summary-icon approved">
            <UserCheck size={19} />
          </div>

          <div>
            <span>Đã phân công</span>
            <strong>{assignedCount}</strong>
          </div>
        </div>

        <div className="assignment-summary-card">
          <div className="summary-icon pending">
            <UserPlus size={19} />
          </div>

          <div>
            <span>Chưa phân công</span>
            <strong>{unassignedCount}</strong>
          </div>
        </div>

        <div className="assignment-summary-card">
          <div className="summary-icon all">
            <Building2 size={19} />
          </div>

          <div>
            <span>Doanh nghiệp</span>
            <strong>
              {
                new Set(
                  rows.map(
                    (row) =>
                      row.application.companyId
                  )
                ).size
              }
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
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Tìm sinh viên, Mentor, doanh nghiệp..."
            />
          </div>
        </div>

        {loading ? (
          <div className="table-empty">
            Đang tải dữ liệu phân công...
          </div>
        ) : filteredRows.length === 0 ? (
          <div className="table-empty">
            Không có dữ liệu phù hợp.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Sinh viên</th>
                  <th>Doanh nghiệp</th>
                  <th>Mentor</th>
                  <th>Người phân công</th>
                  <th>Ngày phân công</th>
                  <th>Trạng thái</th>
                  <th className="actions-column">
                    Thao tác
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredRows.map(
                  ({ application, assignment }) => (
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
                              {application.studentName}
                            </strong>

                            <span>
                              {application.studentEmail}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        {application.companyName}
                      </td>

                      <td>
                        {assignment ? (
                          <>
                            <strong className="table-primary">
                              {assignment.mentorName}
                            </strong>

                            <span className="table-secondary">
                              {assignment.mentorEmail}
                            </span>
                          </>
                        ) : (
                          <span className="muted-value">
                            Chưa có Mentor
                          </span>
                        )}
                      </td>

                      <td>
                        {assignment
                          ? assignment.assignedByName
                          : "—"}
                      </td>

                      <td>
                        {assignment
                          ? formatDate(
                              assignment.assignedAt
                            )
                          : "—"}
                      </td>

                      <td>
                        {assignment ? (
                          <span className="status-badge approved">
                            Đã phân công
                          </span>
                        ) : (
                          <span className="status-badge pending">
                            Chờ phân công
                          </span>
                        )}
                      </td>

                      <td>
                        <div className="table-actions">
                          {!assignment && (
                            <button
                              type="button"
                              className="assign-button"
                              onClick={() =>
                                void openAssignmentModal(
                                  application
                                )
                              }
                            >
                              <UserPlus size={15} />
                              Phân công
                            </button>
                          )}

                          {assignment && (
                            <span className="assignment-complete">
                              <CheckCircle2 size={16} />
                            </span>
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

      {selectedApplication && (
        <div
          className="modal-backdrop"
          onMouseDown={closeModal}
        >
          <div
            className="detail-modal assignment-modal"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <h2>Phân công Mentor</h2>
                <p>
                  Chọn Mentor phụ trách sinh viên
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

            <div className="assignment-modal-body">
              <div className="assignment-student-box">
                <span>Sinh viên</span>

                <strong>
                  {selectedApplication.studentName}
                </strong>

                <small>
                  {selectedApplication.studentEmail}
                </small>
              </div>

              <div className="assignment-student-box">
                <span>Doanh nghiệp</span>

                <strong>
                  {selectedApplication.companyName}
                </strong>

                <small>
                  {
                    selectedApplication.periodName
                  }
                </small>
              </div>

              <div className="mentor-field">
                <label htmlFor="mentor">
                  Mentor
                </label>

                {loadingMentors ? (
                  <div className="mentor-loading">
                    Đang tải danh sách Mentor...
                  </div>
                ) : mentors.length === 0 ? (
                  <div className="mentor-empty">
                    Doanh nghiệp này chưa có Mentor
                    phù hợp.
                  </div>
                ) : (
                  <select
                    id="mentor"
                    value={mentorId}
                    onChange={(event) =>
                      setMentorId(
                        event.target.value
                      )
                    }
                  >
                    <option value="">
                      -- Chọn Mentor --
                    </option>

                    {mentors.map((mentor) => (
                      <option
                        key={mentor.id}
                        value={mentor.id}
                      >
                        {mentor.fullName} —{" "}
                        {mentor.email}
                      </option>
                    ))}
                  </select>
                )}
              </div>
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
                disabled={
                  !mentorId ||
                  loadingMentors ||
                  submitting
                }
                onClick={() =>
                  void handleCreateAssignment()
                }
              >
                <UserCheck size={16} />

                {submitting
                  ? "Đang phân công..."
                  : "Xác nhận phân công"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminAssignmentsPage;