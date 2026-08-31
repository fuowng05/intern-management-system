import React, { useState, useEffect } from 'react';
import Header from '../components/Header'; // Điều chỉnh đường dẫn cho phù hợp dự án của bạn

// --- ICONS CHUYÊN DỤNG ---
const IconExport = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
);
const IconClipboard = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
);
const IconCheckSquare = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
);
const IconHelpCircle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
);

// --- MOCK DATA DỰ PHÒNG ---
const MOCK_STATS = {
  total: "1.254",
  totalGrowth: "14.2%",
  completed: "842",
  completedGrowth: "11.5%",
  pending: "412",
  pendingGrowth: "-3.2%",
  avgScore: "4.21 / 5",
  avgReviewsCount: "842",
};

const MOCK_EVALUATIONS = [
  {
    studentCode: 'SV202401',
    name: 'Nguyễn Văn An',
    company: 'FPT Software',
    mentor: 'Trần Minh Đức',
    mentorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TranMinhDuc',
    score: '9.2 / 10',
    rank: 'Xuất sắc',
    rankType: 'excellent',
    comment: 'Hoàn thành xuất sắc công việc, có tinh thần chủ động cao.',
  },
  {
    studentCode: 'SV202402',
    name: 'Trần Thị Bích Ngọc',
    company: 'Viettel Solutions',
    mentor: 'Phạm Thu Hà',
    mentorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PhamThuHa',
    score: '8.5 / 10',
    rank: 'Tốt',
    rankType: 'good',
    comment: 'Làm việc nhóm tốt, đáp ứng đúng deadline đề ra.',
  },
  {
    studentCode: 'SV202403',
    name: 'Lê Minh Hoàng',
    company: 'VNPay',
    mentor: 'Nguyễn Quang Huy',
    mentorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=QuangHuy',
    score: '7.0 / 10',
    rank: 'Trung bình',
    rankType: 'average',
    comment: 'Cần cải thiện tốc độ xử lý tác vụ cơ bản.',
  },
  {
    studentCode: 'SV202404',
    name: 'Phạm Quang Huy',
    company: 'MISA JSC',
    mentor: 'Đỗ Thùy Linh',
    mentorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ThuyLinh',
    score: '8.8 / 10',
    rank: 'Tốt',
    rankType: 'good',
    comment: 'Kỹ năng lập trình tốt, chủ động đề xuất giải pháp.',
  },
  {
    studentCode: 'SV202405',
    name: 'Đỗ Thùy Linh',
    company: 'Shopee',
    mentor: 'Vũ Đức Duy',
    mentorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DucDuy',
    score: '4.5 / 10',
    rank: 'Cần cải thiện',
    rankType: 'warning',
    comment: 'Vắng mặt nhiều buổi không lý do chính đáng.',
  },
];

const MOCK_CRITERIA = {
  knowledgeScore: 4.25,
  practiceScore: 3.90,
  attitudeScore: 4.60,
};

