# InternHub - Internship Management System

InternHub là hệ thống quản lý thực tập sinh, hỗ trợ toàn bộ quy trình từ khi sinh viên đăng ký thực tập, quản trị viên xét duyệt và phân công Mentor, Mentor đánh giá, Reviewer kiểm duyệt cho đến khi kết quả được công bố cho sinh viên.

## 1. Chức năng hệ thống

Hệ thống sử dụng mô hình phân quyền theo **Role & Permission** với 4 vai trò chính.

### Admin

- Xem Dashboard tổng quan hệ thống.
- Duyệt hoặc từ chối đơn đăng ký thực tập.
- Phân công Mentor cho sinh viên.
- Quản lý doanh nghiệp.
- Quản lý đợt thực tập.
- Quản lý bộ tiêu chí đánh giá.
- Phát hành bộ tiêu chí đánh giá.
- Xem báo cáo kết quả thực tập.
- Theo dõi Audit Log.

### Student

- Đăng nhập hệ thống.
- Xem các đợt thực tập đang mở.
- Xem doanh nghiệp.
- Nộp đơn đăng ký thực tập.
- Theo dõi trạng thái đơn.
- Xem kết quả thực tập sau khi được công bố.

### Mentor

- Xem sinh viên được phân công.
- Chấm điểm từng tiêu chí.
- Nhập nhận xét cho từng tiêu chí.
- Nhập nhận xét tổng thể.
- Chỉnh sửa đánh giá khi Reviewer trả lại.
- Submit đánh giá để Reviewer kiểm duyệt.

### Reviewer

- Xem các đánh giá đã được Mentor submit.
- Kiểm tra điểm và nhận xét.
- Trả lại đánh giá cho Mentor kèm lý do.
- Công bố kết quả đánh giá.

---

## 2. Quy trình nghiệp vụ

```text
Student nộp đơn
       |
       v
    PENDING
       |
       v
 Admin xét duyệt
       |
       v
   APPROVED
       |
       v
Admin phân công Mentor
       |
       v
Tạo Evaluation
       |
       v
     DRAFT
       |
       v
Mentor chấm điểm
       |
       v
   SUBMITTED
       |
       +----------------------+
       |                      |
       v                      v
Reviewer trả lại        Reviewer công bố
       |                      |
       v                      v
   RETURNED              PUBLISHED
       |                      |
       v                      v
 Mentor sửa             Student xem kết quả
       |
       +-----> SUBMITTED
```

---

## 3. Quy tắc đánh giá

Điểm tổng được tính theo trọng số:

```text
Total Score = Σ(Weight × Score) / 100
```

Tổng trọng số của bộ tiêu chí phải bằng **100%**.

| Điểm tổng | Xếp loại |
|---|---|
| >= 9.0 | Xuất sắc |
| >= 8.0 | Giỏi |
| >= 7.0 | Khá |
| >= 5.5 | Trung bình |
| >= 5.0 | Trung bình yếu |
| < 5.0 | Không đạt |

Sinh viên có kết quả `FAILED` khi:

- Tổng điểm nhỏ hơn `5.0`; hoặc
- Có tiêu chí bắt buộc thấp hơn điểm tối thiểu của tiêu chí đó.

---

## 4. Công nghệ sử dụng

### Backend

- ASP.NET Core 8
- C#
- Entity Framework Core 8
- Pomelo Entity Framework Core MySQL
- MySQL
- JWT Authentication
- Role-Based Access Control (RBAC)
- Swagger / OpenAPI

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- Axios
- jwt-decode
- Lucide React

---

## 5. Cấu trúc project

```text
intern-management-system/
│
├── backend/
│   ├── Authorization/
│   ├── Controllers/
│   ├── Data/
│   ├── DTOs/
│   ├── Exceptions/
│   ├── Middleware/
│   ├── Migrations/
│   ├── Models/
│   ├── Services/
│   ├── Program.cs
│   ├── appsettings.json
│   └── InternshipManagement.Api.csproj
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.ts
│
├── intern-management-system.sln
└── README.md
```

---

## 6. Yêu cầu môi trường

Cần cài đặt:

- .NET SDK 8
- MySQL Server
- Node.js
- npm
- Git

Kiểm tra:

```bash
dotnet --version
node --version
npm --version
git --version
```

---

## 7. Cấu hình Backend

Di chuyển vào backend:

```bash
cd backend
```

Connection string mặc định trong `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=internship_db;User=root;"
  }
}
```

Thay đổi thông tin MySQL cho phù hợp với môi trường nếu cần.

### JWT Secret

Không lưu JWT Secret trực tiếp trong Git repository.

Project sử dụng **.NET User Secrets** trong môi trường development.

Thiết lập JWT Secret:

```bash
dotnet user-secrets set "Jwt:Key" "YOUR_STRONG_SECRET_KEY"
```

Kiểm tra:

```bash
dotnet user-secrets list
```

---

## 8. Khởi tạo Database

Đảm bảo MySQL Server đang chạy.

Từ thư mục `backend`:

```bash
dotnet ef database update
```

Nếu chưa cài Entity Framework CLI:

```bash
dotnet tool install --global dotnet-ef
```

Sau đó chạy lại:

```bash
dotnet ef database update
```

Database mặc định:

```text
internship_db
```

---

## 9. Chạy Backend

```bash
cd backend
dotnet restore
dotnet build
dotnet run
```

Trong môi trường development hiện tại, frontend gọi API tại:

```text
http://localhost:5114
```

Swagger:

```text
http://localhost:5114/swagger
```

---

## 10. Cấu hình Frontend

Di chuyển vào frontend:

```bash
cd frontend
npm install
```

Tạo file:

```text
frontend/.env
```

Nội dung:

```env
VITE_API_URL=http://localhost:5114/api
```

> `.env` chứa cấu hình cục bộ và không được commit lên Git.

---

## 11. Chạy Frontend

```bash
cd frontend
npm run dev
```

Frontend development server:

```text
http://localhost:5173
```

Build production:

```bash
npm run build
```

---

## 12. Authentication & Authorization

Hệ thống sử dụng JWT Authentication.

JWT chứa các thông tin phục vụ xác thực và phân quyền như:

- User ID
- Email
- Name
- Role
- Permissions
- Expiration

Backend kiểm soát API bằng Permission thay vì chỉ dựa vào Role.

Một số permission chính:

```text
APPLICATION_CREATE
APPLICATION_VIEW_SELF
APPLICATION_VIEW_ALL
APPLICATION_DECIDE

ASSIGNMENT_CREATE
ASSIGNMENT_VIEW_SELF
ASSIGNMENT_VIEW_ALL

EVALUATION_VIEW_SELF
EVALUATION_VIEW_ALL
EVALUATION_SCORE
EVALUATION_SUBMIT
EVALUATION_REVIEW
EVALUATION_RETURN
EVALUATION_PUBLISH

RESULT_VIEW_SELF

COMPANY_VIEW
COMPANY_MANAGE

INTERNSHIP_PERIOD_VIEW
INTERNSHIP_PERIOD_MANAGE

CRITERIA_TEMPLATE_VIEW
CRITERIA_TEMPLATE_MANAGE

REPORT_VIEW
AUDIT_VIEW
DASHBOARD_VIEW
```

---

## 13. Evaluation Workflow

```text
DRAFT
  |
  v
SUBMITTED
  |
  +--------> RETURNED
  |             |
  |             v
  |         SUBMITTED
  |
  v
PUBLISHED
```

Sau khi Evaluation được `PUBLISHED`, hệ thống lưu snapshot kết quả để bảo toàn dữ liệu đã công bố.

---

## 14. Concurrency Control

Evaluation sử dụng `RowVersion` để phát hiện cập nhật đồng thời.

Nếu dữ liệu đã được request khác cập nhật trước, backend trả về conflict thay vì ghi đè dữ liệu mới hơn.

Ví dụ:

```text
EVAL_CONCURRENT_UPDATE
```

---

## 15. Business Rules chính

- Một sinh viên chỉ được tạo một Application trong cùng một Internship Period.
- Chỉ Application `APPROVED` mới được phân công Mentor.
- Đợt thực tập phải có bộ tiêu chí `PUBLISHED` trước khi tạo Evaluation.
- Mentor chỉ được chấm Evaluation được phân công cho mình.
- Chỉ Evaluation `DRAFT` hoặc `RETURNED` mới được chỉnh sửa.
- Evaluation phải có đầy đủ điểm hợp lệ trước khi Submit.
- Tổng trọng số của các tiêu chí phải bằng `100`.
- Reviewer không được đồng thời là Mentor của cùng Evaluation.
- Chỉ Evaluation `SUBMITTED` mới được Return hoặc Publish.
- Student chỉ xem được kết quả đã `PUBLISHED`.

---

## 16. Kiểm tra project

### Backend

```bash
cd backend
dotnet build
```

### Frontend

```bash
cd frontend
npm run build
```

---

## 17. Git

Các file/thư mục không được commit:

```text
.env
node_modules/
dist/
bin/
obj/
.DS_Store
```

Kiểm tra trước khi commit:

```bash
git status
```

---

## 18. Repository

Source code:

`fuowng05/intern-management-system`

Branch ổn định hiện tại:

```text
main
```
---

## Tác giả

**Nhóm 14: Nguyễn Thanh Phượng, Trần Thị Phương Thuỳ, Nghiêm Tùng Dương**

Dự án được xây dựng phục vụ mục đích học tập và phát triển hệ thống quản lý thực tập sinh.
