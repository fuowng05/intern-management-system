import React, { useState, useMemo } from 'react';
import Header from '../components/Header';

// --- ICONS (SVG) ---
const IconBuilding = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><line x1="8" x2="8.01" y1="6" y2="6"/><line x1="16" x2="16.01" y1="6" y2="6"/><line x1="12" x2="12.01" y1="6" y2="6"/><line x1="12" x2="12.01" y1="10" y2="10"/><line x1="12" x2="12.01" y1="14" y2="14"/><line x1="16" x2="16.01" y1="10" y2="10"/><line x1="16" x2="16.01" y1="14" y2="14"/><line x1="8" x2="8.01" y1="10" y2="10"/><line x1="8" x2="8.01" y1="14" y2="14"/>
  </svg>
);

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconStar = ({ color = '#eab308' }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const IconClose = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/>
  </svg>
);

const IconEye = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const IconEdit = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const IconSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/>
  </svg>
);

const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/>
  </svg>
);

const IconUser = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const IconMail = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);

const IconPhone = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

// --- DỮ LIỆU MẪU (VĂN NGẮN GỌN - VỪA KHUNG) ---
const mockCompanies = [
  {
    id: 1,
    name: 'FPT Software',
    location: 'Hà Nội',
    activeStudents: 45,
    quota: 12,
    rating: 4.8,
    status: 'Đang hợp tác',
    description: 'FPT Software là công ty xuất khẩu phần mềm hàng đầu Việt Nam, cung cấp môi trường thực tập chuyên nghiệp chuẩn quốc tế.',
    contactPerson: 'Chị Nguyễn Mai Hương',
    email: 'hr@fpt-software.com',
    phone: '024 7300 7300'
  },
  {
    id: 2,
    name: 'Viettel Solutions',
    location: 'Hà Nội',
    activeStudents: 30,
    quota: 8,
    rating: 4.7,
    status: 'Đang hợp tác',
    description: 'Chuyên cung cấp các giải pháp công nghệ thông tin và chuyển đổi số hàng đầu cho doanh nghiệp.',
    contactPerson: 'Anh Trần Tuấn Anh',
    email: 'tuananh@viettel.com.vn',
    phone: '024 6277 8888'
  },
  {
    id: 3,
    name: 'VNPay',
    location: 'Hồ Chí Minh',
    activeStudents: 25,
    quota: 5,
    rating: 4.6,
    status: 'Đang hợp tác',
    description: 'Đơn vị dẫn đầu trong lĩnh vực thanh toán điện tử và hệ sinh thái tài chính số tại Việt Nam.',
    contactPerson: 'Chị Lê Thị Thanh',
    email: 'tuyendung@vnpay.vn',
    phone: '028 3911 1234'
  },
  {
    id: 4,
    name: 'MISA JSC',
    location: 'Đà Nẵng',
    activeStudents: 15,
    quota: 10,
    rating: 4.5,
    status: 'Đang hợp tác',
    description: 'Công ty hàng đầu trong phát triển phần mềm quản trị doanh nghiệp và kế toán tại Việt Nam.',
    contactPerson: 'Anh Phạm Hoàng Nam',
    email: 'hr@misa.com.vn',
    phone: '0236 365 9999'
  },
  {
    id: 5,
    name: 'Shopee Vietnam',
    location: 'Hồ Chí Minh',
    activeStudents: 12,
    quota: 4,
    rating: 4.9,
    status: 'Đang hợp tác',
    description: 'Sàn thương mại điện tử hàng đầu khu vực Đông Nam Á, mang đến môi trường làm việc năng động.',
    contactPerson: 'Chị Đỗ Thu Thảo',
    email: 'careers@shopee.vn',
    phone: '028 7308 1221'
  },
  {
    id: 6,
    name: 'KMS Technology',
    location: 'Hồ Chí Minh',
    activeStudents: 10,
    quota: 3,
    rating: 4.4,
    status: 'Đang hợp tác',
    description: 'Công ty dịch vụ phần mềm chuyên cung cấp giải pháp phát triển sản phẩm công nghệ chất lượng cao.',
    contactPerson: 'Anh Vũ Đình Khoa',
    email: 'recruitment@kms-technology.com',
    phone: '028 3811 9977'
  },
  {
    id: 7,
    name: 'VNG Corporation',
    location: 'Hồ Chí Minh',
    activeStudents: 8,
    quota: 0,
    rating: 4.7,
    status: 'Đang hợp tác',
    description: 'Tập đoàn công nghệ Kỳ lân đầu tiên tại Việt Nam với các sản phẩm nổi tiếng như Zalo và Zing MP3.',
    contactPerson: 'Chị Ngô Phương Anh',
    email: 'careers@vng.com.vn',
    phone: '028 3962 3888'
  },
  {
    id: 8,
    name: 'Sendo Vietnam',
    location: 'Hà Nội',
    activeStudents: 0,
    quota: 0,
    rating: 4.1,
    status: 'Tạm ngừng',
    description: 'Sàn thương mại điện tử mua sắm trực tuyến kết nối người dùng trên toàn quốc.',
    contactPerson: 'Anh Hoàng Minh Trí',
    email: 'hr@sendo.vn',
    phone: '024 7300 1111'
  }
];

