import React, { useState, useMemo } from 'react';
import Header from '../components/Header';

// --- ICONS (SVG) ---
const IconSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
);

const IconCalendar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
  </svg>
);

// --- DỮ LIỆU MẪU ---
const initialPeriods = [
  { id: 'K2024-01', name: 'Đợt thực tập Hè 2024', startDate: '01/06/2024', endDate: '30/08/2024', studentsCount: 120, status: 'Active' },
  { id: 'K2024-02', name: 'Đợt thực tập Đông 2024', startDate: '01/07/2024', endDate: '30/09/2024', studentsCount: 85, status: 'Active' },
  { id: 'K2024-03', name: 'Đợt thực tập Xuân 2025', startDate: '01/01/2025', endDate: '30/03/2025', studentsCount: 0, status: 'Upcoming' },
];

export default function InternshipManagementMainContent() {
  const [periods, setPeriods] = useState(initialPeriods);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [formData, setFormData] = useState({
    id: 'K2024-04',
    name: '',
    startDate: '',
    endDate: ''
  });

  const filteredPeriods = useMemo(() => {
    return periods.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [periods, searchTerm, statusFilter]);

  const handleCreatePeriod = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    const newPeriod = {
      id: formData.id,
      name: formData.name,
      startDate: formData.startDate || '01/10/2024',
      endDate: formData.endDate || '31/12/2024',
      studentsCount: 0,
      status: 'Upcoming'
    };

    setPeriods([newPeriod, ...periods]);
    setFormData({
      id: `K2024-0${periods.length + 2}`,
      name: '',
      startDate: '',
      endDate: ''
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return { bg: '#dcfce7', color: '#16a34a', label: 'Đang mở' };
      case 'Upcoming':
        return { bg: '#fef3c7', color: '#d97706', label: 'Sắp diễn ra' };
      case 'Completed':
        return { bg: '#f1f5f9', color: '#64748b', label: 'Đã hoàn tất' };
      default:
        return { bg: '#f1f5f9', color: '#64748b', label: status };
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden', boxSizing: 'border-box', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* 1. HEADER COMPONENT DÙNG CHUNG */}
      <Header
        title="Quản lý đợt thực tập"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* 2. BỐ CỤC CHÍNH 2 CỘT */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', alignItems: 'start' }}>
        
        {/* CỘT TRÁI (NỘI DUNG CHÍNH) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>
          
          {/* 4 THẺ THỐNG KÊ (ĐÃ ÉP CÙNG 1 HÀNG BẰNG REPEAT 4) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            
            <div style={{ backgroundColor: '#fff', padding: '16px 12px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Tổng đợt</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px' }}>12</div>
              <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: '600' }}>
                ↗ 3.2% <span style={{ color: '#94a3b8', fontWeight: 'normal' }}>so với tháng trước</span>
              </div>
            </div>

            <div style={{ backgroundColor: '#fff', padding: '16px 12px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Đang mở</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px' }}>3</div>
              <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: '600' }}>
                ↗ 1.0% <span style={{ color: '#94a3b8', fontWeight: 'normal' }}>so với tháng trước</span>
              </div>
            </div>

            <div style={{ backgroundColor: '#fff', padding: '16px 12px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Sắp diễn ra</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px' }}>2</div>
              <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: '600' }}>
                ↗ 0.0% <span style={{ color: '#94a3b8', fontWeight: 'normal' }}>so với tháng trước</span>
              </div>
            </div>

            <div style={{ backgroundColor: '#fff', padding: '16px 12px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Đã hoàn tất</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px' }}>7</div>
              <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: '600' }}>
                ↗ 4.5% <span style={{ color: '#94a3b8', fontWeight: 'normal' }}>so với tháng trước</span>
              </div>
            </div>

          </div>

          {/* THANH LỌC NỘI BỘ */}
          <div style={{ backgroundColor: '#fff', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: '1', minWidth: '200px' }}>
              <span style={{ position: 'absolute', left: '12px', display: 'flex' }}><IconSearch /></span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm nhanh đợt thực tập..."
                style={{
                  width: '100%', padding: '8px 12px 8px 34px', borderRadius: '8px', border: '1px solid #e2e8f0',
                  outline: 'none', fontSize: '12px', backgroundColor: '#f8fafc', color: '#0f172a', boxSizing: 'border-box'
                }}
              />
            </div>

            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px', color: '#334155', backgroundColor: '#fff', outline: 'none' }}
            >
              <option value="ALL">Trạng thái: Tất cả</option>
              <option value="Active">Đang mở</option>
              <option value="Upcoming">Sắp diễn ra</option>
              <option value="Completed">Đã hoàn tất</option>
            </select>
          </div>

          {/* GRID THẺ ĐỢT THỰC TẬP */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            {filteredPeriods.map((item) => {
              const badge = getStatusBadge(item.status);
              return (
                <div key={item.id} style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#2563eb' }}>{item.id}</span>
                      <span style={{ padding: '3px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '600', backgroundColor: badge.bg, color: badge.color }}>
                        {badge.label}
                      </span>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a', marginBottom: '4px' }}>{item.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>{item.startDate} - {item.endDate}</div>
                  </div>

                  <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                    <span style={{ color: '#64748b' }}>Số sinh viên:</span>
                    <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{item.studentsCount} SV</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* BIỂU ĐỒ GANTT */}
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', overflowX: 'auto' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }}>Lộ trình các đợt thực tập (Gantt Chart)</h3>
            
            <div style={{ minWidth: '500px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '90px repeat(7, 1fr)', fontSize: '11px', color: '#64748b', textAlign: 'center', marginBottom: '16px', fontWeight: '500' }}>
                <div></div>
                <div>T4/2024</div>
                <div>T5/2024</div>
                <div>T6/2024</div>
                <div>T7/2024</div>
                <div>T8/2024</div>
                <div>T9/2024</div>
                <div>T10/2024</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#0f172a' }}>K2024-01</span>
                <div style={{ height: '14px', backgroundColor: '#f1f5f9', borderRadius: '7px', overflow: 'hidden', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '28%', width: '42%', height: '100%', backgroundColor: '#10b981', borderRadius: '7px' }}></div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#0f172a' }}>K2024-02</span>
                <div style={{ height: '14px', backgroundColor: '#f1f5f9', borderRadius: '7px', overflow: 'hidden', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '42%', width: '42%', height: '100%', backgroundColor: '#2563eb', borderRadius: '7px' }}></div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#0f172a' }}>K2024-03</span>
                <div style={{ height: '14px', backgroundColor: '#f1f5f9', borderRadius: '7px', overflow: 'hidden', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '70%', width: '30%', height: '100%', backgroundColor: '#f59e0b', borderRadius: '7px' }}></div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* CỘT PHẢI: FORM TẠO ĐỢT MỚI */}
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', height: 'fit-content' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }}>Tạo đợt thực tập mới</h3>
          
          <form onSubmit={handleCreatePeriod} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#475569', marginBottom: '6px', fontWeight: '500' }}>Mã đợt thực tập</label>
              <input
                type="text"
                value={formData.id}
                readOnly
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '13px', color: '#334155', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#475569', marginBottom: '6px', fontWeight: '500' }}>Tên đợt thực tập</label>
              <input
                type="text"
                placeholder="Nhập tên đợt..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#0f172a', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#475569', marginBottom: '6px', fontWeight: '500' }}>Ngày bắt đầu</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="dd/mm/yyyy"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  style={{ width: '100%', padding: '9px 36px 9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#0f172a', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                />
                <span style={{ position: 'absolute', right: '12px', pointerEvents: 'none', color: '#94a3b8', display: 'flex' }}><IconCalendar /></span>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#475569', marginBottom: '6px', fontWeight: '500' }}>Ngày kết thúc</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="dd/mm/yyyy"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  style={{ width: '100%', padding: '9px 36px 9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#0f172a', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                />
                <span style={{ position: 'absolute', right: '12px', pointerEvents: 'none', color: '#94a3b8', display: 'flex' }}><IconCalendar /></span>
              </div>
            </div>

            <button
              type="submit"
              style={{
                backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px',
                borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer',
                marginTop: '6px', textAlign: 'center', transition: 'background-color 0.2s'
              }}
            >
              Xác nhận tạo
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}