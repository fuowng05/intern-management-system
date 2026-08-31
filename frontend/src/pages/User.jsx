import React, { useState } from 'react';

// --- INLINE SVG ICONS ---
const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
);

const IconBell = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
  </svg>
);

const IconUsers = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IconKey = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3"/></svg>;
const IconEdit = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>;
const IconShield = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IconRibbon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>;
const IconActivity = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;

// --- HEADER COMPONENT (Đã loại bỏ ảnh AI, dùng Avatar chữ) ---
export function Header({
  title = "Quản lý tài khoản người dùng",
  searchTerm = "",
  onSearchChange,
  placeholder = "Tìm kiếm thông tin...",
  showSearch = true,
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', color: '#0f172a' }}>
        {title}
      </h1>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {showSearch && (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', left: '12px' }}>
              <IconSearch />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              placeholder={placeholder}
              style={{
                padding: '8px 16px 8px 36px',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                width: '240px',
                outline: 'none',
                fontSize: '13px',
                backgroundColor: '#ffffff',
                color: '#000000',
              }}
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange && onSearchChange('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  fontSize: '12px',
                }}
              >
                ✕
              </button>
            )}
          </div>
        )}

        <button
          onClick={() => alert("Hiện không có thông báo mới!")}
          style={{
            border: '1px solid #e2e8f0',
            background: '#fff',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <IconBell />
          <span
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '7px',
              height: '7px',
              backgroundColor: '#ef4444',
              borderRadius: '50%',
            }}
          />
        </button>

        {/* Avatar Admin bằng chữ tiêu chuẩn */}
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          backgroundColor: '#2563eb',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '13px',
          border: '1px solid #e2e8f0'
        }}>
          AD
        </div>
      </div>
    </div>
  );
}

// DỮ LIỆU TÀI KHOẢN GIẢ LẬP (Không dùng URL ảnh AI)
const USER_LIST = [
  { id: 1, name: 'Lê Tấn Phát', username: 'admin_tanphat', email: 'phat.lt@internhub.vn', role: 'Admin', roleColor: '#fce7f3', roleTextColor: '#db2777', status: 'Hoạt động', statusBg: '#dcfce7', statusTextColor: '#15803d', lastLogin: 'Vừa mới xong', initials: 'TP', avatarBg: '#db2777' },
  { id: 2, name: 'Nguyễn Văn An', username: 'student_an.nv', email: 'an.nv@internhub.vn', role: 'Student', roleColor: '#dbeafe', roleTextColor: '#2563eb', status: 'Hoạt động', statusBg: '#dcfce7', statusTextColor: '#15803d', lastLogin: '10 phút trước', initials: 'VA', avatarBg: '#2563eb' },
  { id: 3, name: 'Trần Minh Đức', username: 'mentor_ductm', email: 'duc.tm@fsoft.com.vn', role: 'Mentor', roleColor: '#dcfce7', roleTextColor: '#16a34a', status: 'Hoạt động', statusBg: '#dcfce7', statusTextColor: '#15803d', lastLogin: '1 giờ trước', initials: 'MĐ', avatarBg: '#16a34a' },
  { id: 4, name: 'Phạm Thu Hà', username: 'leader_hapm', email: 'ha.pm@viettel.vn', role: 'Leader', roleColor: '#f3e8ff', roleTextColor: '#9333ea', status: 'Hoạt động', statusBg: '#dcfce7', statusTextColor: '#15803d', lastLogin: 'Hôm qua', initials: 'TH', avatarBg: '#9333ea' },
  { id: 5, name: 'Trần Thị Bích Ngọc', username: 'student_ngoc.ttb', email: 'ngoc.ttb@internhub.vn', role: 'Student', roleColor: '#dbeafe', roleTextColor: '#2563eb', status: 'Chưa xác minh', statusBg: '#fef3c7', statusTextColor: '#d97706', lastLogin: '3 ngày trước', initials: 'BN', avatarBg: '#d97706' }
];

