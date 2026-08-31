// Dữ liệu cho Màn hình 1: Tổng quan (Overview)
export const mockOverviewData = {
  stats: [
    { title: 'Sinh viên', value: '1.254', change: '+12.5%', isUp: true },
    { title: 'Hồ sơ ứng tuyển', value: '842', change: '+8.3%', isUp: true },
    { title: 'Doanh nghiệp', value: '156', change: '+5.2%', isUp: true },
    { title: 'Đánh giá hoàn thành', value: '76.8%', change: '-4.1%', isUp: false },
  ],
  applications: [
    { id: 'HS000842', student: 'Nguyễn Văn An', period: 'K2024-01', company: 'FPT Software', status: 'Submitted', date: '10/05/2024 14:30' },
    { id: 'HS000841', student: 'Trần Thị Bích Ngọc', period: 'K2024-01', company: 'Viettel Solutions', status: 'Draft', date: '10/05/2024 09:15' },
    { id: 'HS000840', student: 'Lê Minh Hoàng', period: 'K2024-01', company: 'VNPay', status: 'Approved', date: '09/05/2024 16:45' },
    { id: 'HS000839', student: 'Phạm Quang Huy', period: 'K2024-01', company: 'MISA JSC', status: 'Submitted', date: '08/05/2024 11:20' },
    { id: 'HS000838', student: 'Đỗ Thùy Linh', period: 'K2024-02', company: 'Shopee', status: 'Draft', date: '08/05/2024 10:05' },
    { id: 'HS000837', student: 'Vũ Đức Duy', period: 'K2024-02', company: 'TopCV', status: 'Rejected', date: '07/05/2024 17:55' },
    { id: 'HS000836', student: 'Bùi Lan Anh', period: 'K2024-01', company: 'FPT Software', status: 'Approved', date: '07/05/2024 09:40' },
    { id: 'HS000835', student: 'Nguyễn Quốc Bảo', period: 'K2024-01', company: 'KMS Technology', status: 'Submitted', date: '06/05/2024 13:22' },
  ],
  activePeriods: [
    { code: 'K2024-01', title: 'Đợt thực tập Hè 2024', time: '01/06/2024 - 30/08/2024' },
    { code: 'K2024-02', title: 'Đợt thực tập Đông 2024', time: '01/07/2024 - 30/09/2024' },
  ],
  recentMentors: [
    { mentor: 'Trần Minh Đức', studentCode: 'HS000842', student: 'Nguyễn Văn An', company: 'FPT Software' },
    { mentor: 'Phạm Thu Hà', studentCode: 'HS000840', student: 'Lê Minh Hoàng', company: 'VNPay' },
    { mentor: 'Nguyễn Quang Huy', studentCode: 'HS000839', student: 'Phạm Quang Huy', company: 'MISA JSC' },
  ],
  featuredStudent: {
    name: 'Nguyễn Văn An',
    code: 'HS000842',
    class: 'CT60A',
    major: 'Công nghệ thông tin',
    phone: '0912 345 678',
    status: 'Đang hoạt động',
  }
};

// Dữ liệu cho Màn hình 2: Quản lý sinh viên (StudentManagement)
export const mockStudentStats = [
  { title: 'Tổng sinh viên', value: '1.254', change: '+12.5%', isUp: true, icon: '👥' },
  { title: 'Hồ sơ đã tạo', value: '1.102', change: '+9.2%', isUp: true, icon: '📄' },
  { title: 'Đang hoạt động', value: '842', change: '+8.1%', isUp: true, icon: '⚡' },
  { title: 'Đã xác minh', value: '968', change: '+10.4%', isUp: true, icon: '☑️' },
];

export const mockStudentList = [
  { id: 'HS000842', code: 'CT60A_001', name: 'Nguyễn Văn An', class: 'CT60A', major: 'Công nghệ thông tin', phone: '0912 345 678', status: 'Đang hoạt động', createdAt: '10/05/2024', email: 'an.nv@internhub.edu.vn' },
  { id: 'HS000841', code: 'QT50B_015', name: 'Trần Thị Bích Ngọc', class: 'QT50B', major: 'Quản trị kinh doanh', phone: '0987 654 321', status: 'Đang hoạt động', createdAt: '10/05/2024', email: 'ngoc.ttb@internhub.edu.vn' },
  { id: 'HS000840', code: 'CT60A_012', name: 'Lê Minh Hoàng', class: 'CT60A', major: 'Công nghệ thông tin', phone: '0378 912 345', status: 'Chờ xác minh', createdAt: '09/05/2024', email: 'hoang.lm@internhub.edu.vn' },
  { id: 'HS000839', code: 'TC55C_008', name: 'Phạm Quang Huy', class: 'TC55C', major: 'Tài chính ngân hàng', phone: '0905 123 456', status: 'Đang hoạt động', createdAt: '08/05/2024', email: 'huy.pq@internhub.edu.vn' },
];