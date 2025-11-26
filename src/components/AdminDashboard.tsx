import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { 
  Users, FileText, List, LogOut, Download, Plus, Clock, 
  AlertCircle, CheckCircle, Star, MessageSquare, Menu, ChevronLeft, 
  Search, Calendar, Activity, ClipboardList, Home, Phone, X, Check, Eye, User, Briefcase
} from 'lucide-react';

// --- Global Data Setup (Giữ nguyên data demo) ---

const useInitialData = () => {
    const initialFeedbacks = [
        { id: 'fb-1', title: 'Rất hài lòng', date: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString('vi-VN'), rating: 5, comments: 'Dịch vụ tốt, nhân viên thân thiện. Bác sĩ tư vấn rất kỹ lưỡng và chi tiết.', patientId: 'A-12', department: 'Khoa Tim mạch', responded: true },
        { id: 'fb-2', title: 'Hài lòng', date: new Date(Date.now() - 5 * 60 * 60 * 1000).toLocaleString('vi-VN'), rating: 4, comments: 'Bác sĩ tư vấn rõ ràng. Cần cải thiện thời gian chờ đợi.', patientId: 'B-05', department: 'Khoa Nội', responded: false },
        { id: 'fb-3', title: 'Chờ lâu', date: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString('vi-VN'), rating: 3, comments: 'Thời gian chờ hơi lâu nhưng ổn. Mong bệnh viện cải thiện.', patientId: 'C-08', department: 'Khoa Ngoại', responded: false },
        { id: 'fb-4', title: 'Xuất sắc', date: new Date(Date.now() - 3 * 60 * 60 * 1000).toLocaleString('vi-VN'), rating: 5, comments: 'Cơ sở vật chất hiện đại, bác sĩ giàu kinh nghiệm.', patientId: 'A-15', department: 'Khoa Da liễu', responded: true },
        { id: 'fb-5', title: 'Hài lòng', date: new Date(Date.now() - 1 * 60 * 60 * 1000).toLocaleString('vi-VN'), rating: 4, comments: 'Y tá rất nhiệt tình, nhưng quá trình làm thủ tục hơi rườm rà.', patientId: 'D-01', department: 'Khoa Nhi', responded: false },
        { id: 'fb-6', title: 'Tạm ổn', date: new Date(Date.now() - 48 * 60 * 60 * 1000).toLocaleString('vi-VN'), rating: 2, comments: 'Không có gì đặc biệt, mọi thứ đều ở mức trung bình.', patientId: 'E-03', department: 'Khoa Răng Hàm Mặt', responded: true },
    ];

    const initialLabTests = {
        'A-12': [
            { id: 'A-12-t1', name: 'Xét nghiệm máu cơ bản', notes: 'CBC', status: 'pending' },
            { id: 'A-12-t2', name: 'Sinh hóa máu', notes: 'Lipid panel', status: 'completed' },
        ],
        'B-05': [
            { id: 'B-05-t1', name: 'Nước tiểu', notes: 'Urinalysis', status: 'pending' },
            { id: 'B-05-t2', name: 'Đường huyết', notes: 'Glucose', status: 'pending' },
        ],
        'C-21': [
            { id: 'C-21-t1', name: 'Chức năng gan', notes: 'ALT/AST', status: 'completed' },
        ],
        'D-01': [],
        'E-03': [],
    };
    
    useEffect(() => {
        if (!localStorage.getItem('feedbacks')) {
            localStorage.setItem('feedbacks', JSON.stringify(initialFeedbacks));
        }
        if (!localStorage.getItem('lab_tests')) {
            localStorage.setItem('lab_tests', JSON.stringify(initialLabTests));
        }
    }, []);
}

