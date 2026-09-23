import axios from "axios";
import {
  ArrowLeft,
  Award,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";

import evaluationService from "../../services/evaluationService";
import type {
  PublishedEvaluationResponse,
} from "../../types/evaluation";

function StudentResultsPage() {
  const [results, setResults] = useState<
    PublishedEvaluationResponse[]
  >([]);

  const [selected, setSelected] =
    useState<PublishedEvaluationResponse | null>(
      null
    );

  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] =
    useState(false);

  const [error, setError] = useState("");

  const loadResults = async () => {
    setLoading(true);
    setError("");

    try {
      const data =
        await evaluationService.getMyPublishedResults();

      setResults(data);
    } catch (err) {
      handleError(
        err,
        "Không thể tải kết quả thực tập."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadResults();
  }, []);

  const handleError = (
    err: unknown,
    fallback: string
  ) => {
    if (axios.isAxiosError(err)) {
      setError(
        err.response?.data?.message ?? fallback
      );
      return;
    }

    setError(fallback);
  };

  const openResult = async (
    evaluationId: string
  ) => {
    setDetailLoading(true);
    setError("");

    try {
      const data =
        await evaluationService.getMyPublishedResult(
          evaluationId
        );

      setSelected(data);
    } catch (err) {
      handleError(
        err,
        "Không thể tải chi tiết kết quả."
      );
    } finally {
      setDetailLoading(false);
    }
  };

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
    return value === "PASSED"
      ? "Đạt"
      : "Không đạt";
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

  if (selected) {
    const snapshot = selected.snapshot;

    return (
      <div className="student-results-page">
        <button
          type="button"
          className="back-button"
          onClick={() => {
            setSelected(null);
            setError("");
          }}
        >
          <ArrowLeft size={16} />
          Danh sách kết quả
        </button>

        <div className="result-detail-heading">
          <div>
            <h1>Kết quả thực tập</h1>

            <p>
              Kết quả đánh giá chính thức đã được
              công bố.
            </p>
          </div>

          <span className="published-label">
            <CheckCircle2 size={14} />
            Đã công bố
          </span>
        </div>

        {error && (
          <div className="applications-error">
            {error}
          </div>
        )}

        <section className="student-result-hero">
          <div className="result-score-circle">
            <span>Tổng điểm</span>

            <strong>
              {selected.totalScore}
            </strong>

            <small>/ 10</small>
          </div>

          <div className="result-hero-info">
            <span>KẾT QUẢ THỰC TẬP</span>

            <h2>
              {snapshot.Application.StudentName}
            </h2>

            <p>
              {snapshot.Application.CompanyName}
            </p>

            <div className="result-badges">
              <span className="classification-badge">
                <Award size={14} />
                {classificationLabel(
                  selected.classification
                )}
              </span>

              <span
                className={
                  selected.result === "PASSED"
                    ? "final-result passed"
                    : "final-result failed"
                }
              >
                {resultLabel(selected.result)}
              </span>
            </div>
          </div>
        </section>

        <section className="result-information-grid">
          <div>
            <Building2 size={18} />

            <span>Doanh nghiệp</span>

            <strong>
              {snapshot.Application.CompanyName}
            </strong>
          </div>

          <div>
            <UserRound size={18} />

            <span>Mentor</span>

            <strong>
              {snapshot.Mentor.Name}
            </strong>
          </div>

          <div>
            <GraduationCap size={18} />

            <span>Bộ tiêu chí</span>

            <strong>
              {snapshot.Template.Name ?? "—"}
            </strong>
          </div>

          <div>
            <CalendarDays size={18} />

            <span>Ngày công bố</span>

            <strong>
              {formatDate(selected.publishedAt)}
            </strong>
          </div>
        </section>

        <section className="criteria-panel">
          <div className="criteria-panel-heading">
            <div>
              <h2>Chi tiết điểm đánh giá</h2>

              <p>
                Điểm chính thức theo từng tiêu chí
                đánh giá.
              </p>
            </div>

            <div className="total-score-box">
              <span>Tổng điểm</span>

              <strong>
                {selected.totalScore}
              </strong>

              <small>
                {classificationLabel(
                  selected.classification
                )}
              </small>
            </div>
          </div>

          <div className="published-criteria-list">
            {[...snapshot.Criteria]
              .sort(
                (a, b) =>
                  a.DisplayOrder -
                  b.DisplayOrder
              )
              .map((criterion, index) => (
                <article
                  className="published-criterion"
                  key={criterion.Id}
                >
                  <div className="published-criterion-top">
                    <div className="criterion-number">
                      {index + 1}
                    </div>

                    <div className="published-criterion-title">
                      <strong>
                        {criterion.Name}
                      </strong>

                      <span>
                        Trọng số{" "}
                        {criterion.Weight}%

                        {criterion.IsMandatory &&
                          " · Bắt buộc"}

                        {criterion.MinPassScore !==
                          null &&
                          ` · Điểm tối thiểu ${criterion.MinPassScore}`}
                      </span>
                    </div>

                    <div className="published-score">
                      <strong>
                        {criterion.Score}
                      </strong>

                      <span>/10</span>
                    </div>
                  </div>

                  <div className="published-comment">
                    <span>
                      Nhận xét của Mentor
                    </span>

                    <p>
                      {criterion.Comment?.trim() ||
                        "Không có nhận xét."}
                    </p>
                  </div>
                </article>
              ))}
          </div>
        </section>

        <section className="student-mentor-comment">
          <div className="mentor-comment-title">
            <ClipboardCheck size={18} />

            <div>
              <h2>
                Nhận xét chung của Mentor
              </h2>

              <span>
                Đánh giá tổng quan quá trình thực
                tập
              </span>
            </div>
          </div>

          <p>
            {snapshot.MentorComment?.trim() ||
              "Không có nhận xét chung."}
          </p>
        </section>

        <div className="publication-footer">
          <CheckCircle2 size={16} />

          <span>
            Kết quả được công bố ngày{" "}
            <strong>
              {formatDate(selected.publishedAt)}
            </strong>
          </span>

          <span>
            Phiên bản {selected.version}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="student-results-page">
      <div className="page-heading">
        <div>
          <h1>Kết quả thực tập</h1>

          <p>
            Xem kết quả đánh giá thực tập đã được
            công bố.
          </p>
        </div>
      </div>

      {error && (
        <div className="applications-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="table-panel table-empty">
          Đang tải kết quả...
        </div>
      ) : results.length === 0 ? (
        <div className="student-result-empty">
          <div>
            <ClipboardCheck size={27} />
          </div>

          <h2>Chưa có kết quả được công bố</h2>

          <p>
            Kết quả thực tập sẽ xuất hiện tại đây
            sau khi Reviewer công bố.
          </p>
        </div>
      ) : (
        <div className="student-result-grid">
          {results.map((result) => {
            const snapshot = result.snapshot;

            return (
              <article
                className="student-result-card"
                key={`${result.evaluationId}-${result.version}`}
              >
                <div className="student-result-card-top">
                  <div className="result-mini-score">
                    {result.totalScore}
                  </div>

                  <span
                    className={
                      result.result === "PASSED"
                        ? "final-result passed"
                        : "final-result failed"
                    }
                  >
                    {resultLabel(result.result)}
                  </span>
                </div>

                <h2>
                  {snapshot.Application.CompanyName}
                </h2>

                <p>
                  {snapshot.Template.Name ??
                    "Đánh giá thực tập"}
                </p>

                <div className="student-result-meta">
                  <div>
                    <span>Xếp loại</span>

                    <strong>
                      {classificationLabel(
                        result.classification
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Mentor</span>

                    <strong>
                      {snapshot.Mentor.Name}
                    </strong>
                  </div>
                </div>

                <div className="student-result-date">
                  <CalendarDays size={13} />
                  Công bố{" "}
                  {formatDate(result.publishedAt)}
                </div>

                <button
                  type="button"
                  className="evaluation-open-button"
                  disabled={detailLoading}
                  onClick={() =>
                    void openResult(
                      result.evaluationId
                    )
                  }
                >
                  <ClipboardCheck size={16} />

                  Xem chi tiết kết quả
                </button>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default StudentResultsPage;