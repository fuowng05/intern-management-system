import React, { useState, useMemo } from 'react';

// --- ICONS (SVG) ---
const IconSearch = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const IconBell = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>;
const IconExcel = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m8 13 4 4"/><path d="m12 13-4 4"/></svg>;
const IconEdit = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>;
const IconMore = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>;
const IconUserMinus = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="22" x2="16" y1="11" y2="11"/></svg>;
const IconUserCheck = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>;
const IconActivity = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const IconPercent = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>;

// DỮ LIỆU BAN ĐẦU
const INITIAL_ASSIGNMENTS = [
  { id: 'HS000842', student: 'Nguyễn Văn An', company: 'FPT Software', mentor: 'Trần Minh Đức', date: '10/05/2024', status: 'Đã phân công', avatarSeed: 'TranMinhDuc' },
  { id: 'HS000841', student: 'Trần Thị Bích Ngọc', company: 'Viettel Solutions', mentor: 'Phạm Thu Hà', date: '10/05/2024', status: 'Đã phân công', avatarSeed: 'PhamThuHa' },
  { id: 'HS000840', student: 'Lê Minh Hoàng', company: 'VNPay', mentor: 'Nguyễn Quang Huy', date: '09/05/2024', status: 'Đã phân công', avatarSeed: 'QuangHuy' },
  { id: 'HS000839', student: 'Phạm Quang Huy', company: 'MISA JSC', mentor: 'Đỗ Thùy Linh', date: '08/05/2024', status: 'Đã phân công', avatarSeed: 'ThuyLinh' },
  { id: 'HS000838', student: 'Đỗ Thùy Linh', company: 'Shopee', mentor: 'Vũ Đức Duy', date: '08/05/2024', status: 'Đã phân công', avatarSeed: 'DucDuy' },
  { id: 'HS000837', student: 'Vũ Đức Duy', company: 'TopCV', mentor: 'Bùi Lan Anh', date: '07/05/2024', status: 'Chờ bắt đầu', avatarSeed: 'LanAnh' },
  { id: 'HS000836', student: 'Bùi Lan Anh', company: 'FPT Software', mentor: 'Trần Minh Đức', date: '07/05/2024', status: 'Đã phân công', avatarSeed: 'TranMinhDuc' },
];

const MENTORS_LIST = [
  { id: 1, name: 'Trần Minh Đức', role: 'Backend Lead', count: '8 SV', avatarSeed: 'TranMinhDuc' },
  { id: 2, name: 'Phạm Thu Hà', role: 'Product Manager', count: '6 SV', avatarSeed: 'PhamThuHa' },
  { id: 3, name: 'Nguyễn Quang Huy', role: 'System Engineer', count: '7 SV', avatarSeed: 'QuangHuy' },
  { id: 4, name: 'Đỗ Thùy Linh', role: 'Data Analyst', count: '5 SV', avatarSeed: 'ThuyLinh' },
  { id: 5, name: 'Vũ Đức Duy', role: 'DevOps Engineer', count: '4 SV', avatarSeed: 'DucDuy' },
];

const UNASSIGNED_STUDENTS = [
  { id: 'HS000843', name: 'Đặng Văn B', company: 'CMC Global' },
  { id: 'HS000844', name: 'Hoàng Thị C', company: 'VNG Corp' },
];

