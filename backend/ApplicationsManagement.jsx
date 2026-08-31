import React, { useState, useMemo } from 'react';
import Header from '../components/Header';

// --- ICONS (SVG) ---
const IconBuilding = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><line x1="8" x2="8.01" y1="6" y2="6"/><line x1="16" x2="16.01" y1="6" y2="6"/><line x1="12" x2="12.01" y1="6" y2="6"/><line x1="12" x2="12.01" y1="10" y2="10"/><line x1="12" x2="12.01" y1="14" y2="14"/><line x1="16" x2="16.01" y1="10" y2="10"/><line x1="16" x2="16.01" y1="14" y2="14"/><line x1="8" x2="8.01" y1="10" y2="10"/><line x1="8" x2="8.01" y1="14" y2="14"/>
  </svg>
);

const IconEye = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const IconActionCheck = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconActionX = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/>
  </svg>
);

const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/>
  </svg>
);

// --- DỮ LIỆU MẪU ---
const initialApplications = [
  { id: 'HS000842', student: 'Nguyễn Văn An', company: 'FPT Software', status: 'Approved', date: '10/05/2024', avatarSeed: 'NguyenVanAn' },
  { id: 'HS000841', student: 'Trần Thị Bích Ngọc', company: 'Viettel Solutions', status: 'Pending', date: '10/05/2024', avatarSeed: 'BichNgoc' },
  { id: 'HS000840', student: 'Lê Minh Hoàng', company: 'VNPay', status: 'Approved', date: '09/05/2024', avatarSeed: 'MinhHoang' },
  { id: 'HS000839', student: 'Phạm Quang Huy', company: 'MISA JSC', status: 'Pending', date: '08/05/2024', avatarSeed: 'QuangHuy' },
  { id: 'HS000838', student: 'Đỗ Thùy Linh', company: 'Shopee', status: 'Draft', date: '08/05/2024', avatarSeed: 'ThuyLinh' },
  { id: 'HS000837', student: 'Vũ Đức Duy', company: 'TopCV', status: 'Rejected', date: '07/05/2024', avatarSeed: 'DucDuy' },
  { id: 'HS000836', student: 'Bùi Lan Anh', company: 'FPT Software', status: 'Approved', date: '07/05/2024', avatarSeed: 'LanAnh' },
  { id: 'HS000835', student: 'Nguyễn Quốc Bảo', company: 'KMS Technology', status: 'Pending', date: '06/05/2024', avatarSeed: 'QuocBao' },
  { id: 'HS000834', student: 'Hoàng Kim Ngân', company: 'VNPay', status: 'Approved', date: '05/05/2024', avatarSeed: 'KimNgan' },
  { id: 'HS000833', student: 'Đặng Tiến Dũng', company: 'MISA JSC', status: 'Pending', date: '05/05/2024', avatarSeed: 'TienDung' },
];

