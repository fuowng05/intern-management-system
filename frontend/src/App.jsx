import React, { useState } from 'react';
import Login from './pages/Login'; // 1. IMPORT TRANG LOGIN
import Sidebar, { navItems } from './components/Sidebar';
import Overview from './pages/Overview';
import StudentManagement from './pages/StudentManagement';
import ApplicationsManagement from './pages/ApplicationsManagement';
import InternshipManagement from './pages/InternshipManagement';
import CompanyManagement from './pages/CompanyManagement';
import MentorManage from './pages/MentorManagement';
import DanhGia from './pages/DanhGia';
import UserManagement from './pages/User';
import TieuChi from './pages/TieuChi';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("React Error Boundary Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '30px', backgroundColor: '#fef2f2', color: '#991b1b', fontFamily: 'monospace', borderRadius: '8px', margin: '20px' }}>
          <h2 style={{ margin: '0 0 10px 0' }}>⚠️ Ứng dụng phát sinh lỗi (Runtime Error)</h2>
          <p style={{ fontWeight: 'bold' }}>{this.state.error && this.state.error.toString()}</p>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px', fontSize: '12px' }}>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  // Lấy token từ localStorage
  const token = localStorage.getItem('token');

  // 2. NẾU CHƯA ĐĂNG NHẬP (KHÔNG CÓ TOKEN) -> HIỂN THỊ TRANG LOGIN
  if (!token) {
    return <Login />;
  }

  // 3. ĐÃ ĐĂNG NHẬP -> HIỂN THỊ GIAO DIỆN QUẢN TRỊ
  return (
    <ErrorBoundary>
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'stretch', 
          minHeight: '100vh', 
          fontFamily: 'system-ui, sans-serif', 
          backgroundColor: '#f8fafc', 
          color: '#0f172a', 
          width: '100%', 
          maxWidth: '100vw',
          overflowX: 'hidden' 
        }}
      >
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main style={{ flex: 1, minWidth: 0, padding: '20px', boxSizing: 'border-box', overflowY: 'auto', overflowX: 'hidden' }}>
          {activeTab === 'overview' && <Overview setActiveTab={setActiveTab} />}
          {activeTab === 'students' && <StudentManagement />}
          
          {(activeTab === 'applications' || activeTab === 'applications-management') && (
            <ApplicationsManagement />
          )}

          {(activeTab === 'periods' || activeTab === 'internship-periods' || activeTab === 'internships') && (
            <InternshipManagement />
          )}

          {activeTab === 'companies' && <CompanyManagement />}

          {(activeTab === 'mentors' || activeTab === 'mentor' || activeTab === 'mentor-assignment' || activeTab === 'mentormanage') && (
            <MentorManage />
          )}

          {(activeTab === 'evaluations' || activeTab === 'danh-gia' || activeTab === 'danhgia' || activeTab === 'evaluations-management') && (
            <DanhGia />
          )}

          {(activeTab === 'users' || activeTab === 'user' || activeTab === 'accounts' || activeTab === 'account-management' || activeTab === 'user-management') && (
            <UserManagement />
          )}

          {(activeTab === 'criteria' || activeTab === 'tieu-chi' || activeTab === 'tieuchi' || activeTab === 'criteria-management') && (
            <TieuChi />
          )}

          {!['overview', 'students', 'applications', 'applications-management', 'periods', 'internship-periods', 'internships', 'companies', 'mentors', 'mentor', 'mentor-assignment', 'mentormanage', 'evaluations', 'danh-gia', 'danhgia', 'evaluations-management', 'users', 'user', 'accounts', 'account-management', 'user-management', 'criteria', 'tieu-chi', 'tieuchi', 'criteria-management'].includes(activeTab) && (
            <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '12px', textAlign: 'center', color: '#64748b', border: '1px solid #e2e8f0' }}>
              Màn hình <strong>{navItems.find(n => n.id === activeTab)?.name}</strong> chưa được tạo file.
            </div>
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
}