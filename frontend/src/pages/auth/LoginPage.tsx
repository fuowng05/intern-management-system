import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowRight,
  BriefcaseBusiness,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (!err.response) {
          setError(
            "Không thể kết nối đến máy chủ. Vui lòng kiểm tra backend."
          );
        } else if (err.response.status === 401) {
          setError("Email hoặc mật khẩu không chính xác.");
        } else {
          setError(
            err.response.data?.message ??
              "Đăng nhập thất bại. Vui lòng thử lại."
          );
        }
      } else {
        setError("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <section className="login-hero">
        <div className="login-hero-decoration login-decoration-one" />
        <div className="login-hero-decoration login-decoration-two" />

        <div className="login-brand">
          <div className="login-brand-icon">
            <GraduationCap size={27} strokeWidth={2.1} />
          </div>

          <div>
            <strong>InternHub</strong>
            <span>Internship Management System</span>
          </div>
        </div>

        <div className="login-hero-content">
          <span className="login-eyebrow">
            <ShieldCheck size={15} />
            Nền tảng quản lý tập trung
          </span>

          <h1>
            Quản lý thực tập
            <br />
            <span>đơn giản và hiệu quả.</span>
          </h1>

          <p>
            Kết nối sinh viên, giảng viên và doanh nghiệp trong một quy trình
            thống nhất từ đăng ký thực tập đến đánh giá kết quả.
          </p>

          <div className="login-feature-list">
            <div className="login-feature">
              <div>
                <BriefcaseBusiness size={19} />
              </div>
              <span>Quản lý đơn đăng ký và phân công hướng dẫn</span>
            </div>

            <div className="login-feature">
              <div>
                <GraduationCap size={19} />
              </div>
              <span>Theo dõi đánh giá và kết quả thực tập</span>
            </div>

            <div className="login-feature">
              <div>
                <ShieldCheck size={19} />
              </div>
              <span>Phân quyền rõ ràng theo từng vai trò</span>
            </div>
          </div>
        </div>

        <div className="login-hero-footer">
          InternHub · Hệ thống quản lý thực tập sinh
        </div>
      </section>

      <section className="login-form-side">
        <div className="login-form-wrapper">
          <div className="login-mobile-brand">
            <div className="login-brand-icon">
              <GraduationCap size={24} />
            </div>
            <strong>InternHub</strong>
          </div>

          <div className="login-heading">
            <span className="login-welcome">CHÀO MỪNG TRỞ LẠI</span>
            <h2>Đăng nhập vào InternHub</h2>
            <p>
              Nhập thông tin tài khoản của bạn để tiếp tục sử dụng hệ thống.
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="email">Địa chỉ email</label>

              <div className="login-input-wrapper">
                <Mail size={18} />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  autoComplete="email"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="password">Mật khẩu</label>

              <div className="login-input-wrapper">
                <LockKeyhole size={18} />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  autoComplete="current-password"
                  disabled={loading}
                  required
                />

                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="login-error" role="alert">
                {error}
              </div>
            )}

            <button
              className="login-submit"
              type="submit"
              disabled={loading}
            >
              <span>
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </span>

              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="login-security">
            <ShieldCheck size={14} />
            <span>Thông tin đăng nhập được bảo vệ an toàn.</span>
          </div>
        </div>

        <div className="login-form-footer">
          © 2026 InternHub · Internship Management System
        </div>
      </section>
    </div>
  );
}

export default LoginPage;