export default function ApplicationsManagement() {
  const [applications, setApplications] = useState(initialApplications);
  const [searchTerm, setSearchTerm] = useState('');
  const [periodFilter, setPeriodFilter] = useState('ALL');
  const [companyFilter, setCompanyFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [activeModal, setActiveModal] = useState(null);

  // Phân trang linh hoạt
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredData = useMemo(() => {
    setCurrentPage(1); // Reset về trang 1 khi lọc
    return applications.filter((item) => {
      const query = searchTerm.toLowerCase();
      const matchSearch = item.student.toLowerCase().includes(query) || item.id.toLowerCase().includes(query) || item.company.toLowerCase().includes(query);
      const matchCompany = companyFilter === 'ALL' || item.company === companyFilter;
      const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
      return matchSearch && matchCompany && matchStatus;
    });
  }, [applications, searchTerm, companyFilter, statusFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPageData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return { bg: '#dcfce7', color: '#16a34a', label: 'Đã duyệt' };
      case 'Pending':
        return { bg: '#fef3c7', color: '#d97706', label: 'Chờ duyệt' };
      case 'Rejected':
        return { bg: '#fee2e2', color: '#ef4444', label: 'Từ chối' };
      case 'Draft':
        return { bg: '#f1f5f9', color: '#64748b', label: 'Nháp' };
      default:
        return { bg: '#f1f5f9', color: '#64748b', label: status };
    }
  };

  const handleUpdateStatus = (id, newStatus) => {
    setApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
  };

  return (
    <div style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden', boxSizing: 'border-box', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* TÙY CHỈNH THANH CUỘN SÁNG VÀ NÚT CHUYỂN TRANG */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }

        .pg-btn {
          padding: 6px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          background-color: #ffffff;
          color: #334155;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pg-btn:hover:not(:disabled) {
          border-color: #2563eb;
          color: #2563eb;
          background-color: #eff6ff;
        }
        .pg-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          background-color: #f8fafc;
        }
        .pg-btn.active {
          background-color: #2563eb;
          color: #ffffff;
          border-color: #2563eb;
          font-weight: bold;
        }
      `}</style>

      {/* 1. HEADER COMPONENT DÙNG CHUNG */}
      <Header
        title="Quản lý hồ sơ ứng tuyển"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* 2. STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <div style={{ backgroundColor: '#fff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Tổng hồ sơ</div>
          <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px' }}>842</div>
          <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: '600' }}>
            ↗ 12.5% <span style={{ color: '#94a3b8', fontWeight: 'normal' }}>so với tháng trước</span>
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Chờ duyệt</div>
          <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px' }}>236</div>
          <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: '600' }}>
            ↘ 8.1% <span style={{ color: '#94a3b8', fontWeight: 'normal' }}>so với tháng trước</span>
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Đã duyệt</div>
          <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px' }}>468</div>
          <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: '600' }}>
            ↗ 9.6% <span style={{ color: '#94a3b8', fontWeight: 'normal' }}>so với tháng trước</span>
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Bị từ chối</div>
          <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px' }}>138</div>
          <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: '600' }}>
            ↘ 2.3% <span style={{ color: '#94a3b8', fontWeight: 'normal' }}>so với tháng trước</span>
          </div>
        </div>
      </div>

      {/* 3. FILTER BAR */}
      <div style={{ backgroundColor: '#fff', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <select 
            value={periodFilter} 
            onChange={(e) => setPeriodFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px', color: '#334155', backgroundColor: '#fff', outline: 'none' }}
          >
            <option value="ALL">Đợt: Tất cả</option>
            <option value="2024.1">Đợt 1 - 2024</option>
            <option value="2024.2">Đợt 2 - 2024</option>
          </select>

          <select 
            value={companyFilter} 
            onChange={(e) => setCompanyFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px', color: '#334155', backgroundColor: '#fff', outline: 'none' }}
          >
            <option value="ALL">Doanh nghiệp: Tất cả</option>
            <option value="FPT Software">FPT Software</option>
            <option value="Viettel Solutions">Viettel Solutions</option>
            <option value="VNPay">VNPay</option>
            <option value="MISA JSC">MISA JSC</option>
            <option value="Shopee">Shopee</option>
            <option value="TopCV">TopCV</option>
            <option value="KMS Technology">KMS Technology</option>
          </select>

          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px', color: '#334155', backgroundColor: '#fff', outline: 'none' }}
          >
            <option value="ALL">Trạng thái: Tất cả</option>
            <option value="Approved">Đã duyệt</option>
            <option value="Pending">Chờ duyệt</option>
            <option value="Draft">Nháp</option>
            <option value="Rejected">Từ chối</option>
          </select>
        </div>

        <button
          onClick={() => setActiveModal('Tạo hồ sơ mới')}
          style={{
            backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '8px 16px',
            borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px'
          }}
        >
          <IconPlus />
          Tạo hồ sơ mới
        </button>
      </div>

      {/* 4. MAIN CONTENT */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px' }}>
        
        {/* BẢNG DỮ LIỆU CÓ THANH CUỘN MỚI */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
          
          <div className="custom-scrollbar" style={{ width: '100%', overflowX: 'auto', paddingBottom: '8px' }}>
            <table style={{ width: '100%', minWidth: '720px', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ color: '#64748b', fontSize: '12px', borderBottom: '1px solid #f1f5f9' }}>
                  <th style={{ padding: '12px', fontWeight: '600', whiteSpace: 'nowrap', width: '90px' }}>Mã hồ sơ</th>
                  <th style={{ padding: '12px', fontWeight: '600', whiteSpace: 'nowrap', width: '180px' }}>Sinh viên</th>
                  <th style={{ padding: '12px', fontWeight: '600', whiteSpace: 'nowrap' }}>Doanh nghiệp ứng tuyển</th>
                  <th style={{ padding: '12px', fontWeight: '600', whiteSpace: 'nowrap', width: '110px' }}>Trạng thái</th>
                  <th style={{ padding: '12px', fontWeight: '600', whiteSpace: 'nowrap', width: '100px' }}>Ngày nộp</th>
                  <th style={{ padding: '12px', fontWeight: '600', textAlign: 'center', whiteSpace: 'nowrap', width: '90px' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentPageData.map((item) => {
                  const badge = getStatusBadge(item.status);
                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '12px', color: '#2563eb', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        {item.id}
                      </td>

                      <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.avatarSeed}`} 
                            alt={item.student} 
                            style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#f1f5f9', flexShrink: 0 }} 
                          />
                          <span style={{ fontWeight: '600', color: '#0f172a' }}>{item.student}</span>
                        </div>
                      </td>

                      <td style={{ padding: '12px', color: '#475569', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <IconBuilding />
                          <span>{item.company}</span>
                        </div>
                      </td>

                      <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', backgroundColor: badge.bg, color: badge.color, display: 'inline-block' }}>
                          {badge.label}
                        </span>
                      </td>

                      <td style={{ padding: '12px', color: '#64748b', fontSize: '12px', whiteSpace: 'nowrap' }}>
                        {item.date}
                      </td>

                      <td style={{ padding: '12px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                          <button 
                            onClick={() => setActiveModal(`Xem chi tiết hồ sơ ${item.id}`)}
                            title="Xem chi tiết" 
                            style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                          >
                            <IconEye />
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(item.id, 'Approved')}
                            title="Duyệt hồ sơ" 
                            style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                          >
                            <IconActionCheck />
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(item.id, 'Rejected')}
                            title="Từ chối hồ sơ" 
                            style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                          >
                            <IconActionX />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* PAGE PAGINATION ĐÃ SỬA LỖI ĐỘNG */}
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#64748b' }}>
            <span>
              Hiển thị {filteredData.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + itemsPerPage, filteredData.length)} trong tổng số {filteredData.length} hồ sơ
            </span>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button 
                className="pg-btn"
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              >
                ‹
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`pg-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              <button 
                className="pg-btn"
                disabled={currentPage === totalPages || totalPages === 0} 
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              >
                ›
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px' }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }}>Phân bổ hồ sơ theo trạng thái</h4>
            
            <div style={{ display: 'flex', height: '10px', borderRadius: '6px', overflow: 'hidden', marginBottom: '16px', backgroundColor: '#f1f5f9' }}>
              <div style={{ width: '55%', backgroundColor: '#10b981' }} title="Đã duyệt 55%"></div>
              <div style={{ width: '28%', backgroundColor: '#f59e0b' }} title="Chờ duyệt 28%"></div>
              <div style={{ width: '17%', backgroundColor: '#ef4444' }} title="Bị từ chối 17%"></div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
                  Đã duyệt
                </span>
                <span style={{ fontWeight: 'bold', color: '#0f172a' }}>468 hồ sơ (55%)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></span>
                  Chờ duyệt
                </span>
                <span style={{ fontWeight: 'bold', color: '#0f172a' }}>236 hồ sơ (28%)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }}></span>
                  Bị từ chối
                </span>
                <span style={{ fontWeight: 'bold', color: '#0f172a' }}>138 hồ sơ (17%)</span>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }}>Lưu ý duyệt hồ sơ</h4>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>
              Hồ sơ ứng tuyển hợp lệ cần phải đính kèm CV sinh viên và được xác thực trạng thái từ phía điều phối viên khoa.
            </p>
          </div>
        </div>

      </div>

      {/* MODAL */}
      {activeModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', width: '380px', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#0f172a' }}>{activeModal}</h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
              Hệ thống đang mở mẫu nhập/xem thông tin chi tiết cho tính năng này.
            </p>
            <button
              onClick={() => setActiveModal(null)}
              style={{ padding: '8px 20px', borderRadius: '8px', backgroundColor: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
            >
              Đóng cửa sổ
            </button>
          </div>
        </div>
      )}

    </div>
  );
}