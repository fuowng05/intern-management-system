import React, { useState, useMemo, useEffect } from 'react';
import Header from '../components/Header';
import { useApiData } from '../hooks/useApiData';
import { mockStudentStats, mockStudentList } from '../data/mockData';

export default function StudentManagement() {
  const { data: statsData } = useApiData('/students/stats', mockStudentStats);
  const { data: studentsData } = useApiData('/students', mockStudentList);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [majorFilter, setMajorFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const defaultStats = [
    { title: 'Tổng sinh viên', value: '1.254', change: '12.5%', isUp: true },
    { title: 'Hồ sơ đã tạo', value: '1.102', change: '9.2%', isUp: true },
    { title: 'Đang hoạt động', value: '842', change: '8.1%', isUp: true },
    { title: 'Đã xác minh', value: '968', change: '10.4%', isUp: true },
  ];

  const statsToRender = statsData && statsData.length > 0 ? statsData : defaultStats;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Đang hoạt động':
        return { bg: '#dcfce7', color: '#16a34a', label: 'Đang hoạt động' };
      case 'Chờ xác minh':
        return { bg: '#fef9c3', color: '#ca8a04', label: 'Chờ xác minh' };
      case 'Tạm dừng':
        return { bg: '#f1f5f9', color: '#64748b', label: 'Tạm dừng' };
      default:
        return { bg: '#f1f5f9', color: '#64748b', label: status || 'Chờ xác minh' };
    }
  };

  const handleFilterChange = (setter, value) => {
    setter(value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setClassFilter('ALL');
    setMajorFilter('ALL');
    setStatusFilter('ALL');
    setCurrentPage(1);
  };

  const filteredStudents = useMemo(() => {
    if (!studentsData) return [];
    return studentsData.filter((item) => {
      const matchesSearch =
        (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.code && item.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.id && item.id.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesClass = classFilter === 'ALL' || item.class === classFilter;
      const matchesMajor = majorFilter === 'ALL' || item.major === majorFilter;
      const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;

      return matchesSearch && matchesClass && matchesMajor && matchesStatus;
    });
  }, [studentsData, searchTerm, classFilter, majorFilter, statusFilter]);

  useEffect(() => {
    if (filteredStudents.length > 0) {
      const exists = filteredStudents.some((s) => s.id === selectedStudent?.id);
      if (!exists) {
        setSelectedStudent(filteredStudents[0]);
      }
    } else {
      setSelectedStudent(null);
    }
  }, [filteredStudents, selectedStudent]);

  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPage, pageSize]);

  const handleExportExcel = () => {
    const headers = ['Mã hồ sơ', 'Mã sinh viên', 'Họ và tên', 'Lớp', 'Ngành', 'Số điện thoại', 'Trạng thái', 'Ngày tạo'];

    const rows = filteredStudents.map((s) => [
      `"${s.id || ''}"`,
      `"${s.code || ''}"`,
      `"${s.name || ''}"`,
      `"${s.class || ''}"`,
      `"${s.major || ''}"`,
      `"${s.phone || ''}"`,
      `"${s.status || ''}"`,
      `"${s.createdAt || '05/05/2026'}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Danh_Sach_Sinh_Vien_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ width: '100%', boxSizing: 'border-box', colorScheme: 'light' }}>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>

      {/* HEADER COMPONENT (Đã dùng Header dùng chung) */}
      <Header
        title="Quản lý sinh viên"
        searchTerm={searchTerm}
        onSearchChange={(val) => handleFilterChange(setSearchTerm, val)}
        placeholder="Tìm kiếm MSSV, tên, lớp..."
      />

      {/* STATS CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
        {statsToRender.map((s, i) => (
          <div key={i} style={{ backgroundColor: '#fff', padding: '16px 18px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>{s.title}</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px' }}>{s.value}</div>
            <div style={{ fontSize: '11px', color: s.isUp !== false ? '#16a34a' : '#ef4444', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>↗ {s.change || '10%'}</span>
              <span style={{ color: '#94a3b8', fontWeight: 'normal' }}>so với tháng trước</span>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '20px' }}>
        
        {/* LEFT COLUMN - TABLE */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '18px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)', minWidth: 0 }}>
          
          {/* TOOLBAR */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap' }}>
            <select
              value={classFilter}
              onChange={(e) => handleFilterChange(setClassFilter, e.target.value)}
              style={{ padding: '7px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px', color: '#0f172a', cursor: 'pointer', backgroundColor: '#ffffff' }}
            >
              <option value="ALL">Lớp: Tất cả</option>
              <option value="CT60A">CT60A</option>
              <option value="QT50B">QT50B</option>
              <option value="NN60A">NN60A</option>
              <option value="MK60A">MK60A</option>
              <option value="KT60A">KT60A</option>
            </select>

            <select
              value={majorFilter}
              onChange={(e) => handleFilterChange(setMajorFilter, e.target.value)}
              style={{ padding: '7px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px', color: '#0f172a', cursor: 'pointer', backgroundColor: '#ffffff' }}
            >
              <option value="ALL">Ngành: Tất cả</option>
              <option value="Công nghệ thông tin">Công nghệ thông tin</option>
              <option value="Quản trị kinh doanh">Quản trị kinh doanh</option>
              <option value="Ngôn ngữ Anh">Ngôn ngữ Anh</option>
              <option value="Marketing">Marketing</option>
              <option value="Kế toán">Kế toán</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => handleFilterChange(setStatusFilter, e.target.value)}
              style={{ padding: '7px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px', color: '#0f172a', cursor: 'pointer', backgroundColor: '#ffffff' }}
            >
              <option value="ALL">Trạng thái: Tất cả</option>
              <option value="Đang hoạt động">Đang hoạt động</option>
              <option value="Chờ xác minh">Chờ xác minh</option>
              <option value="Tạm dừng">Tạm dừng</option>
            </select>

            <button
              onClick={handleResetFilters}
              style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', fontSize: '12px', color: '#334155', cursor: 'pointer', fontWeight: '500' }}
            >
              Đặt lại
            </button>

            <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
              <button
                onClick={() => alert("Mở modal thêm sinh viên mới!")}
                style={{ padding: '7px 14px', borderRadius: '8px', border: 'none', backgroundColor: '#2563eb', color: '#ffffff', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}
              >
                + Thêm sinh viên
              </button>

              <button
                onClick={handleExportExcel}
                style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid #22c55e', backgroundColor: '#ffffff', color: '#16a34a', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}
              >
                📄 Xuất Excel
              </button>
            </div>
          </div>

          {/* DATA TABLE */}
          <div className="custom-scrollbar" style={{ overflowX: 'auto', paddingBottom: '6px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: '600' }}>
                  <th style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>Mã hồ sơ</th>
                  <th style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>Mã sinh viên</th>
                  <th style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>Họ và tên</th>
                  <th style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>Lớp</th>
                  <th style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>Ngành</th>
                  <th style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>Số điện thoại</th>
                  <th style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>Trạng thái</th>
                  <th style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>Ngày tạo</th>
                  <th style={{ padding: '10px 12px', whiteSpace: 'nowrap', textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStudents.length > 0 ? (
                  paginatedStudents.map((item) => {
                    const badge = getStatusBadge(item.status);
                    const isSelected = selectedStudent?.id === item.id;

                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedStudent(item)}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          backgroundColor: isSelected ? '#eff6ff' : 'transparent',
                          cursor: 'pointer',
                          transition: 'background 0.15s'
                        }}
                      >
                        <td style={{ padding: '12px', color: '#2563eb', fontWeight: '600', whiteSpace: 'nowrap' }}>{item.id}</td>
                        <td style={{ padding: '12px', color: '#475569', whiteSpace: 'nowrap' }}>{item.code}</td>
                        <td style={{ padding: '12px', fontWeight: 'bold', color: '#0f172a', whiteSpace: 'nowrap' }}>{item.name}</td>
                        <td style={{ padding: '12px', color: '#64748b', whiteSpace: 'nowrap' }}>{item.class}</td>
                        <td style={{ padding: '12px', color: '#475569', whiteSpace: 'nowrap' }}>{item.major}</td>
                        <td style={{ padding: '12px', color: '#64748b', whiteSpace: 'nowrap' }}>{item.phone || '0912 345 678'}</td>
                        <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>
                          <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', backgroundColor: badge.bg, color: badge.color }}>
                            {badge.label}
                          </span>
                        </td>
                        <td style={{ padding: '12px', color: '#64748b', whiteSpace: 'nowrap' }}>{item.createdAt || '05/05/2026'}</td>
                        <td style={{ padding: '12px', whiteSpace: 'nowrap', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            <button title="Xem" onClick={() => setSelectedStudent(item)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#2563eb', fontWeight: '500' }}>Xem</button>
                            <button title="Sửa" onClick={() => alert(`Chỉnh sửa ${item.name}`)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#d97706', fontWeight: '500' }}>Sửa</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
                      Không tìm thấy sinh viên nào phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#64748b', flexWrap: 'wrap', gap: '10px' }}>
            <span>
              Hiển thị {filteredStudents.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} - {Math.min(currentPage * pageSize, filteredStudents.length)} trong tổng số {filteredStudents.length} kết quả
            </span>
            
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                style={{ padding: '4px 8px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', color: currentPage === 1 ? '#cbd5e1' : '#334155' }}
              >
                ‹ Trước
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
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                style={{ padding: '4px 8px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#fff', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', color: currentPage === totalPages ? '#cbd5e1' : '#334155' }}
              >
                Sau ›
              </button>

              <select 
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                style={{ marginLeft: '10px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', color: '#334155', backgroundColor: '#fff', cursor: 'pointer' }}
              >
                <option value={8}>8 / trang</option>
                <option value={15}>15 / trang</option>
                <option value={30}>30 / trang</option>
              </select>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN - DETAILS */}
        {selectedStudent ? (
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)', height: 'fit-content' }}>
            <h4 style={{ margin: '0 0 18px 0', fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }}>Thông tin sinh viên</h4>
            
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedStudent.code || selectedStudent.name}`}
                alt={selectedStudent.name}
                style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', marginBottom: '10px', objectFit: 'cover' }}
              />
              <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 'bold', color: '#0f172a' }}>{selectedStudent.name}</h3>
              
              <span style={{
                padding: '3px 12px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: '600',
                backgroundColor: getStatusBadge(selectedStudent.status).bg,
                color: getStatusBadge(selectedStudent.status).color
              }}>
                {getStatusBadge(selectedStudent.status).label}
              </span>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '16px 0' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '12px', color: '#475569' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Mã sinh viên (MSSV)</div>
                <div style={{ fontWeight: 'bold', color: '#0f172a', marginTop: '2px' }}>{selectedStudent.code}</div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Lớp sinh hoạt</div>
                <div style={{ fontWeight: 'bold', color: '#0f172a', marginTop: '2px' }}>{selectedStudent.class}</div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Chuyên ngành</div>
                <div style={{ fontWeight: 'bold', color: '#0f172a', marginTop: '2px' }}>{selectedStudent.major}</div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Địa chỉ Email</div>
                <div style={{ fontWeight: 'bold', color: '#0f172a', marginTop: '2px', wordBreak: 'break-all' }}>
                  {selectedStudent.email || `${selectedStudent.code ? selectedStudent.code.toLowerCase() : 'sv'}@internhub.edu.vn`}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Số điện thoại</div>
                <div style={{ fontWeight: 'bold', color: '#0f172a', marginTop: '2px' }}>{selectedStudent.phone || '0912 345 678'}</div>
              </div>
            </div>

            <button
              onClick={() => alert(`Chỉnh sửa thông tin cho ${selectedStudent.name}`)}
              style={{
                marginTop: '24px',
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                fontWeight: 'bold',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Chỉnh sửa thông tin
            </button>
          </div>
        ) : (
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', textAlign: 'center', color: '#94a3b8' }}>
            Vui lòng chọn 1 sinh viên trong bảng để xem chi tiết.
          </div>
        )}

      </div>
    </div>
  );
}