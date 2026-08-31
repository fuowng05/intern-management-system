import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { useApiData } from '../hooks/useApiData';
import { mockOverviewData } from '../data/mockData';
import Header from '../components/Header'; // -> Đã thêm import Header (điều chỉnh lại đường dẫn nếu cần)

const IconUserPlus = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>
  </svg>
);
const IconBuildingPlus = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>
  </svg>
);
const IconFileExport = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0891b2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="12" x2="12" y1="18" y2="12"/><line x1="9" x2="12" y1="15" y2="12"/><line x1="15" x2="12" y1="15" y2="12"/>
  </svg>
);
const IconCalendar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
  </svg>
);

export default function Overview({ setActiveTab }) {
  const { data } = useApiData('/dashboard', mockOverviewData);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeModal, setActiveModal] = useState(null);

  const itemsPerPage = 5;

  const filteredApplications = useMemo(() => {
    if (!data?.applications) return [];
    return data.applications.filter((item) => {
      const studentName = item?.student || '';
      const applicationId = item?.id || '';
      const companyName = item?.company || '';
      const query = searchTerm.toLowerCase();

      const matchSearch =
        studentName.toLowerCase().includes(query) ||
        applicationId.toLowerCase().includes(query) ||
        companyName.toLowerCase().includes(query);

      const matchStatus = statusFilter === 'ALL' || item?.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [data, searchTerm, statusFilter]);

  const paginatedApplications = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredApplications.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredApplications, currentPage]);

  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage) || 1;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Submitted': return { bg: '#eff6ff', color: '#2563eb', label: 'Submitted' };
      case 'Approved': return { bg: '#dcfce7', color: '#16a34a', label: 'Approved' };
      case 'Draft': return { bg: '#f1f5f9', color: '#64748b', label: 'Draft' };
      case 'Rejected': return { bg: '#fee2e2', color: '#ef4444', label: 'Rejected' };
      default: return { bg: '#f1f5f9', color: '#64748b', label: status || 'N/A' };
    }
  };

  const handleExportReport = () => {
    const exportData = filteredApplications.map(item => ({
      'Mã hồ sơ': item.id || '',
      'Sinh viên': item.student || '',
      'Đợt thực tập': item.period || '',
      'Doanh nghiệp': item.company || '',
      'Trạng thái': item.status || '',
      'Ngày nộp': item.date || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Báo Cáo");

    XLSX.writeFile(workbook, `Bao_Cao_Thuc_Tap_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  if (!data || !data.stats) return <div style={{ padding: '20px', color: '#64748b' }}>Đang tải dữ liệu...</div>;

  return (
    <div style={{ width: '100%', boxSizing: 'border-box' }}>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
      
      {/* 1. HEADER */}
      <Header
        title="Tổng quan hệ thống"
        searchTerm={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val);
          setCurrentPage(1);
        }}
        placeholder="Tìm kiếm thông tin..."
      />

      {/* 2. TOP CARDS THỐNG KÊ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
        {data.stats.map((s, i) => (
          <div key={i} style={{ backgroundColor: '#fff', padding: '16px 18px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>{s.title}</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px' }}>{s.value}</div>
            <div style={{ fontSize: '11px', color: s.isUp ? '#16a34a' : '#ef4444', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>{s.isUp ? '↗' : '↘'} {s.change}</span>
              <span style={{ color: '#94a3b8', fontWeight: 'normal' }}>so với tháng trước</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. LAYOUT GRID 2 CỘT */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '20px' }}>
        
        {/* CỘT TRÁI */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>
          
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '18px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#0f172a' }}>Danh sách hồ sơ thực tập</h3>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                  style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px', outline: 'none', color: '#334155', cursor: 'pointer', backgroundColor: '#f8fafc' }}
                >
                  <option value="ALL">Tất cả trạng thái</option>
                  <option value="Submitted">Submitted (Đã nộp)</option>
                  <option value="Approved">Approved (Đã duyệt)</option>
                  <option value="Draft">Draft (Bản nháp)</option>
                  <option value="Rejected">Rejected (Từ chối)</option>
                </select>

                <button
                  onClick={() => { setStatusFilter('ALL'); setSearchTerm(''); setCurrentPage(1); }}
                  style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#fff', fontSize: '12px', color: '#475569', cursor: 'pointer' }}
                >
                  Xem tất cả
                </button>
              </div>
            </div>

            {/* BẢNG DỮ LIỆU */}
            <div className="custom-scrollbar" style={{ overflowX: 'auto', paddingBottom: '6px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: '600' }}>
                    <th style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>Mã hồ sơ</th>
                    <th style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>Sinh viên</th>
                    <th style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>Đợt thực tập</th>
                    <th style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>Doanh nghiệp</th>
                    <th style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>Trạng thái</th>
                    <th style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>Ngày nộp</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedApplications.length > 0 ? (
                    paginatedApplications.map((item, idx) => {
                      const badge = getStatusBadge(item.status);
                      return (
                        <tr key={item.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px', color: '#2563eb', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>{item.id}</td>
                          <td style={{ padding: '12px', fontWeight: '600', color: '#0f172a', whiteSpace: 'nowrap' }}>{item.student}</td>
                          <td style={{ padding: '12px', color: '#64748b', whiteSpace: 'nowrap' }}>{item.period}</td>
                          <td style={{ padding: '12px', color: '#475569', whiteSpace: 'nowrap' }}>{item.company}</td>
                          <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>
                            <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', backgroundColor: badge.bg, color: badge.color }}>
                              {badge.label}
                            </span>
                          </td>
                          <td style={{ padding: '12px', color: '#64748b', whiteSpace: 'nowrap' }}>{item.date}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
                        Không tìm thấy hồ sơ phù hợp.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PHÂN TRANG */}
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#64748b' }}>
              <span>
                Hiển thị {filteredApplications.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, filteredApplications.length)} trong tổng số {filteredApplications.length} hồ sơ
              </span>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  style={{ padding: '4px 8px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', color: currentPage === 1 ? '#cbd5e1' : '#334155' }}
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: currentPage === page ? '#2563eb' : '#fff',
                      color: currentPage === page ? '#fff' : '#334155',
                      fontWeight: currentPage === page ? 'bold' : 'normal',
                      cursor: 'pointer'
                    }}
                  >
                    {page}
                  </button>
                ))}
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  style={{ padding: '4px 8px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#fff', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', color: currentPage === totalPages ? '#cbd5e1' : '#334155' }}
                >
                  ›
                </button>
              </div>
            </div>
          </div>

          {/* NÚT HÀNH ĐỘNG & THẺ SINH VIÊN */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '16px' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a' }}>Hồ sơ sinh viên nổi bật</span>
                <button onClick={() => alert("Chuyển tới hồ sơ sinh viên: " + (data.featuredStudent?.name || ''))} style={{ fontSize: '11px', color: '#2563eb', border: 'none', background: 'none', cursor: 'pointer', fontWeight: '500' }}>Xem chi tiết</button>
              </div>
              
              {data.featuredStudent && (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=NguyenVanAn" alt="Student" style={{ width: '56px', height: '56px', borderRadius: '10px', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0' }} />
                  <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#0f172a' }}>
                      {data.featuredStudent.name} <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: 'normal' }}>{data.featuredStudent.code}</span>
                    </div>
                    <div style={{ color: '#64748b' }}>Lớp: {data.featuredStudent.class}</div>
                    <div style={{ color: '#64748b' }}>Ngành: {data.featuredStudent.major}</div>
                    <div style={{ color: '#64748b' }}>Điện thoại: {data.featuredStudent.phone}</div>
                    <div style={{ marginTop: '4px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: '600', backgroundColor: '#dcfce7', color: '#16a34a' }}>
                        {data.featuredStudent.status}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div onClick={() => setActiveModal('Tạo hồ sơ thực tập mới')} style={{ backgroundColor: '#fff', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><IconUserPlus /></div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#0f172a' }}>Tạo hồ sơ mới</div>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>Tạo hồ sơ thực tập</div>
                </div>
              </div>

              <div onClick={() => setActiveModal('Đăng ký doanh nghiệp mới')} style={{ backgroundColor: '#fff', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><IconBuildingPlus /></div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#0f172a' }}>Thêm doanh nghiệp</div>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>Đăng ký doanh nghiệp</div>
                </div>
              </div>

              <div onClick={handleExportReport} style={{ backgroundColor: '#fff', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#ecfeff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><IconFileExport /></div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#0f172a' }}>Xuất báo cáo</div>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>Thống kê & báo cáo</div>
                </div>
              </div>

              <div onClick={() => setActiveTab && setActiveTab('periods')} style={{ backgroundColor: '#fff', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><IconCalendar /></div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#0f172a' }}>Quản lý đợt thực tập</div>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>Tạo & cấu hình đợt</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* CỘT PHẢI */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }}>Đợt thực tập đang mở</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {data.activePeriods?.map((p, i) => (
                <div key={i} style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>📅</div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a' }}>{p.code}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{p.title}</div>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>{p.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }}>Phân công mentor gần đây</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {data.recentMentors?.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Mentor${i}`} alt="Mentor" style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f1f5f9' }} />
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#0f172a' }}>{m.mentor}</div>
                      <div style={{ fontSize: '10px', color: '#94a3b8' }}>Mentor</div>
                    </div>
                  </div>
                  <span style={{ color: '#cbd5e1', fontSize: '14px' }}>➔</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#2563eb', fontWeight: '600' }}>{m.studentCode}</div>
                    <div style={{ fontSize: '11px', color: '#475569' }}>{m.student}</div>
                    <div style={{ fontSize: '9px', color: '#94a3b8' }}>{m.company}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KẾT QUẢ ĐÁNH GIÁ TỔNG QUAN */}
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }}>Kết quả đánh giá tổng quan</h4>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '12px 0' }}>
              <div style={{
                width: '84px', height: '84px', borderRadius: '50%',
                background: 'conic-gradient(#10b981 0% 35.4%, #3b82f6 35.4% 76.8%, #f59e0b 76.8% 94.4%, #ef4444 94.4% 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#fff',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2px'
                }}>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a', lineHeight: '1.2' }}>76.8%</span>
                  <span style={{ fontSize: '8px', color: '#94a3b8', lineHeight: '1.1', marginTop: '2px' }}>Đánh giá đạt</span>
                </div>
              </div>

              <div style={{ flex: 1, fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span><span style={{ color: '#10b981' }}>●</span> Xuất sắc</span>
                  <strong>35.4%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span><span style={{ color: '#3b82f6' }}>●</span> Tốt</span>
                  <strong>41.4%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span><span style={{ color: '#f59e0b' }}>●</span> Trung bình</span>
                  <strong>17.6%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span><span style={{ color: '#ef4444' }}>●</span> Yếu</span>
                  <strong>5.6%</strong>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '8px', fontSize: '10px', color: '#94a3b8', textAlign: 'center' }}>
              Dựa trên 842 đánh giá tuần này
            </div>
          </div>

        </div>

      </div>

      {activeModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', width: '360px', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#0f172a' }}>{activeModal}</h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
              Tính năng đang khởi tạo form dữ liệu thực tế cho ứng dụng.
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