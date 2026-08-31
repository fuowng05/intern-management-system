import React from 'react';

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

export default function Header({
  title = "Tổng quan hệ thống",
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
                color: '#0f172a',
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

        <img
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=LeTanPhat"
          alt="Admin"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            border: '1px solid #e2e8f0',
            backgroundColor: '#e2e8f0',
          }}
        />
      </div>
    </div>
  );
}