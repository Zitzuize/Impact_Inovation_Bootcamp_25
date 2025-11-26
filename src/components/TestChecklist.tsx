import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Navigation } from './Navigation';
import { MapPin, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface TestTask {
  id: string;
  name: string;
  type: string;
  department: string;
  room: string;
  avgMinutes: number;
  status: 'assigned' | 'arrived' | 'sampled' | 'waiting' | 'ready';
  remainingMs?: number;
}

export function TestChecklist() {
  const { patientId } = useParams<{ patientId?: string }>();
  const navigate = useNavigate();
  const [localId, setLocalId] = useState<string>(patientId || '');
  const [tasks, setTasks] = useState<TestTask[]>([]);
  const [activeTask, setActiveTask] = useState<TestTask | null>(null);
  const [showMapFor, setShowMapFor] = useState<string | null>(null);
  // QR sample modal state: booking | checkin | payment
  const [showQRFor, setShowQRFor] = useState<'booking' | 'checkin' | 'payment' | null>(null);
  const [qrSrc, setQrSrc] = useState<string>('/src/assets/My_QR_Code_1-1024.jpeg');

  const openMap = (task: TestTask) => {
    setActiveTask(task);
    setShowMapFor(task.id);
  };

  const closeMap = () => setShowMapFor(null);

  const handleArrived = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'arrived' } : t));
    const t = tasks.find(x => x.id === taskId) || null;
    if (t) openMap(t);
  };

  const handleSampled = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== taskId) return t;
        const accelerateFactorMsPerMinute = 5000; // demo: 1 minute = 5s
        const remainingMs = t.avgMinutes * accelerateFactorMsPerMinute;
        return { ...t, status: 'waiting', remainingMs };
      })
    );
    setShowMapFor(null);
  };

  const getStatusBadge = (t: TestTask) => {
    switch (t.status) {
      case 'assigned':
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200 border">Chưa đến</Badge>;
      case 'arrived':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200 border">Đã đến</Badge>;
      case 'waiting': {
        const secs = t.remainingMs ? Math.ceil(t.remainingMs / 1000) : undefined;
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 border">Đang chờ {secs ? `${secs}s` : ''}</Badge>
        );
      }
      case 'ready':
        return <Badge className="bg-green-100 text-green-700 border-green-200 border">Sẵn sàng</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200 border">Không xác định</Badge>;
    }
  };

  const openQR = (type: 'booking' | 'checkin' | 'payment') => {
    // try user's JPEG first when opening
    setQrSrc('/src/assets/My_QR_Code_1-1024.jpeg');
    setShowQRFor(type);
  };
  const closeQR = () => setShowQRFor(null);

  // Load tasks for patient from localStorage or create initial
  useEffect(() => {
    const id = patientId || localId;
    if (!id) return;

    const key = `tasks:${id}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        setTasks(JSON.parse(raw));
        return;
      } catch (e) { /* ignore */ }
    }

    const initial: TestTask[] = [
      { id: `${id}-t1`, name: 'Xét nghiệm máu toàn bộ', type: 'lab', department: 'Huyết học', room: 'Phòng XN-1', avgMinutes: 30, status: 'assigned' },
      { id: `${id}-t2`, name: 'Phân tích nước tiểu', type: 'lab', department: 'Vi sinh', room: 'Phòng XN-2', avgMinutes: 20, status: 'assigned' },
      { id: `${id}-t3`, name: 'X-Quang ngực', type: 'imaging', department: 'Chẩn đoán hình ảnh', room: 'Phòng XQ-1', avgMinutes: 45, status: 'assigned' },
    ];

    setTasks(initial);
    localStorage.setItem(key, JSON.stringify(initial));
  }, [patientId, localId]);

  const recreateInitialTasks = () => {
    const id = patientId || localId;
    if (!id) return;
    const initial: TestTask[] = [
      { id: `${id}-t1`, name: 'Xét nghiệm máu toàn bộ', type: 'lab', department: 'Huyết học', room: 'Phòng XN-1', avgMinutes: 30, status: 'assigned' },
      { id: `${id}-t2`, name: 'Phân tích nước tiểu', type: 'lab', department: 'Vi sinh', room: 'Phòng XN-2', avgMinutes: 20, status: 'assigned' },
      { id: `${id}-t3`, name: 'X-Quang ngực', type: 'imaging', department: 'Chẩn đoán hình ảnh', room: 'Phòng XQ-1', avgMinutes: 45, status: 'assigned' },
    ];
    setTasks(initial);
    localStorage.setItem(`tasks:${id}`, JSON.stringify(initial));
  };

  // Timer to update waiting tasks
  useEffect(() => {
    const id = setInterval(() => {
      setTasks(prev =>
        prev.map(t => {
          if (t.status === 'waiting' && t.remainingMs && t.remainingMs > 0) {
            const next = { ...t, remainingMs: t.remainingMs - 1000 };
            if (next.remainingMs! <= 0) {
              next.status = 'ready';
              next.remainingMs = 0;
            }
            return next;
          }
          return t;
        })
      );
    }, 1000);

    return () => clearInterval(id);
  }, []);

  // Persist tasks to localStorage on change
  useEffect(() => {
    const id = patientId || localId;
    if (!id) return;
    const key = `tasks:${id}`;
    localStorage.setItem(key, JSON.stringify(tasks));
  }, [tasks, patientId, localId]);

  // Listen for external updates (e.g., lab panel) via storage event
  useEffect(() => {
    const id = patientId || localId;
    if (!id) return;
    const key = `tasks:${id}`;
    const onStorage = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setTasks(JSON.parse(e.newValue));
        } catch (err) {}
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [patientId, localId]);

  // require check-in: if the session hasn't recorded a successful check-in for this patient, show prompt
  const hasSessionCheckedIn = (() => {
    try {
      const s = sessionStorage.getItem('hasCheckedIn') === 'true';
      const pid = sessionStorage.getItem('patientId') || '';
      const current = (patientId || localId) || '';
      return s && pid && current && pid === current;
    } catch (e) {
      return false;
    }
  })();

  if (!patientId && !localId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-[#F5F5F5]">
        <Navigation />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <Card className="shadow-xl border-none rounded-2xl p-6 text-center">
            <CardTitle>
              Nhập ID bệnh nhân để xem danh sách xét nghiệm
            </CardTitle>
            <CardContent>
              <div className="space-y-4">
                <input
                  value={localId}
                  onChange={(e) => setLocalId(e.target.value)}
                  placeholder="VD: A-12 hoặc 12345"
                  className="w-full rounded-xl p-3 border border-gray-300"
                />
                <div className="flex gap-3">
                  <Button onClick={() => { if (localId.trim()) navigate(`/tasks/${localId.trim()}`); }} className="flex-1 bg-[#0077B6] text-white rounded-xl">Xem</Button>
                  <Button variant="outline" onClick={() => navigate('/')} className="flex-1 rounded-xl">Về Trang Chủ</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // If user hasn't checked-in for this patient, show a clear prompt to go to check-in
  if (!hasSessionCheckedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-[#F5F5F5]">
        <Navigation />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <Card className="shadow-xl border-none rounded-2xl p-6 text-center">
            <CardTitle>Vui lòng hoàn tất Check-in</CardTitle>
            <CardContent>
              <p className="text-gray-600 mb-4">Bạn chưa check-in cho mã bệnh nhân này hoặc check-in thuộc phiên khác. Vui lòng thực hiện check-in để xem hành trình và kết quả.</p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => navigate('/check-in')} className="bg-[#0077B6] text-white rounded-xl">Đi tới Check-in</Button>
                <Button variant="outline" onClick={() => navigate('/')} className="rounded-xl">Về Trang Chủ</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F5F5F5]">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <h1 className="text-gray-900 mb-2">Danh Sách Xét Nghiệm - Bệnh nhân: {patientId || localId}</h1>
        <p className="text-gray-600 mb-6">Các xét nghiệm theo đơn của bác sĩ. Mỗi task gắn với ID bệnh nhân.</p>

        {tasks.length === 0 && (
          <Card className="shadow-md border-none rounded-2xl p-6 mb-6">
            <CardContent>
              <div className="text-center">
                <div className="text-gray-700 mb-3">Hiện chưa có nhiệm vụ nào được tải cho mã bệnh nhân này.</div>
                <div className="flex justify-center">
                  <Button onClick={recreateInitialTasks} className="bg-[#0077B6] text-white rounded-xl">Tải lại danh sách</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-lg border-none rounded-2xl mb-6">
          <CardContent className="p-0">
            {/* Desktop / tablet: show table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#F5F5F5]">
                  <tr>
                    <th className="p-4">Xét nghiệm</th>
                    <th className="p-4">Khoa / Phòng</th>
                    <th className="p-4">Thời gian trung bình</th>
                    <th className="p-4">Trạng thái</th>
                    <th className="p-4">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map(t => (
                    <tr key={t.id} className="border-t">
                      <td className="p-4">{t.name}</td>
                      <td className="p-4">
                        <div className="text-sm text-gray-600">{t.department}</div>
                        <div className="text-xs text-gray-400 mt-1">{t.room}</div>
                      </td>
                      <td className="p-4">{t.avgMinutes} phút (tb)</td>
                      <td className="p-4">{getStatusBadge(t)}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button onClick={() => openMap(t)} variant="outline" className="rounded-xl"> <MapPin className="w-4 h-4 mr-2" /> Chỉ đường</Button>

                          {t.status === 'assigned' && (
                            <Button onClick={() => handleArrived(t.id)} className="bg-[#0077B6] text-white rounded-xl">Đã Đến</Button>
                          )}

                          {(t.status === 'arrived' || t.status === 'assigned') && (
                            <Button onClick={() => handleSampled(t.id)} className="bg-[#00B4D8] text-white rounded-xl">Lấy Mẫu</Button>
                          )}

                          {t.status === 'waiting' && (
                            <Button disabled variant="outline" className="rounded-xl"> <Clock className="w-4 h-4 mr-2" /> Đang chờ kết quả</Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile: stacked cards */}
            <div className="block md:hidden space-y-3 p-4">
              {tasks.map(t => (
                <div key={t.id} className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-900">{t.name}</div>
                      <div className="text-sm text-gray-600 mt-1">{t.department} • <span className="text-xs text-gray-400">{t.room}</span></div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">{t.avgMinutes} phút</div>
                      <div className="mt-2">{getStatusBadge(t)}</div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button onClick={() => openMap(t)} variant="outline" className="rounded-xl"> <MapPin className="w-4 h-4 mr-2" /> Chỉ đường</Button>
                    {t.status === 'assigned' && <Button onClick={() => handleArrived(t.id)} className="bg-[#0077B6] text-white rounded-xl">Đã Đến</Button>}
                    {(t.status === 'arrived' || t.status === 'assigned') && <Button onClick={() => handleSampled(t.id)} className="bg-[#00B4D8] text-white rounded-xl">Lấy Mẫu</Button>}
                    {t.status === 'waiting' && <Button disabled variant="outline" className="rounded-xl"> <Clock className="w-4 h-4 mr-2" /> Đang chờ</Button>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {showMapFor && activeTask && (
          <Card className="shadow-xl border-none rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><MapPin className="w-6 h-6 text-[#0077B6]" /> Chỉ đường tới {activeTask.room}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <div className="w-full h-64 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">BẢN ĐỒ ẢO / CHỈ ĐƯỜNG (thay bằng map thật sau)</div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-600">Phòng</div>
                    <div className="text-gray-900">{activeTask.room}</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600">Khoa</div>
                    <div className="text-gray-900">{activeTask.department}</div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => { handleArrived(activeTask.id); }} className="bg-[#0077B6] text-white rounded-xl">Đã Đến</Button>
                    <Button onClick={() => { handleSampled(activeTask.id); }} className="bg-[#00B4D8] text-white rounded-xl">Lấy Mẫu</Button>
                    <Button variant="outline" onClick={closeMap} className="rounded-xl">Đóng</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* QR sample modal */}
        {showQRFor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={closeQR} />
            <div className="max-w-md w-full mx-auto z-10">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-4 flex items-center justify-between border-b">
                  <div className="text-sm font-medium">Mẫu QR - {showQRFor === 'booking' ? 'Booking' : showQRFor === 'checkin' ? 'Check-in' : 'Payment'}</div>
                  <Button variant="outline" onClick={closeQR} className="ml-2">Đóng</Button>
                </div>
                <div className="p-6 flex flex-col items-center gap-4">
                  <div className="rounded-2xl border-4 border-[#0077B6] p-3 bg-transparent">
                    <div className="bg-white p-4 rounded-lg">
                      <img src={qrSrc} alt="Mẫu QR" className="w-56 h-56 sm:w-72 sm:h-72 object-contain" onError={(e:any)=>{e.currentTarget.onerror=null; e.currentTarget.src='/src/assets/qr-sample.svg'}} />
                    </div>
                  </div>
                  <div className="text-center text-sm text-gray-600">Xuất trình mã QR này khi check-in để bỏ qua hàng chờ.</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TestChecklist;