export default function UserManagement() {
  const [selectedUser, setSelectedUser] = useState(USER_LIST[2]);
  const [tableSearch, setTableSearch] = useState('');
  const [permissions, setPermissions] = useState({
    viewReport: true,
    manageProfile: true,
    weeklyEvaluation: true,
    exportResult: true,
    editCriteria: false,
    manageUser: false
  });

  const togglePerm = (key) => setPermissions(p => ({ ...p, [key]: !p[key] }));

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: '#0f172a' }}>
      
      {/* 1. HEADER CỦA BẠN */}
      <Header 
        title="Quản lý tài khoản người dùng"
        searchTerm={tableSearch}
        onSearchChange={setTableSearch}
      />

      {/* 2. STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#fff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px' }}>Tổng tài khoản</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>1.254</div>
            <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: '600' }}>↗ 12.5% <span style={{ color: '#94a3b8', fontWeight: 'normal' }}>so với tháng trước</span></div>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
            <IconUsers />
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px' }}>Quản trị viên</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>8</div>
            <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: '600' }}>↗ Hoạt động <span style={{ color: '#94a3b8', fontWeight: 'normal' }}>so với tháng trước</span></div>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconShield />
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px' }}>Mentor</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>156</div>
            <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: '600' }}>↗ 10.2% <span style={{ color: '#94a3b8', fontWeight: 'normal' }}>so với tháng trước</span></div>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconRibbon />
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px' }}>Sinh viên hoạt động</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>842</div>
            <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: '600' }}>↗ 8.1% <span style={{ color: '#94a3b8', fontWeight: 'normal' }}>so với tháng trước</span></div>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconActivity />
          </div>
        </div>
      </div>

      {/* 3. MAIN SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', alignItems: 'start' }}>
        
        <div>
          {/* Filter Bar */}
          <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              
              {/* Ô TÌM KIẾM TÀI KHOẢN: NỀN TRẮNG CHỮ ĐEN */}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ position: 'absolute', left: '10px' }}><IconSearch /></span>
                <input 
                  type="text" 
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  placeholder="Tìm kiếm tài khoản..." 
                  style={{ 
                    padding: '7px 12px 7px 32px', 
                    borderRadius: '6px', 
                    border: '1px solid #cbd5e1', 
                    fontSize: '13px', 
                    outline: 'none', 
                    width: '200px',
                    backgroundColor: '#ffffff',
                    color: '#000000'
                  }} 
                />
              </div>

              <select style={{ padding: '7px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', color: '#475569', backgroundColor: '#fff' }}>
                <option>Vai trò: Tất cả</option>
              </select>
              <select style={{ padding: '7px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', color: '#475569', backgroundColor: '#fff' }}>
                <option>Trạng thái: Tất cả</option>
              </select>
            </div>

            <button style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
              + Tạo tài khoản
            </button>
          </div>

          {/* User Table */}
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px 20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ color: '#64748b', fontSize: '12px', borderBottom: '1px solid #f1f5f9' }}>
                  <th style={{ padding: '12px 8px', fontWeight: '600' }}>Họ và tên / Tài khoản</th>
                  <th style={{ padding: '12px 8px', fontWeight: '600' }}>Email liên hệ</th>
                  <th style={{ padding: '12px 8px', fontWeight: '600' }}>Vai trò</th>
                  <th style={{ padding: '12px 8px', fontWeight: '600' }}>Trạng thái</th>
                  <th style={{ padding: '12px 8px', fontWeight: '600' }}>Lần đăng nhập cuối</th>
                  <th style={{ padding: '12px 8px', fontWeight: '600', textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {USER_LIST.filter(u => u.name.toLowerCase().includes(tableSearch.toLowerCase()) || u.username.toLowerCase().includes(tableSearch.toLowerCase())).map((u) => {
                  const isSelected = selectedUser.id === u.id;
                  return (
                    <tr 
                      key={u.id} 
                      onClick={() => setSelectedUser(u)}
                      style={{ borderBottom: '1px solid #f8fafc', backgroundColor: isSelected ? '#f8fafc' : 'transparent', cursor: 'pointer' }}
                    >
                      <td style={{ padding: '12px 8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          
                          {/* Avatar Chữ tiêu chuẩn */}
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: u.avatarBg,
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '12px',
                            flexShrink: 0
                          }}>
                            {u.initials}
                          </div>

                          <div>
                            <div style={{ fontWeight: '700', color: '#0f172a' }}>{u.name}</div>
                            <div style={{ fontSize: '11px', color: '#94a3b8' }}>{u.username}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 8px', color: '#475569' }}>{u.email}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <span style={{ backgroundColor: u.roleColor, color: u.roleTextColor, padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '600' }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px' }}>
                        <span style={{ backgroundColor: u.statusBg, color: u.statusTextColor, padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600' }}>
                          {u.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px', color: '#64748b', fontSize: '12px' }}>{u.lastLogin}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '2px' }}><IconKey /></button>
                          <button style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '2px' }}><IconEdit /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. DETAILS SIDEBAR */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px 20px' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>Thông tin tài khoản</h3>
          
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            {/* Avatar lớn ở khung bên phải */}
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: selectedUser.avatarBg,
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '20px',
              margin: '0 auto 12px auto'
            }}>
              {selectedUser.initials}
            </div>

            <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>{selectedUser.name}</div>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>{selectedUser.email}</div>
            
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <span style={{ backgroundColor: selectedUser.roleColor, color: selectedUser.roleTextColor, padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600' }}>
                {selectedUser.role}
              </span>
              <span style={{ backgroundColor: selectedUser.statusBg, color: selectedUser.statusTextColor, padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600' }}>
                {selectedUser.status}
              </span>
            </div>
          </div>

          <h4 style={{ margin: '0 0 16px 0', fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>Quyền hạn được cấp</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { key: 'viewReport', label: 'Xem báo cáo khoa' },
              { key: 'manageProfile', label: 'Quản lý hồ sơ phân công' },
              { key: 'weeklyEvaluation', label: 'Đánh giá kết quả tuần' },
              { key: 'exportResult', label: 'Xuất file kết quả' },
              { key: 'editCriteria', label: 'Chỉnh sửa tiêu chí' },
              { key: 'manageUser', label: 'Quản lý người dùng' }
            ].map((perm) => (
              <div key={perm.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f8fafc', padding: '8px 12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '12px', color: '#334155', fontWeight: '500' }}>{perm.label}</span>
                <div 
                  onClick={() => togglePerm(perm.key)}
                  style={{ 
                    width: '34px', 
                    height: '18px', 
                    backgroundColor: permissions[perm.key] ? '#2563eb' : '#cbd5e1', 
                    borderRadius: '10px', 
                    padding: '2px', 
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ 
                    width: '14px', 
                    height: '14px', 
                    backgroundColor: '#fff', 
                    borderRadius: '50%', 
                    transform: permissions[perm.key] ? 'translateX(16px)' : 'translateX(0)',
                    transition: 'all 0.2s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}