// --- RoomPatientModal Component (Sửa đổi UI) ---
const RoomPatientModal = ({ room, onClose }) => {
    // Dữ liệu bệnh nhân ảo (DEMO DATA)
    const mockPatients = useMemo(() => {
        const patientData = [
            { id: 'A-12', name: 'Nguyễn Văn Mạnh', arrival: '08:30', status: 'Waiting', severity: 'Thường' },
            { id: 'A-15', name: 'Trần Thị Hằng', arrival: '08:45', status: 'In Progress', severity: 'Khẩn cấp' },
            { id: 'B-01', name: 'Lê Văn Khải', arrival: '09:10', status: 'Waiting', severity: 'Thường' },
            { id: 'B-08', name: 'Phạm Thị Mai', arrival: '09:15', status: 'Waiting', severity: 'Thường' },
            { id: 'C-05', name: 'Hoàng Đình Tùng', arrival: '09:20', status: 'Waiting', severity: 'Cấp cứu' },
        ];
        // Chỉ lấy số lượng bệnh nhân thực tế của phòng, chọn ngẫu nhiên
        return patientData.slice(0, room.patients).map((p, index) => ({
             ...p,
             id: `${room.id}-${index + 1}`, 
             name: p.name + (index === 0 ? ' (Đang khám)' : ''),
             status: index === 0 ? 'In Progress' : 'Waiting',
             severity: patientData[index].severity
        }));
    }, [room.patients, room.id]);

    const getSeverityStyles = (severity) => {
        switch(severity) {
            case 'Khẩn cấp': return 'bg-orange-100 text-orange-700 border border-orange-300';
            case 'Cấp cứu': return 'bg-red-100 text-red-700 border border-red-300';
            case 'Thường': return 'bg-green-100 text-green-700 border border-green-300';
            default: return 'bg-gray-100 text-gray-700';
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl p-8 transform transition-all duration-300">
                <div className="flex justify-between items-center border-b pb-4 mb-6">
                    <h3 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
                        <Home className="w-6 h-6 text-[#0077B6]" />
                        Chi tiết Phòng: {room.id} - Tầng {room.floor}
                    </h3>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 rounded-full transition bg-gray-50">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="mb-8 grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl shadow-inner">
                        <div className="text-sm font-medium text-blue-700 flex items-center gap-1"><User className="w-4 h-4"/> Bệnh nhân hiện tại</div>
                        <div className="text-3xl font-bold text-blue-900 mt-1">{room.patients}/{room.capacity}</div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-xl shadow-inner">
                        <div className="text-sm font-medium text-yellow-700 flex items-center gap-1"><Clock className="w-4 h-4"/> Chờ trung bình</div>
                        <div className="text-3xl font-bold text-yellow-900 mt-1">{room.avgWait} phút</div>
                    </div>
                     <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
                        <div className="text-sm font-medium text-gray-700 flex items-center gap-1"><Briefcase className="w-4 h-4"/> Bác sĩ phụ trách</div>
                        <div className="text-base font-semibold text-gray-900 mt-2">{room.doctor}</div>
                    </div>
                </div>

                <h4 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Danh sách Bệnh nhân ({room.patients} người)</h4>
                
                {mockPatients.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-3">
                        {mockPatients.map((p, index) => (
                            <div key={p.id} className="flex items-center justify-between p-5 bg-white rounded-xl shadow-md border-l-4 border-[#0077B6] hover:shadow-lg transition">
                                <div className="flex items-center space-x-4 flex-1 min-w-0">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${p.status === 'In Progress' ? 'bg-green-500 text-white shadow-lg' : 'bg-blue-100 text-blue-800'}`}>
                                        {index + 1}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="font-extrabold text-lg text-gray-900 truncate">{p.name}</div>
                                        <div className="text-sm text-gray-500">ID: {p.id} | Đến lúc: {p.arrival}</div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end space-y-2 shrink-0">
                                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${getSeverityStyles(p.severity)}`}>
                                        Mức độ: {p.severity}
                                    </span>
                                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${p.status === 'In Progress' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
                                        {p.status === 'In Progress' ? 'Đang khám' : 'Đang chờ'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-8 bg-gray-50 rounded-xl text-gray-500">
                        Phòng hiện đang trống.
                    </div>
                )}
            </div>
        </div>
    );
};
// --- End RoomPatientModal ---


// --- Components (Styled with Tailwind) ---
const SidebarItem = ({ icon: Icon, label, isActive, onClick, isCollapsed }) => (
  <button 
    onClick={onClick}
    className={`flex items-center w-full ${isCollapsed ? 'justify-center p-3' : 'px-4 py-3'} rounded-xl transition-all duration-200 group 
      ${isActive 
        ? 'bg-gradient-to-r from-[#0077B6] to-[#00B4D8] text-white shadow-lg shadow-blue-300/50' 
        : 'text-gray-600 hover:bg-blue-50 hover:text-[#0077B6]'}`
    }
    title={isCollapsed ? label : ''}
  >
    <Icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-[#0077B6]'}`} />
    {!isCollapsed && <span className="font-medium text-sm whitespace-nowrap">{label}</span>}
  </button>
);

const StatCard = ({ icon: Icon, title, value, unit, colorClass, bgColorClass }) => (
  <div className={`p-6 rounded-2xl shadow-xl border border-gray-100 ${bgColorClass}`}>
    <div className="flex items-center justify-between">
      <div>
        <div className={`text-xs font-semibold uppercase ${colorClass}`}>{title}</div>
        <div className="text-4xl font-bold text-gray-900 mt-2">
          {value}<span className="text-xl font-medium text-gray-500 ml-1">{unit}</span>
        </div>
      </div>
      <div className={`w-14 h-14 rounded-full flex items-center justify-center ${colorClass} bg-opacity-10 shrink-0`}>
        <Icon className={`w-7 h-7 ${colorClass}`} />
      </div>
    </div>
  </div>
);

const TestList = ({ patientId, tests, handleTestComplete }) => {
    if (!tests || tests.length === 0) {
        return (
            <div className="text-center p-6 bg-gray-50 rounded-xl">
                <p className="text-gray-500 font-medium">Bệnh nhân **{patientId}** chưa có xét nghiệm nào.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {tests.map(test => (
                <div key={test.id} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="flex-1 min-w-0 pr-4">
                        <div className="font-semibold text-gray-900 truncate">{test.name}</div>
                        <div className="text-xs text-gray-500">{test.notes}</div>
                    </div>
                    <div className="flex items-center space-x-3 shrink-0">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${test.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {test.status === 'completed' ? 'Hoàn thành' : 'Đang chờ'}
                        </span>
                        {test.status !== 'completed' && (
                            <button 
                                onClick={() => handleTestComplete(patientId, test.id)}
                                className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"
                                title="Đánh dấu hoàn thành"
                            >
                                <Check className="w-4 h-4" />
                            </button>
                        )}
                        {test.status === 'completed' && (
                           <div className="p-2 bg-green-100 text-green-600 rounded-full" title="Đã hoàn thành">
                                <Check className="w-4 h-4" />
                           </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};


// --- LabPanel Component ---
const EnhancedLabPanel = ({ onTestComplete }) => {
  const [labTests, setLabTests] = useState({});
  const [selectedPatientId, setSelectedPatientId] = useState('A-12'); 
  const [newTestPatientId, setNewTestPatientId] = useState('');
  const [newTestName, setNewTestName] = useState('');
  
  const patientSamples = ['A-12', 'B-05', 'C-21', 'D-01', 'E-03'];

  useEffect(() => {
    const storedTests = localStorage.getItem('lab_tests');
    if (storedTests) {
      setLabTests(JSON.parse(storedTests));
    }
  }, []);

  const labData = useMemo(() => {
    const allTests = Object.values(labTests).flat();
    return {
        totalRequests: allTests.filter(t => t.status === 'pending').length,
        rooms: [
          { id: 'XN-1', floor: 1, waitTime: 7, count: 1 },
          { id: 'XN-2', floor: 1, waitTime: 7, count: 1 },
          { id: 'XN-3', floor: 2, waitTime: 7, count: 1 },
          { id: 'XN-4', floor: 2, waitTime: 5, count: 0 },
        ],
    };
  }, [labTests]);

  const handleTestComplete = (patientId, testId) => {
    const newLabTests = { ...labTests };
    const patientTests = newLabTests[patientId];
    if (patientTests) {
      const testIndex = patientTests.findIndex(t => t.id === testId);
      if (testIndex !== -1) {
        patientTests[testIndex] = { ...patientTests[testIndex], status: 'completed' };
        localStorage.setItem('lab_tests', JSON.stringify(newLabTests));
        setLabTests(newLabTests);
        onTestComplete(); 
      }
    }
  };

  const handleNewTestSubmit = (e) => {
    e.preventDefault();

    if (!newTestPatientId || !newTestName) {
        alert('Vui lòng nhập Patient ID và Tên xét nghiệm.');
        return;
    }

    const testId = `${newTestPatientId}-${Date.now()}`;
    const newTest = {
        id: testId,
        name: newTestName,
        notes: 'Chờ kết quả',
        status: 'pending',
    };

    const newLabTests = { ...labTests };
    if (!newLabTests[newTestPatientId]) {
        newLabTests[newTestPatientId] = [];
    }

    newLabTests[newTestPatientId].push(newTest);

    localStorage.setItem('lab_tests', JSON.stringify(newLabTests));
    setLabTests(newLabTests);
    onTestComplete(); 
    
    setNewTestPatientId('');
    setNewTestName('');
    setSelectedPatientId(newTestPatientId); 

    alert(`Đã thêm xét nghiệm "${newTestName}" cho BN ${newTestPatientId}.`);
  };


  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-2">Lab Panel</h3>
      <div className="text-sm text-gray-500 mb-8">Theo dõi và quản lý các xét nghiệm cho bệnh nhân</div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        
        {/* Khối 1: Tổng lượt yêu cầu */}
        <div className="p-6 rounded-2xl border border-blue-200 bg-blue-50">
          <div className="flex items-center mb-4">
            <Users className="w-6 h-6 mr-3 text-blue-600" />
            <div className="text-sm font-semibold text-blue-700">Tổng lượt yêu cầu chờ xét nghiệm</div>
          </div>
          <div className="text-5xl font-extrabold text-blue-900">{labData.totalRequests}</div>
        </div>

        {/* Khối 2: Phòng chờ */}
        <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-md">
          <div className="flex items-center mb-4">
            <Home className="w-6 h-6 mr-3 text-gray-600" />
            <div className="text-sm font-semibold text-gray-700">Phòng chờ</div>
          </div>
          <div className="space-y-3">
            {labData.rooms.map(room => (
              <div key={room.id} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
                <div>
                  <div className="font-semibold text-gray-800">Tầng {room.floor} - {room.id}</div>
                  <div className="text-xs text-gray-500">Ước tính chờ: {room.waitTime} phút</div>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${room.count > 0 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}>
                  {room.count}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Khối 3: Chăm sóc khách hàng */}
        {/* <div className="p-6 rounded-2xl border border-green-200 bg-green-50">
            <div className="flex items-center mb-4">
                <Phone className="w-6 h-6 mr-3 text-green-600" />
                <div className="text-sm font-semibold text-green-700">Chăm sóc khách hàng</div>
            </div>
            <div className="text-xl font-bold text-gray-900">+84 24 1234 5678</div>
            <div className="text-sm text-gray-600 mb-4">Thứ 2 - Thứ 7, 08:00 - 17:00</div>
            <button 
                className="w-full px-4 py-3 bg-white text-green-600 rounded-xl hover:bg-gray-50 transition text-sm font-semibold shadow-md border border-green-300"
            >
                Gửi Email
            </button>
        </div> */}
      </div>
      
      {/* Khu vực xem và quản lý xét nghiệm */}
      <div className="pt-6 border-t border-gray-100">
        <h4 className="text-lg font-bold text-gray-800 mb-4">Quản lý Xét Nghiệm Bệnh Nhân</h4>

        {/* Chọn bệnh nhân */}
        <div className="flex items-center flex-wrap gap-3 mb-6">
          <span className="font-medium text-gray-700 mr-2">Chọn Patient ID:</span>
          {patientSamples.map(id => (
            <button 
                key={id} 
                onClick={() => setSelectedPatientId(id)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition 
                    ${selectedPatientId === id 
                        ? 'bg-blue-100 text-blue-900 shadow-sm border border-blue-300' 
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-100'}`}
            >
              {id}
            </button>
          ))}
        </div>

        {/* Hiển thị danh sách xét nghiệm */}
        <h5 className="text-md font-bold text-gray-700 mb-3">
            Danh sách xét nghiệm của BN: **{selectedPatientId}**
        </h5>
        <TestList 
            patientId={selectedPatientId} 
            tests={labTests[selectedPatientId]} 
            handleTestComplete={handleTestComplete}
        />
        
        {/* Khu vực tạo xét nghiệm mới */}
        <form onSubmit={handleNewTestSubmit} className="mt-8 pt-6 border-t border-gray-100">
             <h4 className="text-lg font-bold text-gray-800 mb-4">Thêm Xét Nghiệm Mới</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Patient ID (VD: A-12)</label>
                    <input 
                        type="text" 
                        placeholder="B-05" 
                        value={newTestPatientId}
                        onChange={(e) => setNewTestPatientId(e.target.value.toUpperCase())}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500" 
                    />
                </div>
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Tên Xét Nghiệm Mới</label>
                    <input 
                        type="text" 
                        placeholder="Tên xét nghiệm" 
                        value={newTestName}
                        onChange={(e) => setNewTestName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500" 
                    />
                </div>
            </div>
            <button 
                type="submit"
                className="mt-6 flex items-center gap-2 px-6 py-3 text-white bg-gradient-to-r from-[#0077B6] to-[#00B4D8] rounded-xl hover:shadow-lg transition shadow-md font-medium text-sm"
            >
                <Plus className="w-4 h-4" /> Thêm xét nghiệm
            </button>
        </form>
      </div>
    </div>
  );
};
// --- Kết thúc LabPanel Component ---

// --- Main Component ---

export function AdminDashboard() {
  useInitialData(); 
  const [active, setActive] = useState<'lab' | 'rooms' | 'feedback'>('lab');
  const [labPanelKey, setLabPanelKey] = useState(0); 
  const [isCollapsed, setIsCollapsed] = useState(false); 
  const [filterRoom, setFilterRoom] = useState('all');
  const [searchFeedback, setSearchFeedback] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null); 
  const username = sessionStorage.getItem('username') || 'Bác sĩ/Quản trị viên';

  const rooms = useMemo(() => [
    { id: 'XN-1', floor: 1, patients: 4, avgWait: 28, status: 'active', capacity: 8, doctor: 'BS. Nguyễn Văn A', nextPatient: 'A-12' },
    { id: 'XN-2', floor: 1, patients: 2, avgWait: 14, status: 'active', capacity: 6, doctor: 'BS. Trần Thị B', nextPatient: 'A-15' },
    { id: 'XN-3', floor: 2, patients: 6, avgWait: 42, status: 'busy', capacity: 8, doctor: 'BS. Lê Văn C', nextPatient: 'B-05' },
    { id: 'XN-4', floor: 2, patients: 1, avgWait: 7, status: 'active', capacity: 6, doctor: 'BS. Phạm Thị D', nextPatient: 'B-08' },
    { id: 'XN-5', floor: 3, patients: 8, avgWait: 55, status: 'full', capacity: 8, doctor: 'BS. Hoàng Văn E', nextPatient: 'C-01' },
    { id: 'XN-6', floor: 3, patients: 0, avgWait: 0, status: 'empty', capacity: 6, doctor: 'Chưa có BS', nextPatient: null },
  ], []); 

  const handleShowDetails = useCallback((room) => {
      setSelectedRoom(room);
  }, []);

  const handleCloseDetails = useCallback(() => {
      setSelectedRoom(null);
  }, []);

  interface Feedback {
    id: string;
    title: string;
    date: string;
    rating: number;
    comments: string;
    patientId: string;
    department: string;
    responded: boolean;
  }
  
  const feedbacks: Feedback[] = useMemo(() => {
    const raw = localStorage.getItem('feedbacks') || '[]';
    try { 
      const data = JSON.parse(raw);
      return data;
    } catch (e) { 
      return []; 
    }
  }, [labPanelKey]); 

  const handleTestCompleteNotification = useCallback(() => {
    setLabPanelKey(k => k + 1);
  }, []);

  const exportFeedbacks = useCallback(() => {
    const data = JSON.stringify(feedbacks); 
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedbacks_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [feedbacks]); 

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'text-green-600';
      case 'busy': return 'text-yellow-600';
      case 'full': return 'text-red-600';
      case 'empty': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100';
      case 'busy': return 'bg-yellow-100';
      case 'full': return 'bg-red-100';
      case 'empty': return 'bg-gray-100';
      default: return 'bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'active': return 'Hoạt động';
      case 'busy': return 'Bận';
      case 'full': return 'Đầy';
      case 'empty': return 'Trống';
      default: return 'Không xác định';
    }
  };

  const filteredRooms = rooms.filter(r => {
    if (filterRoom === 'all') return true;
    return r.status === filterRoom;
  });

  const filteredFeedbacks = feedbacks.filter((f) => { 
    if (!searchFeedback) return true;
    return f.title.toLowerCase().includes(searchFeedback.toLowerCase()) ||
           f.comments.toLowerCase().includes(searchFeedback.toLowerCase()) ||
           f.patientId.toLowerCase().includes(searchFeedback.toLowerCase());
  });

  // Statistics
  const totalPatients = rooms.reduce((sum, r) => sum + r.patients, 0);
  const avgWaitTime = Math.round(rooms.reduce((sum, r) => sum + r.avgWait, 0) / (rooms.filter(r => r.avgWait > 0).length || 1));
  const avgRating = feedbacks.length > 0 
    ? (feedbacks.reduce((sum: number, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1) 
    : '0.0';

  const roomStatusCounts = rooms.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});

  const currentTabTitle = active === 'lab' ? 'Lab Panel' : active === 'rooms' ? 'Quản lý phòng chờ' : 'Đánh giá khách hàng';
  const currentTabSubtitle = active === 'lab' 
    ? 'Theo dõi và quản lý xét nghiệm' 
    : active === 'rooms' 
      ? `${filteredRooms.length} phòng đang hoạt động • ${totalPatients} bệnh nhân` 
      : `${feedbacks.length} đánh giá • Trung bình ${avgRating}★`;


  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <nav className={`transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-100 p-4 sticky top-0 h-screen flex flex-col shadow-2xl shadow-blue-50/50`}>
        <div className="flex items-center justify-between gap-3 mb-10 p-2">
            <div className={`flex items-center gap-3 ${isCollapsed ? 'hidden' : 'block'}`}>
                <div className="w-10 h-10 bg-gradient-to-br from-[#0077B6] to-[#00B4D8] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shrink-0">
                    H
                </div>
                <h2 className="text-xl font-extrabold text-gray-900 whitespace-nowrap">Hospital Admin</h2>
            </div>
            
            {isCollapsed && (
                <div className="w-10 h-10 bg-gradient-to-br from-[#0077B6] to-[#00B4D8] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shrink-0">
                    H
                </div>
            )}

            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={`p-1 text-gray-400 hover:text-[#0077B6] transition rounded-full ${isCollapsed ? 'absolute -right-3 top-10 bg-white border border-gray-200 shadow-md' : ''}`}
            >
                {isCollapsed ? <ChevronLeft className="w-4 h-4 rotate-180" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
        </div>

        <div className="space-y-2 flex-1">
          <SidebarItem 
            icon={ClipboardList} 
            label="Lab Panel" 
            isActive={active === 'lab'} 
            onClick={() => setActive('lab')} 
            isCollapsed={isCollapsed}
          />
          <SidebarItem 
            icon={Users} 
            label="Phòng chờ" 
            isActive={active === 'rooms'} 
            onClick={() => setActive('rooms')} 
            isCollapsed={isCollapsed}
          />
          <SidebarItem 
            icon={FileText} 
            label="Đánh giá" 
            isActive={active === 'feedback'} 
            onClick={() => setActive('feedback')} 
            isCollapsed={isCollapsed}
          />
        </div>

        {/* User Info and Logout at bottom */}
        <div className="pt-6 border-t border-gray-100">
          <div className={`flex ${isCollapsed ? 'justify-center' : 'justify-between'} items-center p-3 bg-blue-50/50 rounded-xl`}>
            {!isCollapsed && (
                <div>
                    <div className="font-bold text-gray-900 text-sm">{username}</div>
                    <div className="text-xs text-gray-500">Quản trị viên</div>
                </div>
            )}
            <button 
              className={`p-2 text-gray-500 hover:text-red-500 hover:bg-white rounded-lg transition ${isCollapsed ? '' : 'ml-auto'}`} 
              onClick={() => { sessionStorage.clear(); window.location.href = '#/login'; }}
              title={isCollapsed ? 'Đăng xuất' : ''}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-10 overflow-y-auto"> 
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4"> 
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">{currentTabTitle}</h1>
            <div className="text-sm text-gray-500">{currentTabSubtitle}</div>
          </div>

          <div className="flex items-center gap-4"> 
            {active === 'rooms' && (
              <div className="flex gap-2 p-1 bg-white rounded-xl shadow-sm border border-gray-200">
                <button 
                  onClick={() => setFilterRoom('all')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition ${filterRoom === 'all' ? 'bg-[#0077B6] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Tất cả ({rooms.length})
                </button>
                <button 
                  onClick={() => setFilterRoom('active')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition ${filterRoom === 'active' ? 'bg-green-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Hoạt động ({roomStatusCounts['active'] || 0})
                </button>
                <button 
                  onClick={() => setFilterRoom('busy')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition ${filterRoom === 'busy' ? 'bg-yellow-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Bận ({roomStatusCounts['busy'] || 0})
                </button>
                <button 
                  onClick={() => setFilterRoom('full')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition ${filterRoom === 'full' ? 'bg-red-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Đầy ({roomStatusCounts['full'] || 0})
                </button>
              </div>
            )}
            
            {active === 'feedback' && (
              <button 
                onClick={exportFeedbacks} 
                className="flex items-center justify-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition shadow-sm font-medium text-sm"
              >
                <Download className="w-4 h-4" /> Export
              </button>
            )}
          </div>
        </div>

        {/* Section: Thống kê nhanh */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"> 
          <StatCard 
            icon={Users} 
            title="Tổng Bệnh nhân" 
            value={totalPatients} 
            unit="BN" 
            colorClass="text-blue-600"
            bgColorClass="bg-white"
          />
          <StatCard 
            icon={Clock} 
            title="Chờ Trung bình" 
            value={avgWaitTime} 
            unit="phút" 
            colorClass="text-yellow-600"
            bgColorClass="bg-white"
          />
          <StatCard 
            icon={Star} 
            title="Đánh giá TB" 
            value={avgRating} 
            unit="★" 
            colorClass="text-red-600"
            bgColorClass="bg-white"
          />
        </div>
        
        {/* Content area */}
        <div className="space-y-10">
          {active === 'lab' && (
            <EnhancedLabPanel key={labPanelKey} onTestComplete={handleTestCompleteNotification} /> 
          )}

          {active === 'rooms' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRooms.map(r => (
                <div key={r.id} className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-6"> 
                    <div className="bg-gradient-to-br from-[#0077B6] to-[#00B4D8] text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
                      <Home className="w-6 h-6" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBgColor(r.status)} ${getStatusColor(r.status)}`}>
                      {getStatusText(r.status)}
                    </span>
                  </div>

                  <div className="mb-6"> 
                    <div className="text-sm text-gray-400 font-bold">PHÒNG {r.id} - TẦNG {r.floor}</div>
                    <div className="text-4xl font-extrabold text-gray-900 mt-2">{r.patients}<span className="text-gray-400 text-xl">/{r.capacity}</span></div>
                    <div className="text-md text-gray-600 font-medium">Bệnh nhân hiện tại</div>
                  </div>

                  <div className="space-y-4 mb-8"> 
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium">Chờ trung bình</span>
                      </div>
                      <span className="text-lg font-bold text-blue-700">{r.avgWait} phút</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="text-xs text-gray-500">Bác sĩ phụ trách</div>
                      <div className="text-sm font-semibold text-gray-900">{r.doctor}</div>
                    </div>

                    {r.nextPatient && (
                      <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-200">
                        <div className="text-xs text-amber-700 font-medium">BN tiếp theo</div>
                        <div className="text-sm font-bold text-amber-900">{r.nextPatient}</div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4"> 
                    <button 
                        onClick={() => handleShowDetails(r)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#0077B6] to-[#00B4D8] text-white rounded-xl hover:shadow-xl hover:shadow-blue-300/50 transition text-sm font-semibold shadow-md"
                    >
                      <Eye className="w-4 h-4" /> Chi tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {active === 'feedback' && (
            <div className="space-y-8"> 
              <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-100 mb-6"> 
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo bệnh nhân, nội dung, khoa..."
                    value={searchFeedback}
                    onChange={(e) => setSearchFeedback(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0077B6] focus:border-transparent transition"
                  />
                </div>
              </div>

              <div className="space-y-6"> 
                {filteredFeedbacks.length === 0 ? (
                  <div className="bg-white rounded-3xl p-16 text-center shadow-xl border border-gray-100"> 
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <div className="text-gray-600 font-medium text-lg">Chưa có phản hồi nào</div>
                    <div className="text-sm text-gray-400 mt-2">Đã tải sẵn dữ liệu demo.</div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> 
                      {/* Thẻ đánh giá đã được tối ưu UI và bỏ nút */}
                      {filteredFeedbacks.slice().reverse().map((f) => ( 
                        <div key={f.id} className="p-6 bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:border-blue-200">
                          <div className="flex items-start justify-between mb-4"> 
                            {/* Tiêu đề & Status */}
                            <div className="flex flex-col flex-1 pr-4"> 
                                <div className="text-xl text-gray-900 font-extrabold mb-1">{f.title || 'Phản hồi không tiêu đề'}</div>
                                <div className="flex items-center gap-3">
                                    <div className={`px-2 py-0.5 rounded-full text-xs font-bold flex items-center shrink-0 ${f.responded ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                        {f.responded 
                                            ? <CheckCircle className="w-3 h-3 mr-1" /> 
                                            : <AlertCircle className="w-3 h-3 mr-1" />}
                                        {f.responded ? 'Đã phản hồi' : 'Chờ xử lý'}
                                    </div>
                                    <div className="text-sm font-semibold text-blue-600">{f.department}</div>
                                </div>
                            </div>
                            
                            {/* Rating */}
                            <div className="flex flex-col items-end gap-2 shrink-0"> 
                                <div className="bg-yellow-50 px-3 py-1 rounded-xl text-xl font-bold text-yellow-700 shadow-sm border border-yellow-200 flex items-center">
                                    {f.rating ? `${f.rating}.0` : '0.0'} <Star className="w-6 h-6 inline fill-yellow-400 text-yellow-400 ml-1" />
                                </div>
                            </div>
                          </div>
                          
                          {/* Comments */}
                          <blockquote className="text-gray-700 text-sm italic leading-relaxed mb-4 p-4 border-l-4 border-blue-400 bg-gray-50 rounded-tr-xl rounded-br-xl"> 
                            "{f.comments}"
                          </blockquote>
                          
                          {/* Metadata */}
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 pt-2 border-t border-gray-100">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {f.date || 'N/A'}
                            </span>
                            <span className="flex items-center gap-1">
                                <Activity className="w-3 h-3" /> BN: {f.patientId}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal hiển thị chi tiết phòng */}
      {selectedRoom && <RoomPatientModal room={selectedRoom} onClose={handleCloseDetails} />}
    </div>
  );
}