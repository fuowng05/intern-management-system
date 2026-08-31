import React from 'react';

export const navItems = [
  { id: 'overview', name: 'Tổng quan hệ thống' },
  { id: 'students', name: 'Quản lý sinh viên' },
  { id: 'applications', name: 'Quản lý hồ sơ' },
  { id: 'periods', name: 'Quản lý đợt thực tập' },
  { id: 'companies', name: 'Quản lý doanh nghiệp' },
  { id: 'mentors', name: 'Phân công mentor' },
  { id: 'evaluations', name: 'Quản lý đánh giá' },
  { id: 'criteria', name: 'Tiêu chí đánh giá' },
  { id: 'accounts', name: 'Quản lý tài khoản' },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside
      style={{
        width: '230px',
        flexShrink: 0,
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        padding: '20px 16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignSelf: 'stretch', // Bắt buộc Sidebar kéo giãn bằng chiều cao Main
        boxSizing: 'border-box',
      }}
    >
      <div>
        {/* LOGO BRAND */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', paddingLeft: '4px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              backgroundColor: '#2563eb',
              borderRadius: '8px',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
            }}
          >
            IH
          </div>
          <div>
            <h1 style={{ fontSize: '15px', margin: 0, fontWeight: 'bold', color: '#0f172a' }}>
              InternHub
            </h1>
            <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>
              Hệ thống quản lý
            </span>
          </div>
        </div>

        {/* MENU NAVIGATION */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                textAlign: 'left',
                padding: '9px 12px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '13px',
                fontWeight: activeTab === item.id ? '600' : '500',
                color: activeTab === item.id ? '#2563eb' : '#64748b',
                backgroundColor: activeTab === item.id ? '#eff6ff' : 'transparent',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              {item.name}
            </button>
          ))}
        </nav>
      </div>

      {/* USER PROFILE FOOTER */}
      <div
        style={{
          borderTop: '1px solid #e2e8f0',
          paddingTop: '12px',
          marginBottom: '4px', // Tinh chỉnh lề dưới để cân bằng dòng chữ với nút Chỉnh sửa
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <img
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=LeTanPhat"
          alt="Lê Tấn Phát"
          style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#e2e8f0' }}
        />
        <div>
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a' }}>Lê Tấn Phát</div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Quản trị viên</div>
        </div>
      </div>
    </aside>
  );
}