import React, { useState } from 'react';

// --- ICONS CHO MÀN HÌNH TIÊU CHÍ ---
const IconSearch = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const IconBell = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>;
const IconGrip = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>;
const IconEdit = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>;
const IconTrash = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
const IconList = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
const IconPulse = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const IconRibbon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>;
const IconCopy = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;

// DỮ LIỆU BAN ĐẦU
const INITIAL_CRITERIA = [
  { id: 1, name: 'Ý thức & Thái độ', weight: '20%', maxScore: 20, desc: 'Chuyên cần, đúng giờ, tuân thủ nội quy...', status: 'Hoạt động' },
  { id: 2, name: 'Kỹ năng giao tiếp', weight: '15%', maxScore: 15, desc: 'Khả năng trao đổi, truyền đạt thông tin...', status: 'Hoạt động' },
  { id: 3, name: 'Kiến thức chuyên môn', weight: '30%', maxScore: 30, desc: 'Nắm vững lý thuyết cơ bản và chuyên sâu...', status: 'Hoạt động' },
  { id: 4, name: 'Kỹ năng thực hành', weight: '25%', maxScore: 25, desc: 'Giải quyết bài toán thực tế hiệu quả...', status: 'Hoạt động' },
  { id: 5, name: 'Báo cáo thực tập', weight: '10%', maxScore: 10, desc: 'Trình bày báo cáo mạch lạc, rõ ràng...', status: 'Hoạt động' },
];

export default function TieuChi() {
  const [criteriaList, setCriteriaList] = useState(INITIAL_CRITERIA);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ name: '', weight: '', maxScore: '', desc: '' });

  // Style dùng chung cho ô Input để đảm bảo Nền Trắng - Chữ Đen
  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    fontSize: '13px',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#ffffff',
    color: '#0f172a'
  };

  // Xử lý thêm tiêu chí
  const handleAddCriteria = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.weight || !formData.maxScore) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    const newItem = {
      id: Date.now(),
      name: formData.name,
      weight: formData.weight.includes('%') ? formData.weight : `${formData.weight}%`,
      maxScore: Number(formData.maxScore),
      desc: formData.desc || 'Chưa có mô tả...',
      status: 'Hoạt động'
    };

    setCriteriaList([...criteriaList, newItem]);
    setFormData({ name: '', weight: '', maxScore: '', desc: '' });
  };

  // Xử lý xóa tiêu chí
  const handleDelete = (id) => {
    setCriteriaList(criteriaList.filter(item => item.id !== id));
  };

  // Lọc dữ liệu theo ô tìm kiếm
  const filteredCriteria = criteriaList.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalMaxScore = criteriaList.reduce((acc, curr) => acc + Number(curr.maxScore), 0);

  return (
    <div style={{ width: '100%' }}>
      {/* 1. HEADER CỦA TRANG */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>Quản lý tiêu chí đánh giá</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', left: '12px' }}><IconSearch /></span>
            <input
              type="text"
              placeholder="Tìm kiếm thông tin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ ...inputStyle, paddingLeft: '36px', borderRadius: '20px', width: '240px' }}
            />
          </div>
          <button style={{ width: '38px', height: '38px', borderRadius: '50%', border: '1px solid #e2e8f0', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <IconBell />
          </button>
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Profile" style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }} />
        </div>
      </div>

      {/* 2. KHỐI THỐNG KÊ (STAT CARDS) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#fff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px' }}>Tổng tiêu chí</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>{criteriaList.length}</div>
            <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: '600' }}>↗ Hoạt động 100%</div>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconList />
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px' }}>Đang sử dụng</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>{criteriaList.length}</div>
            <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: '600' }}>↗ Cập nhật gần đây</div>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconPulse />
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px' }}>Tổng điểm tối đa</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>{totalMaxScore}</div>
            <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: '600' }}>↗ Thang điểm chuẩn</div>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconRibbon />
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px' }}>Mẫu đánh giá</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>3</div>
            <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: '600' }}>↗ Phiên bản Q3-2024</div>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconCopy />
          </div>
        </div>
      </div>

      {/* 3. BẢNG TIÊU CHÍ VÀ FORM BÊN PHẢI */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', alignItems: 'start' }}>
        
        {/* Bảng danh sách */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Hệ thống tiêu chí đánh giá</h2>
            <span style={{ backgroundColor: '#dcfce7', color: '#16a34a', fontSize: '11px', fontWeight: '600', padding: '4px 10px', borderRadius: '12px' }}>
              Phiên bản Q3-2024 (Đang áp dụng)
            </span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ color: '#64748b', fontSize: '12px', borderBottom: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
                <th style={{ width: '32px', padding: '10px 8px' }}></th>
                <th style={{ padding: '10px 8px', fontWeight: '600' }}>Tên tiêu chí</th>
                <th style={{ padding: '10px 8px', fontWeight: '600' }}>Trọng số</th>
                <th style={{ padding: '10px 8px', fontWeight: '600' }}>Điểm tối đa</th>
                <th style={{ padding: '10px 8px', fontWeight: '600' }}>Mô tả</th>
                <th style={{ padding: '10px 8px', fontWeight: '600' }}>Trạng thái</th>
                <th style={{ padding: '10px 8px', fontWeight: '600', textAlign: 'center' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredCriteria.length > 0 ? (
                filteredCriteria.map((item, index) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '12px 8px', cursor: 'grab' }}><IconGrip /></td>
                    <td style={{ padding: '12px 8px', fontWeight: '700', color: '#0f172a' }}>{index + 1}. {item.name}</td>
                    <td style={{ padding: '12px 8px', color: '#475569' }}>{item.weight}</td>
                    <td style={{ padding: '12px 8px', color: '#475569' }}>{item.maxScore}</td>
                    <td style={{ padding: '12px 8px', color: '#64748b', fontSize: '12px' }}>{item.desc}</td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{ backgroundColor: '#dcfce7', color: '#16a34a', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600' }}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '2px' }}><IconEdit /></button>
                        <button onClick={() => handleDelete(item.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '2px' }}><IconTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
                    Không tìm thấy tiêu chí phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Panel Form Thêm tiêu chí mới */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ backgroundColor: '#eff6ff', borderRadius: '12px', padding: '16px', border: '1px solid #dbeafe' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#1d4ed8', marginBottom: '6px' }}>Công thức tính điểm</div>
            <div style={{ fontSize: '11px', color: '#3b82f6', lineHeight: '1.4' }}>
              Điểm Tổng kết = <strong style={{ color: '#1d4ed8' }}>Σ (Điểm tiêu chí × Trọng số)</strong>
            </div>
          </div>

          <form onSubmit={handleAddCriteria} style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>Thêm tiêu chí mới</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Tên tiêu chí *</label>
                <input
                  type="text"
                  placeholder="Nhập tên tiêu chí..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Trọng số (%) *</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 20%"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Điểm tối đa *</label>
                  <input
                    type="number"
                    placeholder="Ví dụ: 10"
                    value={formData.maxScore}
                    onChange={(e) => setFormData({ ...formData, maxScore: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Mô tả tiêu chí</label>
                <textarea
                  rows={3}
                  placeholder="Nhập mô tả cụ thể..."
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  style={{ ...inputStyle, resize: 'none' }}
                />
              </div>

              <button
                type="submit"
                style={{ width: '100%', backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', marginTop: '4px' }}
              >
                Xác nhận thêm
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}