export default function MentorAssignmentContent() {
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedMentorName, setSelectedMentorName] = useState('');
  const [note, setNote] = useState('');

  const filteredData = useMemo(() => {
    return assignments.filter(item => {
      const matchesSearch = 
        item.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.mentor.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = 
        statusFilter === 'ALL' ? true :
        statusFilter === 'ASSIGNED' ? item.status === 'Đã phân công' :
        statusFilter === 'WAITING' ? item.status === 'Chờ bắt đầu' : true;

      return matchesSearch && matchesStatus;
    });
  }, [assignments, searchTerm, statusFilter]);

  const handleAssign = (e) => {
    e.preventDefault();
    if (!selectedStudentId || !selectedMentorName) {
      alert('Vui lòng chọn đầy đủ Sinh viên và Mentor!');
      return;
    }

    const studentObj = UNASSIGNED_STUDENTS.find(s => s.id === selectedStudentId);
    const mentorObj = MENTORS_LIST.find(m => m.name === selectedMentorName);

    const newRecord = {
      id: studentObj ? studentObj.id : `HS${Math.floor(100000 + Math.random() * 900000)}`,
      student: studentObj ? studentObj.name : 'Sinh viên mới',
      company: studentObj ? studentObj.company : 'Doanh nghiệp X',
      mentor: selectedMentorName,
      date: new Date().toLocaleDateString('vi-VN'),
      status: 'Đã phân công',
      avatarSeed: mentorObj ? mentorObj.avatarSeed : 'Default'
    };

    setAssignments([newRecord, ...assignments]);
    setSelectedStudentId('');
    setSelectedMentorName('');
    setNote('');
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#0f172a', boxSizing: 'border-box', width: '100%' }}>
      
      {/* CSS TƯƠNG TÁC MƯỢT MÀ VÀ HOẠT HỌA NÚT BẤM */}
      <style>{`
        * { box-sizing: border-box; }
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #ffffff; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        
        /* Hiệu ứng mượt cho Nút bấm */
        .btn-smooth {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        .btn-smooth:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        .btn-smooth:active {
          transform: translateY(0px) scale(0.98);
        }

        .btn-action-icon {
          transition: all 0.15s ease;
          border-radius: 6px;
          padding: 4px;
        }
        .btn-action-icon:hover {
          background-color: #f1f5f9;
        }

        .pagination-btn { 
          border: 1px solid #e2e8f0; 
          background: #fff; 
          border-radius: 6px; 
          width: 32px; 
          height: 32px; 
          cursor: pointer; 
          display: inline-flex; 
          align-items: center; 
          justify-content: center; 
          font-size: 13px; 
          color: #475569; 
          transition: all 0.15s ease;
        }
          
        .pagination-btn:hover:not(.active) { background: #f1f5f9; border-color: #cbd5e1; }
        .pagination-btn.active { background: #2563eb; color: #fff; border-color: #2563eb; font-weight: 600; box-shadow: 0 2px 4px rgba(37,99,235,0.2); }
      `}</style>

      {/* CONTAINER CHÍNH CÓ TỐI ĐA CHIỀU RỘNG ĐỂ KHÔNG BỊ CO HẸP */}
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        
        {/* 1. HEADER - Tiêu đề sắc nét màu đậm #0f172a */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em' }}>
            Phân công mentor
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <span style={{ position: 'absolute', left: '12px' }}><IconSearch /></span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm thông tin..."
                style={{ padding: '9px 16px 9px 36px', borderRadius: '20px', border: '1px solid #cbd5e1', width: '280px', outline: 'none', fontSize: '13px', backgroundColor: '#fff', color: '#0f172a' }}
              />
            </div>

            <button className="btn-smooth" style={{ border: '1px solid #e2e8f0', background: '#fff', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
              <IconBell />
            </button>

            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=LeTanPhat" alt="User Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #e2e8f0', backgroundColor: '#e2e8f0' }} />
          </div>
        </div>

        {/* 2. STAT CARDS - Cân bằng kích thước chuẩn 4 cột */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <div>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '6px', fontWeight: '500' }}>Chưa phân công</div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>42</div>
              <div style={{ fontSize: '12px', color: '#ef4444', fontWeight: '600', whiteSpace: 'nowrap' }}>↘ 12.1% <span style={{ color: '#94a3b8', fontWeight: 'normal' }}>so với tháng trước</span></div>
            </div>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#fce7f3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><IconUserMinus /></div>
          </div>

          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <div>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '6px', fontWeight: '500' }}>Đã phân công</div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>{assignments.length + 179}</div>
              <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: '600', whiteSpace: 'nowrap' }}>↗ 10.4% <span style={{ color: '#94a3b8', fontWeight: 'normal' }}>so với tháng trước</span></div>
            </div>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><IconUserCheck /></div>
          </div>

          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <div>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '6px', fontWeight: '500' }}>Mentor hoạt động</div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>28</div>
              <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: '600', whiteSpace: 'nowrap' }}>↗ 7.4% <span style={{ color: '#94a3b8', fontWeight: 'normal' }}>so với tháng trước</span></div>
            </div>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><IconActivity /></div>
          </div>

          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <div>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '6px', fontWeight: '500' }}>Tỷ lệ hoàn thành</div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>81.9%</div>
              <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: '600', whiteSpace: 'nowrap' }}>↗ 9.3% <span style={{ color: '#94a3b8', fontWeight: 'normal' }}>so với tháng trước</span></div>
            </div>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><IconPercent /></div>
          </div>
        </div>

        {/* 3. NỘI DUNG CHÍNH - Phân bổ tỷ lệ 7:3 đủ không gian không làm nén cột bảng */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '24px', alignItems: 'start' }}>
          
          {/* CỘT BẢNG DỮ LIỆU RỘNG RÃI */}
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', minWidth: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <h2 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: '#0f172a' }}>Danh sách phân công mentor</h2>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', backgroundColor: '#fff', color: '#334155', fontWeight: '500' }}
                >
                  <option value="ALL">Tất cả trạng thái</option>
                  <option value="ASSIGNED">Đã phân công</option>
                  <option value="WAITING">Chờ bắt đầu</option>
                </select>

                <button className="btn-smooth" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: '1px solid #16a34a', backgroundColor: '#fff', color: '#16a34a', fontSize: '13px', fontWeight: '600' }}>
                  <IconExcel /> Xuất Excel
                </button>
              </div>
            </div>

            {/* Bảng Dữ Liệu Co Dãn Đầy Đủ */}
            <div className="custom-scrollbar" style={{ overflowX: 'auto', width: '100%' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left', minWidth: '700px' }}>
                <thead>
                  <tr style={{ color: '#64748b', fontSize: '12px', borderBottom: '1px solid #e2e8f0', height: '40px' }}>
                    <th style={{ padding: '8px 12px', fontWeight: '600' }}>Mã hồ sơ</th>
                    <th style={{ padding: '8px 12px', fontWeight: '600' }}>Sinh viên</th>
                    <th style={{ padding: '8px 12px', fontWeight: '600' }}>Doanh nghiệp</th>
                    <th style={{ padding: '8px 12px', fontWeight: '600' }}>Mentor</th>
                    <th style={{ padding: '8px 12px', fontWeight: '600' }}>Ngày phân công</th>
                    <th style={{ padding: '8px 12px', fontWeight: '600' }}>Trạng thái</th>
                    <th style={{ padding: '8px 12px', fontWeight: '600', textAlign: 'center' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row) => {
                    const isAssigned = row.status === 'Đã phân công';
                    return (
                      <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9', height: '54px' }}>
                        <td style={{ padding: '8px 12px', color: '#2563eb', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>{row.id}</td>
                        <td style={{ padding: '8px 12px', fontWeight: '600', color: '#0f172a', whiteSpace: 'nowrap' }}>{row.student}</td>
                        <td style={{ padding: '8px 12px', color: '#475569', whiteSpace: 'nowrap' }}>{row.company}</td>
                        <td style={{ padding: '8px 12px', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${row.avatarSeed}`} alt={row.mentor} style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: '#f1f5f9' }} />
                            <span style={{ color: '#334155', fontWeight: '500' }}>{row.mentor}</span>
                          </div>
                        </td>
                        <td style={{ padding: '8px 12px', color: '#64748b', fontSize: '12px', whiteSpace: 'nowrap' }}>{row.date}</td>
                        <td style={{ padding: '8px 12px', whiteSpace: 'nowrap' }}>
                          <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', backgroundColor: isAssigned ? '#dcfce7' : '#fef3c7', color: isAssigned ? '#15803d' : '#b45309', display: 'inline-block' }}>
                            {row.status}
                          </span>
                        </td>
                        <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            <button className="btn-action-icon btn-smooth" style={{ border: 'none', background: 'none' }}><IconEdit /></button>
                            <button className="btn-action-icon btn-smooth" style={{ border: 'none', background: 'none' }}><IconMore /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Phân Trang */}
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#64748b', flexWrap: 'wrap', gap: '12px' }}>
              <span>Hiển thị 1 - {filteredData.length} trong tổng số 186 kết quả</span>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <button className="pagination-btn" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>‹</button>
                <button className={`pagination-btn ${currentPage === 1 ? 'active' : ''}`} onClick={() => setCurrentPage(1)}>1</button>
                <button className={`pagination-btn ${currentPage === 2 ? 'active' : ''}`} onClick={() => setCurrentPage(2)}>2</button>
                <button className={`pagination-btn ${currentPage === 3 ? 'active' : ''}`} onClick={() => setCurrentPage(3)}>3</button>
                <span style={{ padding: '0 4px', color: '#94a3b8' }}>...</span>
                <button className={`pagination-btn ${currentPage === 24 ? 'active' : ''}`} onClick={() => setCurrentPage(24)}>24</button>
                <button className="pagination-btn" onClick={() => setCurrentPage(prev => prev + 1)}>›</button>
              </div>
            </div>
          </div>

          {/* CỘT FORM GÁN MENTOR & DANH SÁCH MENTOR */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
            
            <form onSubmit={handleAssign} style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Gán mentor</h3>
              <p style={{ margin: '0 0 20px 0', fontSize: '12px', color: '#64748b' }}>Phân công người hướng dẫn cho hồ sơ thực tập</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Chọn hồ sơ *</label>
                  <select 
                    value={selectedStudentId} 
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', color: '#334155', outline: 'none', backgroundColor: '#fff' }}
                  >
                    <option value="">-- Chọn hồ sơ sinh viên --</option>
                    {UNASSIGNED_STUDENTS.map(s => (
                      <option key={s.id} value={s.id}>{s.id} - {s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Chọn mentor *</label>
                  <select 
                    value={selectedMentorName} 
                    onChange={(e) => setSelectedMentorName(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', color: '#334155', outline: 'none', backgroundColor: '#fff' }}
                  >
                    <option value="">-- Chọn mentor phụ trách --</option>
                    {MENTORS_LIST.map((m) => (
                      <option key={m.id} value={m.name}>{m.name} - {m.role}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Ghi chú</label>
                  <textarea
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Nhập ghi chú phân công..."
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', color: '#0f172a', backgroundColor: '#fff', outline: 'none', resize: 'none' }}
                  />
                </div>

                <button type="submit" className="btn-smooth" style={{ width: '100%', padding: '11px', borderRadius: '8px', backgroundColor: '#2563eb', color: '#fff', border: 'none', fontSize: '14px', fontWeight: '600', boxShadow: '0 2px 4px rgba(37,99,235,0.2)' }}>
                  Xác nhận gán
                </button>
              </div>
            </form>

            <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>Danh sách mentor ({MENTORS_LIST.length})</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {MENTORS_LIST.map((mentor) => (
                  <div key={mentor.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${mentor.avatarSeed}`} alt={mentor.name} style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#f1f5f9' }} />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>{mentor.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{mentor.role}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: '600', color: '#2563eb', backgroundColor: '#eff6ff', padding: '3px 9px', borderRadius: '12px' }}>
                      {mentor.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}