export default function DanhGia() {
  const [evaluations, setEvaluations] = useState([]);
  const [stats, setStats] = useState(MOCK_STATS);
  const [criteria, setCriteria] = useState(MOCK_CRITERIA);
  
  // States cho Bộ lọc & Tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedRank, setSelectedRank] = useState('all');
  
  const [loading, setLoading] = useState(true);
  const [isUsingMock, setIsUsingMock] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://api.yourdomain.com/v1/evaluations');
        if (!response.ok) throw new Error('Lỗi kết nối API');

        const data = await response.json();
        setEvaluations(data.evaluations || []);
        setStats(data.stats || MOCK_STATS);
        setCriteria(data.criteria || MOCK_CRITERIA);
        setIsUsingMock(false);
      } catch (error) {
        setEvaluations(MOCK_EVALUATIONS);
        setStats(MOCK_STATS);
        setCriteria(MOCK_CRITERIA);
        setIsUsingMock(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // LỌC DỮ LIỆU ĐA ĐIỀU KIỆN (Từ khóa, Doanh nghiệp, Kết quả)
  const filteredEvaluations = evaluations.filter((item) => {
    const term = searchTerm.toLowerCase().trim();
    const matchSearch = !term || (
      item.name.toLowerCase().includes(term) ||
      item.studentCode.toLowerCase().includes(term) ||
      item.company.toLowerCase().includes(term) ||
      item.mentor.toLowerCase().includes(term)
    );

    const matchCompany = selectedCompany === 'all' || item.company === selectedCompany;
    const matchRank = selectedRank === 'all' || item.rankType === selectedRank;

    return matchSearch && matchCompany && matchRank;
  });

  // HÀM XỬ LÝ XUẤT FILE CSV / EXCEL
  const handleExport = () => {
    if (filteredEvaluations.length === 0) {
      alert("Không có dữ liệu phù hợp để xuất báo cáo!");
      return;
    }

    const headers = ["Mã SV", "Họ và tên", "Doanh nghiệp", "Mentor", "Điểm số", "Xếp loại", "Nhận xét"];
    const rows = filteredEvaluations.map(e => [
      `"${e.studentCode}"`,
      `"${e.name}"`,
      `"${e.company}"`,
      `"${e.mentor}"`,
      `"${e.score}"`,
      `"${e.rank}"`,
      `"${e.comment.replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Bao_Cao_Danh_Gia_Thuc_Tap_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRankBadgeStyle = (type) => {
    switch (type) {
      case 'excellent':
        return { backgroundColor: '#dcfce7', color: '#15803d' };
      case 'good':
        return { backgroundColor: '#e0f2fe', color: '#0369a1' };
      case 'average':
        return { backgroundColor: '#fef3c7', color: '#b45309' };
      case 'warning':
        return { backgroundColor: '#fee2e2', color: '#b91c1c' };
      default:
        return { backgroundColor: '#f1f5f9', color: '#475569' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* STYLE THANH CUỘN MÀU TRẮNG */}
      <style>{`
        .white-scrollbar::-webkit-scrollbar {
          height: 8px;
          width: 8px;
        }
        .white-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .white-scrollbar::-webkit-scrollbar-thumb {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
        }
        .white-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #f8fafc;
          border-color: #94a3b8;
        }
      `}</style>

      {/* HEADER */}
      <Header
        title="Quản lý đánh giá thực tập"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Tìm theo Mã SV, tên, công ty..."
      />

      {isUsingMock && (
        <div style={{
          padding: '10px 16px',
          backgroundColor: '#fef3c7',
          color: '#d97706',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: '500',
          border: '1px solid #fde68a',
          marginTop: '-10px',
        }}>
          ⚡ <strong>Lưu ý:</strong> Đang hiển thị dữ liệu mẫu do chưa kết nối được API Backend.
        </div>
      )}

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', backgroundColor: '#fff', borderRadius: '12px' }}>
          Đang tải dữ liệu...
        </div>
      ) : (
        <>
          {/* 1. THỐNG KÊ */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '18px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>Tổng đánh giá</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px' }}>{stats.total}</div>
                <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: '600' }}>↗ {stats.totalGrowth}</div>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconClipboard />
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '18px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>Đã hoàn thành</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px' }}>{stats.completed}</div>
                <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: '600' }}>↗ {stats.completedGrowth}</div>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconCheckSquare />
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '18px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>Chưa hoàn thành</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px' }}>{stats.pending}</div>
                <div style={{ fontSize: '12px', color: '#ef4444', fontWeight: '600' }}>↘ {stats.pendingGrowth}</div>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconHelpCircle />
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '18px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '13px', color: '#64748b' }}>Điểm trung bình</div>
                <div style={{ color: '#f59e0b', fontSize: '13px' }}>★★★★<span style={{ color: '#cbd5e1' }}>★</span></div>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', margin: '4px 0' }}>{stats.avgScore}</div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>Dựa trên {stats.avgReviewsCount} đánh giá</div>
            </div>
          </div>

          {/* 2. KHUNG BỘ LỌC VÀ NÚT XUẤT BÁO CÁO (GIỐNG HỆT ÁNH 2) */}
          <div style={{ 
            backgroundColor: '#ffffff', 
            padding: '12px 16px', 
            borderRadius: '12px', 
            border: '1px solid #e2e8f0', 
            display: 'flex', 
            justify: 'space-between', 
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {/* Select 1: Đợt thực tập */}
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                style={{ 
                  padding: '8px 14px', 
                  borderRadius: '8px', 
                  border: '1px solid #e2e8f0', 
                  backgroundColor: '#ffffff', 
                  color: '#334155', 
                  fontSize: '13px', 
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="all">Tất cả đợt thực tập</option>
                <option value="dot1">Đợt 1 - 2026</option>
                <option value="dot2">Đợt 2 - 2026</option>
              </select>

              {/* Select 2: Doanh nghiệp */}
              <select 
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                style={{ 
                  padding: '8px 14px', 
                  borderRadius: '8px', 
                  border: '1px solid #e2e8f0', 
                  backgroundColor: '#ffffff', 
                  color: '#334155', 
                  fontSize: '13px', 
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="all">Tất cả doanh nghiệp</option>
                <option value="FPT Software">FPT Software</option>
                <option value="Viettel Solutions">Viettel Solutions</option>
                <option value="VNPay">VNPay</option>
                <option value="MISA JSC">MISA JSC</option>
                <option value="Shopee">Shopee</option>
              </select>

              {/* Select 3: Kết quả */}
              <select 
                value={selectedRank}
                onChange={(e) => setSelectedRank(e.target.value)}
                style={{ 
                  padding: '8px 14px', 
                  borderRadius: '8px', 
                  border: '1px solid #e2e8f0', 
                  backgroundColor: '#ffffff', 
                  color: '#334155', 
                  fontSize: '13px', 
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="all">Kết quả: Tất cả</option>
                <option value="excellent">Xuất sắc</option>
                <option value="good">Tốt</option>
                <option value="average">Trung bình</option>
                <option value="warning">Cần cải thiện</option>
              </select>
            </div>

            {/* Nút Xuất Báo Cáo có sự kiện onClick */}
            <button 
              onClick={handleExport}
              style={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #2563eb', 
                color: '#2563eb', 
                padding: '8px 16px', 
                borderRadius: '8px', 
                fontSize: '13px', 
                fontWeight: '600', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
            >
              <IconExport /> Xuất báo cáo
            </button>
          </div>

          {/* 3. BẢNG DỮ LIỆU */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div className="white-scrollbar" style={{ overflowX: 'auto', width: '100%' }}>
              <table style={{ width: '100%', minWidth: '950px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: '600' }}>
                    <th style={{ padding: '14px 20px', whiteSpace: 'nowrap' }}>Mã sinh viên</th>
                    <th style={{ padding: '14px 20px', whiteSpace: 'nowrap' }}>Họ và tên</th>
                    <th style={{ padding: '14px 20px', whiteSpace: 'nowrap' }}>Doanh nghiệp</th>
                    <th style={{ padding: '14px 20px', whiteSpace: 'nowrap' }}>Mentor đánh giá</th>
                    <th style={{ padding: '14px 20px', whiteSpace: 'nowrap' }}>Điểm số</th>
                    <th style={{ padding: '14px 20px', whiteSpace: 'nowrap' }}>Kết quả xếp loại</th>
                    <th style={{ padding: '14px 20px', whiteSpace: 'nowrap' }}>Nhận xét chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvaluations.length > 0 ? (
                    filteredEvaluations.map((row, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 20px', color: '#2563eb', fontWeight: '600', whiteSpace: 'nowrap' }}>{row.studentCode}</td>
                        <td style={{ padding: '14px 20px', fontWeight: 'bold', color: '#0f172a', whiteSpace: 'nowrap' }}>{row.name}</td>
                        <td style={{ padding: '14px 20px', color: '#475569', whiteSpace: 'nowrap' }}>{row.company}</td>
                        <td style={{ padding: '14px 20px', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <img src={row.mentorAvatar} alt={row.mentor} style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: '#e2e8f0' }} />
                            <span style={{ color: '#0f172a', fontWeight: '500' }}>{row.mentor}</span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 20px', fontWeight: 'bold', color: '#0f172a', whiteSpace: 'nowrap' }}>{row.score}</td>
                        <td style={{ padding: '14px 20px', whiteSpace: 'nowrap' }}>
                          <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', display: 'inline-block', ...getRankBadgeStyle(row.rankType) }}>
                            {row.rank}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px', color: '#64748b', minWidth: '220px' }}>
                          {row.comment}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>
                        Không tìm thấy dữ liệu phù hợp với bộ lọc hiện tại.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PHÂN TRANG */}
            <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', fontSize: '13px', color: '#64748b' }}>
              <div>Hiển thị {filteredEvaluations.length} trong tổng số {evaluations.length} kết quả</div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <button style={{ width: '28px', height: '28px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#fff', cursor: 'pointer' }}>&lt;</button>
                <button style={{ width: '28px', height: '28px', border: 'none', borderRadius: '6px', backgroundColor: '#2563eb', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>1</button>
                <button style={{ width: '28px', height: '28px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#fff', cursor: 'pointer' }}>2</button>
                <button style={{ width: '28px', height: '28px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#fff', cursor: 'pointer' }}>&gt;</button>
              </div>
            </div>
          </div>

          {/* 4. BIỂU ĐỒ BÊN DƯỚI */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }}>Phân bổ kết quả đánh giá</h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                <div style={{ position: 'relative', width: '130px', height: '130px' }}>
                  <svg width="130" height="130" viewBox="0 0 42 42">
                    <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#10b981" strokeWidth="5" strokeDasharray="50 50" strokeDashoffset="25" />
                    <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#3b82f6" strokeWidth="5" strokeDasharray="33.3 66.7" strokeDashoffset="75" />
                    <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#f59e0b" strokeWidth="5" strokeDasharray="16.7 83.3" strokeDashoffset="41.7" />
                  </svg>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }}></span><span style={{ color: '#64748b' }}>Xuất sắc (50%)</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></span><span style={{ color: '#64748b' }}>Khá / Tốt (33.3%)</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></span><span style={{ color: '#64748b' }}>Trung bình (16.7%)</span></div>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }}>Điểm trung bình theo tiêu chí</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                    <span style={{ color: '#334155', fontWeight: '600' }}>Kiến thức chuyên môn</span>
                    <span style={{ color: '#0f172a', fontWeight: 'bold' }}>{criteria.knowledgeScore} / 5</span>
                  </div>
                  <div style={{ height: '8px', width: '100%', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(criteria.knowledgeScore / 5) * 100}%`, backgroundColor: '#2563eb', borderRadius: '4px' }}></div>
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                    <span style={{ color: '#334155', fontWeight: '600' }}>Kỹ năng thực hành</span>
                    <span style={{ color: '#0f172a', fontWeight: 'bold' }}>{criteria.practiceScore} / 5</span>
                  </div>
                  <div style={{ height: '8px', width: '100%', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(criteria.practiceScore / 5) * 100}%`, backgroundColor: '#10b981', borderRadius: '4px' }}></div>
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                    <span style={{ color: '#334155', fontWeight: '600' }}>Ý thức & Thái độ</span>
                    <span style={{ color: '#0f172a', fontWeight: 'bold' }}>{criteria.attitudeScore} / 5</span>
                  </div>
                  <div style={{ height: '8px', width: '100%', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(criteria.attitudeScore / 5) * 100}%`, backgroundColor: '#8b5cf6', borderRadius: '4px' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}