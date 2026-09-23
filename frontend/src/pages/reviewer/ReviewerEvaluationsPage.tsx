import axios from "axios";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardCheck,
  RotateCcw,
  Send,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import evaluationService from "../../services/evaluationService";
import type { EvaluationResponse } from "../../types/evaluation";

function ReviewerEvaluationsPage() {
  const [evaluations, setEvaluations] =
    useState<EvaluationResponse[]>([]);

  const [selected, setSelected] =
    useState<EvaluationResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showReturnModal, setShowReturnModal] =
    useState(false);

  const [returnReason, setReturnReason] =
    useState("");

  const loadSubmitted = async () => {
    setLoading(true);
    setError("");

    try {
      const data =
        await evaluationService.getSubmitted();

      setEvaluations(data);
    } catch (err) {
      handleError(
        err,
        "Không thể tải danh sách đánh giá chờ duyệt."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSubmitted();
  }, []);

  const handleError = (
    err: unknown,
    fallback: string
  ) => {
    if (axios.isAxiosError(err)) {
      const code = err.response?.data?.code;

      if (code === "EVAL_CONCURRENT_UPDATE") {
        setError(
          "Phiếu đánh giá vừa được thay đổi. Hãy tải lại dữ liệu."
        );
        return;
      }

      if (code === "EVAL_STATE_INVALID") {
        setError(
          err.response?.data?.message ??
            "Trạng thái đánh giá không còn hợp lệ."
        );
        return;
      }

      setError(
        err.response?.data?.message ??
          fallback
      );

      return;
    }

    setError(fallback);
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

  const resultLabel = (
    value: string | null
  ) => {
    switch (value) {
      case "PASSED":
        return "Đạt";
      case "FAILED":
        return "Không đạt";
      default:
        return "—";
    }
  };

  const openEvaluation = async (
    evaluation: EvaluationResponse
  ) => {
    setError("");
    setSuccess("");

    try {
      const detail =
        await evaluationService.getById(
          evaluation.id
        );

      setSelected(detail);
    } catch (err) {
      handleError(
        err,
        "Không thể tải chi tiết đánh giá."
      );
    }
  };

  const handleReturn = async () => {
    if (!selected) return;

    const reason = returnReason.trim();

    if (!reason) {
      setError(
        "Bạn phải nhập lý do trả lại đánh giá."
      );
      return;
    }

    if (reason.length > 500) {
      setError(
        "Lý do trả lại không được vượt quá 500 ký tự."
      );
      return;
    }

    setProcessing(true);
    setError("");
    setSuccess("");

    try {
      await evaluationService.returnEvaluation(
        selected.id,
        reason,
        selected.rowVersion
      );

      setEvaluations((current) =>
        current.filter(
          (item) => item.id !== selected.id
        )
      );

      setShowReturnModal(false);
      setReturnReason("");
      setSelected(null);

      setSuccess(
        "Đã trả phiếu đánh giá về cho Mentor chỉnh sửa."
      );
    } catch (err) {
      handleError(
        err,
        "Không thể trả lại đánh giá."
      );
    } finally {
      setProcessing(false);
    }
  };

  const handlePublish = async () => {
    if (!selected) return;

    const confirmed = window.confirm(
      `Công bố kết quả của ${selected.studentName}?\n\n` +
        `Tổng điểm: ${selected.totalScore ?? "—"}\n` +
        `Xếp loại: ${classificationLabel(selected.classification)}\n` +
        `Kết quả: ${resultLabel(selected.result)}\n\n` +
        "Sau khi công bố, kết quả sẽ được lưu thành snapshot."
    );

    if (!confirmed) return;

    setProcessing(true);
    setError("");
    setSuccess("");

    try {
      await evaluationService.publish(
        selected.id,
        selected.rowVersion
      );

      setEvaluations((current) =>
        current.filter(
          (item) => item.id !== selected.id
        )
      );

      setSelected(null);

      setSuccess(
        "Đã công bố kết quả thực tập thành công."
      );
    } catch (err) {
      handleError(
        err,
        "Không thể công bố kết quả."
      );
    } finally {
      setProcessing(false);
    }
  };

  if (selected) {
    return (
      <div className="review-page">
        <button
          type="button"
          className="back-button"
          onClick={() => {
            setSelected(null);
            setError("");
          }}
        >
          <ArrowLeft size={16} />
          Danh sách chờ duyệt
        </button>

        <div className="evaluation-detail-heading">
          <div>
            <h1>Duyệt đánh giá thực tập</h1>

            <p>
              {selected.studentName} ·{" "}
              {selected.companyName}
            </p>
          </div>

          <span className="evaluation-status submitted">
            Chờ duyệt
          </span>
        </div>

        {error && (
          <div className="applications-error">
            {error}
          </div>
        )}

        <section className="review-summary">
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
            <span>Tổng điểm</span>
            <strong className="review-score">
              {selected.totalScore ?? "—"}
            </strong>
          </div>

          <div>
            <span>Xếp loại</span>
            <strong>
              {classificationLabel(
                selected.classification
              )}
            </strong>
          </div>

          <div>
            <span>Kết quả</span>
            <strong
              className={
                selected.result === "PASSED"
                  ? "result-passed"
                  : "result-failed"
              }
            >
              {resultLabel(selected.result)}
            </strong>
          </div>
        </section>

        <section className="criteria-panel">
          <div className="criteria-panel-heading">
            <div>
              <h2>Chi tiết chấm điểm</h2>
              <p>
                Kiểm tra điểm và nhận xét của
                Mentor trước khi duyệt.
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
              .map((criterion, index) => (
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

                    <div className="review-criterion-score">
                      {criterion.score ?? "—"}
                      <small>/10</small>
                    </div>
                  </div>

                  <div className="review-comment">
                    <span>
                      Nhận xét của Mentor
                    </span>

                    <p>
                      {criterion.comment?.trim() ||
                        "Không có nhận xét."}
                    </p>
                  </div>
                </article>
              ))}
          </div>
        </section>

        <section className="mentor-comment-panel">
          <div>
            <h2>Nhận xét chung của Mentor</h2>
          </div>

          <div className="review-mentor-comment">
            {selected.mentorComment?.trim() ||
              "Mentor chưa nhập nhận xét chung."}
          </div>
        </section>

        <div className="review-action-bar">
          <div>
            <strong>
              Quyết định duyệt đánh giá
            </strong>

            <span>
              Bạn có thể trả lại cho Mentor chỉnh
              sửa hoặc công bố kết quả.
            </span>
          </div>

          <div className="review-action-buttons">
            <button
              type="button"
              className="return-button"
              disabled={processing}
              onClick={() => {
                setError("");
                setReturnReason("");
                setShowReturnModal(true);
              }}
            >
              <RotateCcw size={16} />
              Trả lại
            </button>

            <button
              type="button"
              className="publish-button"
              disabled={processing}
              onClick={() =>
                void handlePublish()
              }
            >
              <Send size={16} />

              {processing
                ? "Đang xử lý..."
                : "Công bố kết quả"}
            </button>
          </div>
        </div>

        {showReturnModal && (
          <div
            className="modal-backdrop"
            onMouseDown={() => {
              if (!processing) {
                setShowReturnModal(false);
              }
            }}
          >
            <div
              className="detail-modal return-modal"
              onMouseDown={(event) =>
                event.stopPropagation()
              }
            >
              <div className="modal-header">
                <div>
                  <h2>Trả lại đánh giá</h2>
                  <p>
                    Yêu cầu Mentor chỉnh sửa phiếu
                    đánh giá.
                  </p>
                </div>

                <button
                  type="button"
                  className="modal-close"
                  disabled={processing}
                  onClick={() =>
                    setShowReturnModal(false)
                  }
                >
                  <X size={20} />
                </button>
              </div>

              <div className="return-modal-body">
                <label htmlFor="returnReason">
                  Lý do trả lại
                </label>

                <textarea
                  id="returnReason"
                  autoFocus
                  maxLength={500}
                  value={returnReason}
                  placeholder="Ví dụ: Vui lòng bổ sung nhận xét chi tiết cho tiêu chí..."
                  onChange={(event) =>
                    setReturnReason(
                      event.target.value
                    )
                  }
                />

                <div className="character-count">
                  {returnReason.length}/500
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="secondary-button"
                  disabled={processing}
                  onClick={() =>
                    setShowReturnModal(false)
                  }
                >
                  Hủy
                </button>

                <button
                  type="button"
                  className="return-confirm-button"
                  disabled={
                    processing ||
                    !returnReason.trim()
                  }
                  onClick={() =>
                    void handleReturn()
                  }
                >
                  <RotateCcw size={16} />

                  {processing
                    ? "Đang trả lại..."
                    : "Xác nhận trả lại"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="review-page">
      <div className="page-heading">
        <div>
          <h1>Duyệt đánh giá</h1>

          <p>
            Kiểm tra và duyệt các phiếu đánh giá
            do Mentor gửi lên.
          </p>
        </div>

        <button
          type="button"
          className="secondary-button"
          disabled={loading}
          onClick={() =>
            void loadSubmitted()
          }
        >
          Làm mới
        </button>
      </div>

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

      {loading ? (
        <div className="table-panel table-empty">
          Đang tải danh sách chờ duyệt...
        </div>
      ) : evaluations.length === 0 ? (
        <div className="review-empty">
          <div>
            <CheckCircle2 size={26} />
          </div>

          <h2>Không có đánh giá chờ duyệt</h2>

          <p>
            Hiện tại không có phiếu đánh giá nào
            ở trạng thái SUBMITTED.
          </p>
        </div>
      ) : (
        <div className="review-grid">
          {evaluations.map((evaluation) => (
            <article
              className="review-card"
              key={evaluation.id}
            >
              <div className="review-card-header">
                <div className="student-avatar large">
                  <UserRound size={20} />
                </div>

                <span className="evaluation-status submitted">
                  Chờ duyệt
                </span>
              </div>

              <h2>
                {evaluation.studentName}
              </h2>

              <p>{evaluation.companyName}</p>

              <div className="review-card-score">
                <div>
                  <span>Tổng điểm</span>
                  <strong>
                    {evaluation.totalScore ??
                      "—"}
                  </strong>
                </div>

                <div>
                  <span>Xếp loại</span>
                  <strong>
                    {classificationLabel(
                      evaluation.classification
                    )}
                  </strong>
                </div>

                <div>
                  <span>Kết quả</span>
                  <strong>
                    {resultLabel(
                      evaluation.result
                    )}
                  </strong>
                </div>
              </div>

              <button
                type="button"
                className="evaluation-open-button"
                onClick={() =>
                  void openEvaluation(evaluation)
                }
              >
                <ClipboardCheck size={16} />
                Xem và duyệt
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewerEvaluationsPage;