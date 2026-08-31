import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';

const app = express();

// Middleware
app.use(cors()); // Bắt buộc có để cho phép Frontend (Vite) truy cập
app.use(express.json());

// Trang kiểm tra trạng thái Backend
app.get('/', (req, res) => {
  res.json({ success: true, message: "Intern Management System API is running" });
});

// Định tuyến API
app.use('/api/auth', authRoutes);

// Khởi chạy Server ở cổng 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});