export default function CompanyManagement() {
  const [companies] = useState(mockCompanies);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('ALL');
  const [selectedCompany, setSelectedCompany] = useState(mockCompanies[0]);

  const filteredCompanies = useMemo(() => {
    return companies.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchLocation = locationFilter === 'ALL' || item.location === locationFilter;
      return matchSearch && matchLocation;
    });
  }, [companies, searchTerm, locationFilter]);

  return (
    <div style={{ width: '100%', maxWidth: '100%', fontFamily: 'system-ui, -apple-system, sans-serif', boxSizing: 'border-box' }}>
      
      {/* NHÚNG CSS TRỰC TIẾP: ĐỔI THANH SCROLLBAR SANG MÀU TRẮNG NỀN VÀ NÚT KÉO XÁM NHẠT */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #ffffff;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .custom-scrollbar {
          scrollbar-color: #cbd5e1 #ffffff;
          scrollbar-width: thin;
        }
      `}</style>

      {/* 1. HEADER */}
      <Header
        title="Quản lý doanh nghiệp đối tác"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* 2. STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <div style={{ backgroundColor: '#fff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Tổng doanh nghiệp</div>
            <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px' }}>156</div>
            <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: '600' }}>↗ 5.2% <span style={{ color: '#94a3b8', fontWeight: 'normal' }}>so với tháng trước</span></div>
          </div>
          <div style={{ padding: '10px', backgroundColor: '#eff6ff', borderRadius: '10px' }}>
            <IconBuilding />
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Đang hợp tác</div>
            <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px' }}>112</div>
            <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: '600' }}>↗ 4.1% <span style={{ color: '#94a3b8', fontWeight: 'normal' }}>so với tháng trước</span></div>
          </div>
          <div style={{ padding: '10px', backgroundColor: '#dcfce7', borderRadius: '10px' }}>
            <IconCheck />
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Mới đăng ký</div>
            <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px' }}>18</div>
            <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: '600' }}>↗ 1.2% <span style={{ color: '#94a3b8', fontWeight: 'normal' }}>so với tháng trước</span></div>
          </div>
          <div style={{ padding: '10px', backgroundColor: '#fef9c3', borderRadius: '10px' }}>
            <IconStar />
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Tạm ngừng</div>
            <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px' }}>26</div>
            <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: '600' }}>↘ -0.5% <span style={{ color: '#94a3b8', fontWeight: 'normal' }}>so với tháng trước</span></div>
          </div>
          <div style={{ padding: '10px', backgroundColor: '#fee2e2', borderRadius: '10px' }}>
            <IconClose />
          </div>
        </div>
      </div>

      {/* 3. BỐ CỤC 2 CỘT RESPONSIVE */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: '16px', alignItems: 'start' }}>
        
        {/* CỘT TRÁI - BẢNG DOANH NGHIỆP */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>
          
          {/* Thanh tìm kiếm & bộ lọc */}
          <div style={{ backgroundColor: '#fff', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '12px', flex: '1', minWidth: '200px' }}>
              
              <div style={{ position: 'relative', flex: '1' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex' }}>
                  <IconSearch />
                </span>
                <input
                  type="text"
                  placeholder="Tìm kiếm đối tác..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    backgroundColor: '#ffffff',
                    color: '#0f172a',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', color: '#0f172a', backgroundColor: '#ffffff', outline: 'none' }}
              >
                <option value="ALL">Khu vực: Tất cả</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
              </select>
            </div>

            <button
              style={{
                backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '8px 14px',
                borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap'
              }}
            >
              <IconPlus />
              Đăng ký đối tác
            </button>
          </div>

          {/* BẢNG CHỨA THANH CUỘN MÀU TRẮNG DÙNG CLASS custom-scrollbar */}
          <div className="custom-scrollbar" style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: '600', whiteSpace: 'nowrap' }}>
                  <th style={{ padding: '12px 14px' }}>Tên doanh nghiệp</th>
                  <th style={{ padding: '12px 14px' }}>Trụ sở chính</th>
                  <th style={{ padding: '12px 14px' }}>Số SV tiếp nhận</th>
                  <th style={{ padding: '12px 14px' }}>Chỉ tiêu tuyển</th>
                  <th style={{ padding: '12px 14px' }}>Đánh giá</th>
                  <th style={{ padding: '12px 14px' }}>Trạng thái</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.map((item) => {
                  const isSelected = selectedCompany?.id === item.id;
                  const isWorking = item.status === 'Đang hợp tác';

                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedCompany(item)}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        backgroundColor: isSelected ? '#eff6ff' : 'transparent',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s'
                      }}
                    >
                      <td style={{ padding: '12px 14px', fontWeight: '600', color: '#0f172a', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '26px', height: '26px', backgroundColor: '#dbeafe', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <IconBuilding />
                          </div>
                          {item.name}
                        </div>
                      </td>
                      
                      <td style={{ padding: '12px 14px', color: '#64748b', whiteSpace: 'nowrap' }}>{item.location}</td>
                      <td style={{ padding: '12px 14px', fontWeight: '600', color: '#0f172a', whiteSpace: 'nowrap' }}>{item.activeStudents} SV</td>
                      <td style={{ padding: '12px 14px', color: '#64748b', whiteSpace: 'nowrap' }}>{item.quota} chỉ tiêu</td>
                      
                      <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600', color: '#334155' }}>
                          <IconStar />
                          {item.rating}
                        </div>
                      </td>
                      
                      <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                        <span style={{
                          padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600',
                          backgroundColor: isWorking ? '#dcfce7' : '#f1f5f9',
                          color: isWorking ? '#16a34a' : '#64748b'
                        }}>
                          {item.status}
                        </span>
                      </td>

                      <td style={{ padding: '12px 14px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                          <button title="Xem" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><IconEye /></button>
                          <button title="Chỉnh sửa" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><IconEdit /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* CỘT PHẢI - CHI TIẾT DOANH NGHIỆP (KHÔNG BỊ CHE KHUẤT CHỮ) */}
        {selectedCompany && (
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '16px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxSizing: 'border-box',
            width: '100%'
          }}>
            
            {/* Header chi tiết */}
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '52px', height: '52px', backgroundColor: '#eff6ff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                <IconBuilding />
              </div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#0f172a', fontWeight: 'bold' }}>{selectedCompany.name}</h3>
              <span style={{
                padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600',
                backgroundColor: selectedCompany.status === 'Đang hợp tác' ? '#dcfce7' : '#f1f5f9',
                color: selectedCompany.status === 'Đang hợp tác' ? '#16a34a' : '#64748b'
              }}>
                {selectedCompany.status}
              </span>
            </div>

            {/* Chỉ số nhanh */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div style={{ backgroundColor: '#f8fafc', padding: '10px 8px', borderRadius: '8px' }}>
                <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '2px' }}>Đang thực tập</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }}>{selectedCompany.activeStudents} SV</div>
              </div>
              <div style={{ backgroundColor: '#f8fafc', padding: '10px 8px', borderRadius: '8px' }}>
                <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '2px' }}>Chỉ tiêu còn lại</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#2563eb' }}>{selectedCompany.quota} chỗ</div>
              </div>
            </div>

            {/* Đoạn giới thiệu ngắn gọn vừa khung */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '4px' }}>Giới thiệu</div>
              <p style={{
                margin: 0,
                fontSize: '12px',
                color: '#334155',
                lineHeight: '1.5',
                overflowWrap: 'break-word',
                wordBreak: 'break-word'
              }}>
                {selectedCompany.description}
              </p>
            </div>

            {/* Thông tin liên hệ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Thông tin liên hệ</div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                <IconUser />
                <div>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>Người phụ trách</div>
                  <div style={{ fontWeight: '600', color: '#0f172a' }}>{selectedCompany.contactPerson}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                <IconMail />
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>Email</div>
                  <div style={{ fontWeight: '600', color: '#0f172a', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{selectedCompany.email}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                <IconPhone />
                <div>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>Điện thoại</div>
                  <div style={{ fontWeight: '600', color: '#0f172a' }}>{selectedCompany.phone}</div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}