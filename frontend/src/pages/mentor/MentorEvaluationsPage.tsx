import axios from "axios";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardCheck,
  RefreshCw,
  Save,
  Send,
  UserRound,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import evaluationService from "../../services/evaluationService";
import type {
  EvaluationCriterionResponse,
  EvaluationResponse,
} from "../../types/evaluation";

interface CriterionDraft {
  score: string;
  comment: string;
}

function MentorEvaluationsPage() {
  const [evaluations, setEvaluations] =
    useState<EvaluationResponse[]>([]);

  const [selected, setSelected] =
    useState<EvaluationResponse | null>(null);

  const [drafts, setDrafts] = useState<
    Record<string, CriterionDraft>
  >({});

  const [mentorComment, setMentorComment] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] =
    useState<string | null>(null);
  const [savingComment, setSavingComment] =
    useState(false);
  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const initialiseDrafts = (
    evaluation: EvaluationResponse
  ) => {
    const values: Record<
      string,
      CriterionDraft
    > = {};

    evaluation.criteria.forEach((criterion) => {
      values[criterion.id] = {
        score:
          criterion.score === null
            ? ""
            : String(criterion.score),
        comment: criterion.comment ?? "",
      };
    });

    setDrafts(values);
    setMentorComment(
      evaluation.mentorComment ?? ""
    );
  };

  const loadEvaluations =
    useCallback(async () => {
      setLoading(true);
      setError("");

      try {
        const data =
          await evaluationService.getMy();

        setEvaluations(data);

        if (selected) {
          const current = data.find(
            (item) => item.id === selected.id
          );

          if (current) {
            setSelected(current);
            initialiseDrafts(current);
          }
        }
      } catch (err) {
        handleApiError(
          err,
          "Không thể tải danh sách đánh giá."
        );
      } finally {
        setLoading(false);
      }
    }, [selected]);

  useEffect(() => {
    void loadEvaluations();
    // chỉ tải lần đầu
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApiError = (
    err: unknown,
    fallback: string
  ) => {
    if (axios.isAxiosError(err)) {
      const code = err.response?.data?.code;

      if (code === "EVAL_CONCURRENT_UPDATE") {
        setError(
          "Dữ liệu vừa được thay đổi. Hãy tải lại phiếu đánh giá."
        );
        return;
      }

      if (code === "EVAL_NOT_READY") {
        setError(
          err.response?.data?.message ??
            "Bạn chưa chấm đầy đủ các tiêu chí."
        );
        return;
      }

      if (code === "EVAL_STATE_INVALID") {
        setError(
          err.response?.data?.message ??
            "Trạng thái đánh giá không hợp lệ."
        );
        return;
      }

      if (code === "EVAL_WEIGHT_SUM_INVALID") {
        setError(
          "Tổng trọng số của bộ tiêu chí không hợp lệ."
        );
        return;
      }

      setError(
        err.response?.data?.message ?? fallback
      );
      return;
    }

    setError(fallback);
  };

  const openEvaluation = (
    evaluation: EvaluationResponse
  ) => {
    setSelected(evaluation);
    initialiseDrafts(evaluation);
    setError("");
    setSuccess("");
  };

  const replaceEvaluation = (
    updated: EvaluationResponse
  ) => {
    setSelected(updated);

    setEvaluations((current) =>
      current.map((item) =>
        item.id === updated.id
          ? updated
          : item
      )
    );

    initialiseDrafts(updated);
  };

  const saveCriterion = async (
    criterion: EvaluationCriterionResponse
  ) => {
    if (!selected) return;

    const draft = drafts[criterion.id];

    if (!draft || draft.score.trim() === "") {
      setError(
        `Hãy nhập điểm cho tiêu chí "${criterion.name}".`
      );
      return;
    }

    const score = Number(draft.score);

    if (
      Number.isNaN(score) ||
      score < 0 ||
      score > 10
    ) {
      setError(
        "Điểm phải nằm trong khoảng từ 0 đến 10."
      );
      return;
    }

    setSavingId(criterion.id);
    setError("");
    setSuccess("");

    try {
      const updated =
        await evaluationService.updateCriterion(
          selected.id,
          criterion.id,
          {
            score,
            comment:
              draft.comment.trim() || null,
            rowVersion: selected.rowVersion,
          }
        );

      replaceEvaluation(updated);
      setSuccess(
        `Đã lưu tiêu chí "${criterion.name}".`
      );
    } catch (err) {
      handleApiError(
        err,
        "Không thể lưu tiêu chí."
      );
    } finally {
      setSavingId(null);
    }
  };

  const saveMentorComment = async () => {
    if (!selected) return;

    setSavingComment(true);
    setError("");
    setSuccess("");

    try {
      const updated =
        await evaluationService.updateComment(
          selected.id,
          {
            mentorComment:
              mentorComment.trim() || null,
            rowVersion: selected.rowVersion,
          }
        );

      replaceEvaluation(updated);
      setSuccess("Đã lưu nhận xét chung.");
    } catch (err) {
      handleApiError(
        err,
        "Không thể lưu nhận xét."
      );
    } finally {
      setSavingComment(false);
    }
  };

  const submitEvaluation = async () => {
    if (!selected) return;

    const confirmed = window.confirm(
      "Sau khi gửi đánh giá, bạn sẽ không thể chỉnh sửa cho đến khi Reviewer trả lại. Bạn có chắc muốn gửi?"
    );

    if (!confirmed) return;

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const updated =
        await evaluationService.submit(
          selected.id,
          selected.rowVersion
        );

      replaceEvaluation(updated);

      setSuccess(
        "Đã gửi đánh giá cho Reviewer."
      );
    } catch (err) {
      handleApiError(
        err,
        "Không thể gửi đánh giá."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const editable =
    selected?.status === "DRAFT" ||
    selected?.status === "RETURNED";

  const statusLabel = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "Đang chấm";
      case "SUBMITTED":
        return "Chờ duyệt";
      case "RETURNED":
        return "Bị trả lại";
      case "PUBLISHED":
        return "Đã công bố";
      default:
        return status;
    }
  };

  const classificationLabel = (
    value: string | null
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
        return "—";
    }
  };

  if (selected) {
    return (
      <div className="mentor-evaluation-page">
        <button
          type="button"
          className="back-button"
          onClick={() => {
            setSelected(null);
            setError("");
            setSuccess("");
          }}
        >
          <ArrowLeft size={16} />
          Danh sách đánh giá
        </button>

        <div className="evaluation-detail-heading">
          <div>
            <h1>Phiếu đánh giá thực tập</h1>
            <p>
              {selected.studentName} ·{" "}
              {selected.companyName}
            </p>
          </div>

          <span
            className={`evaluation-status ${selected.status.toLowerCase()}`}
          >
            {statusLabel(selected.status)}
          </span>
        </div>

        {selected.status === "RETURNED" &&
          selected.returnReason && (
            <div className="return-warning">
              <strong>
                Reviewer yêu cầu chỉnh sửa
              </strong>
              <span>
                {selected.returnReason}
              </span>
            </div>
          )}

        {error && (
          <div className="applications-error">
            {error}
          </div>
        )}

        {success && (
          <div className="evaluation-success">
            <CheckCircle2 size={16} />
            {success}
          </div>
        )}

        <section className="evaluation-info-grid">
          <div>
            <span>Sinh viên</span>
            <strong>
              {selected.studentName}
            </strong>
          </div>

          <div>
            <span>Mentor</span>
            <strong>
              {selected.mentorName}
            </strong>
          </div>

          <div>
            <span>Bộ tiêu chí</span>
            <strong>
              {selected.templateName ?? "—"}
            </strong>
          </div>

          <div>
            <span>Tổng trọng số</span>
            <strong>
              {selected.weightTotal}%
            </strong>
          </div>
        </section>

        <section className="criteria-panel">
          <div className="criteria-panel-heading">
            <div>
              <h2>Tiêu chí đánh giá</h2>
              <p>
                Chấm điểm từng tiêu chí từ 0 đến
                10.
              </p>
            </div>

            <div className="total-score-box">
              <span>Tổng điểm</span>
              <strong>
                {selected.totalScore ?? "—"}
              </strong>
              <small>
                {classificationLabel(
                  selected.classification
                )}
              </small>
            </div>
          </div>

          <div className="criteria-list">
            {[...selected.criteria]
              .sort(
                (a, b) =>
                  a.displayOrder -
                  b.displayOrder
              )
              .map((criterion, index) => {
                const draft =
                  drafts[criterion.id] ?? {
                    score: "",
                    comment: "",
                  };

                return (
                  <article
                    className="criterion-card"
                    key={criterion.id}
                  >
                    <div className="criterion-header">
                      <div className="criterion-number">
                        {index + 1}
                      </div>

                      <div className="criterion-title">
                        <strong>
                          {criterion.name}
                        </strong>

                        <div>
                          Trọng số:{" "}
                          {criterion.weight}%

                          {criterion.isMandatory &&
                            " · Bắt buộc"}

                          {criterion.minPassScore !==
                            null &&
                            ` · Điểm tối thiểu: ${criterion.minPassScore}`}
                        </div>
                      </div>
                    </div>

                    <div className="criterion-form">
                      <div className="score-field">
                        <label>Điểm</label>

                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          disabled={!editable}
                          value={draft.score}
                          onChange={(event) =>
                            setDrafts(
                              (current) => ({
                                ...current,
                                [criterion.id]: {
                                  ...draft,
                                  score:
                                    event.target
                                      .value,
                                },
                              })
                            )
                          }
                        />

                        <span>/ 10</span>
                      </div>

                      <div className="criterion-comment">
                        <label>
                          Nhận xét
                        </label>

                        <textarea
                          maxLength={1000}
                          disabled={!editable}
                          value={draft.comment}
                          placeholder="Nhận xét cho tiêu chí..."
                          onChange={(event) =>
                            setDrafts(
                              (current) => ({
                                ...current,
                                [criterion.id]: {
                                  ...draft,
                                  comment:
                                    event.target
                                      .value,
                                },
                              })
                            )
                          }
                        />
                      </div>

                      {editable && (
                        <button
                          type="button"
                          className="criterion-save"
                          disabled={
                            savingId ===
                            criterion.id
                          }
                          onClick={() =>
                            void saveCriterion(
                              criterion
                            )
                          }
                        >
                          <Save size={15} />

                          {savingId ===
                          criterion.id
                            ? "Đang lưu..."
                            : "Lưu"}
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
          </div>
        </section>

        <section className="mentor-comment-panel">
          <div>
            <h2>Nhận xét chung của Mentor</h2>
            <p>
              Nhận xét tổng quan về quá trình thực
              tập của sinh viên.
            </p>
          </div>

          <textarea
            value={mentorComment}
            maxLength={2000}
            disabled={!editable}
            placeholder="Nhập nhận xét chung..."
            onChange={(event) =>
              setMentorComment(
                event.target.value
              )
            }
          />

          {editable && (
            <div className="mentor-comment-actions">
              <button
                type="button"
                className="secondary-button"
                disabled={savingComment}
                onClick={() =>
                  void saveMentorComment()
                }
              >
                <Save size={15} />
                {savingComment
                  ? "Đang lưu..."
                  : "Lưu nhận xét"}
              </button>
            </div>
          )}
        </section>

        {editable && (
          <div className="evaluation-submit-bar">
            <div>
              <strong>
                Hoàn thành đánh giá?
              </strong>
              <span>
                Hãy kiểm tra điểm và nhận xét trước
                khi gửi Reviewer.
              </span>
            </div>

            <button
              type="button"
              className="primary-button"
              disabled={submitting}
              onClick={() =>
                void submitEvaluation()
              }
            >
              <Send size={16} />

              {submitting
                ? "Đang gửi..."
                : "Gửi đánh giá"}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mentor-evaluation-page">
      <div className="page-heading">
        <div>
          <h1>Đánh giá thực tập</h1>
          <p>
            Chấm điểm và nhận xét sinh viên bạn
            đang phụ trách.
          </p>
        </div>

        <button
          className="secondary-button"
          type="button"
          disabled={loading}
          onClick={() =>
            void loadEvaluations()
          }
        >
          <RefreshCw size={16} />
          Làm mới
        </button>
      </div>

      {error && (
        <div className="applications-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="table-panel table-empty">
          Đang tải danh sách đánh giá...
        </div>
      ) : evaluations.length === 0 ? (
        <div className="table-panel table-empty">
          Bạn chưa có sinh viên cần đánh giá.
        </div>
      ) : (
        <div className="mentor-evaluation-grid">
          {evaluations.map((evaluation) => (
            <article
              className="mentor-evaluation-card"
              key={evaluation.id}
            >
              <div className="evaluation-card-top">
                <div className="student-avatar large">
                  <UserRound size={20} />
                </div>

                <span
                  className={`evaluation-status ${evaluation.status.toLowerCase()}`}
                >
                  {statusLabel(
                    evaluation.status
                  )}
                </span>
              </div>

              <h2>
                {evaluation.studentName}
              </h2>

              <p>{evaluation.companyName}</p>

              <div className="evaluation-card-meta">
                <div>
                  <span>Bộ tiêu chí</span>
                  <strong>
                    {evaluation.templateName ??
                      "—"}
                  </strong>
                </div>

                <div>
                  <span>Tổng điểm</span>
                  <strong>
                    {evaluation.totalScore ??
                      "Chưa có"}
                  </strong>
                </div>
              </div>

              <button
                type="button"
                className="evaluation-open-button"
                onClick={() =>
                  openEvaluation(evaluation)
                }
              >
                <ClipboardCheck size={16} />

                {evaluation.status ===
                  "DRAFT" ||
                evaluation.status ===
                  "RETURNED"
                  ? "Chấm đánh giá"
                  : "Xem đánh giá"}
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default MentorEvaluationsPage;