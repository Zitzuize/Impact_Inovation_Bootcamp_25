import React, { useEffect, useState } from 'react';
import { Navigation } from './Navigation';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Users, MapPin, Phone } from 'lucide-react';

type Props = { hideNav?: boolean };

type TestItem = { id: string; name: string; notes?: string; status?: 'pending' | 'done' };

export default function LabPanel({ hideNav }: Props) {
  const [patientId, setPatientId] = useState('');
  const [tests, setTests] = useState<TestItem[]>([]);
  const [newTestName, setNewTestName] = useState('');
  const [newTestNotes, setNewTestNotes] = useState('');

  const [totalBookings, setTotalBookings] = useState(0);
  const [waitingRooms, setWaitingRooms] = useState<Array<{ floor: number; room: string; patients: number; avgWait: number }>>([]);

  const samplePatients = ['A-12', 'B-05', 'C-21'];

  useEffect(() => {
    // load last patient id from session if any
    const last = sessionStorage.getItem('currentPatientId') || '';
    setPatientId(last);
  }, []);

  useEffect(() => {
    if (!patientId) return;
    loadTestsForPatient(patientId);
  }, [patientId]);

  useEffect(() => {
    computeBookingStats();
    // recompute periodically in case localStorage changed elsewhere
    const id = setInterval(computeBookingStats, 5000);
    return () => clearInterval(id);
  }, []);

  const loadTestsForPatient = (pid: string) => {
    const raw = localStorage.getItem(`lab_tests_${pid}`) || '[]';
    try {
      const parsed = JSON.parse(raw) as TestItem[];
      setTests(parsed.map(t => ({ ...t, status: t.status || 'pending' })));
    } catch (e) {
      setTests([]);
    }
  };

  const computeBookingStats = () => {
    // Count all lab_tests_* entries in localStorage
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) || '';
      if (key.startsWith('lab_tests_')) {
        try {
          const arr = JSON.parse(localStorage.getItem(key) || '[]');
          if (Array.isArray(arr)) total += arr.length;
        } catch (e) {
          // ignore parse errors
        }
      }
    }

    setTotalBookings(total);

    // Create waiting room mock layout and distribute patients
    const rooms = [
      { floor: 1, room: 'XN-1' },
      { floor: 1, room: 'XN-2' },
      { floor: 2, room: 'XN-3' },
      { floor: 2, room: 'XN-4' },
    ];

    const base = Math.floor(total / rooms.length);
    let rem = total % rooms.length;
    const roomStats = rooms.map((r) => {
      const patients = base + (rem > 0 ? 1 : 0);
      if (rem > 0) rem -= 1;
      const avgWait = Math.max(5, Math.round(patients * 7)); // simple heuristic: 7 min per patient
      return { ...r, patients, avgWait };
    });

    setWaitingRooms(roomStats);
  };

  const saveTests = (updated: typeof tests) => {
    setTests(updated);
    localStorage.setItem(`lab_tests_${patientId}`, JSON.stringify(updated));
    // update global stats when tests change
    computeBookingStats();
  };

  const handleAddTest = () => {
    if (!newTestName.trim() || !patientId.trim()) return;
    const t: TestItem = { id: `${Date.now()}-${Math.random().toString(36).substr(2,6)}`, name: newTestName.trim(), notes: newTestNotes.trim(), status: 'pending' };
    const updated = [t, ...tests];
    saveTests(updated);
    setNewTestName('');
    setNewTestNotes('');
    sessionStorage.setItem('currentPatientId', patientId);
  };

  const handleRemove = (id: string) => {
    const updated = tests.filter(t => t.id !== id);
    saveTests(updated);
  };

  const toggleStatus = (id: string) => {
    const updated = tests.map(t => t.id === id ? ({ ...t, status: t.status === 'done' ? 'pending' : 'done' }) : t);
    saveTests(updated);
  };

  const generateDemoFor = (pid: string) => {
    const demo: TestItem[] = [
      { id: `${Date.now()}-a`, name: 'Xét nghiệm máu cơ bản', notes: 'CBC', status: 'pending' },
      { id: `${Date.now()}-b`, name: 'Xét nghiệm nước tiểu', notes: 'Urinalysis', status: 'pending' },
    ];
    localStorage.setItem(`lab_tests_${pid}`, JSON.stringify(demo));
    sessionStorage.setItem('currentPatientId', pid);
    setPatientId(pid);
    loadTestsForPatient(pid);
    computeBookingStats();
  };

  const customerCare = {
    phone: '+84 24 1234 5678',
    email: 'support@199healthhub.vn',
    hours: 'Thứ 2 - Thứ 7, 08:00 - 17:00',
  };

  return (
    <div>
      {!hideNav && <Navigation />}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-6">
          <h1 className="text-gray-900 text-2xl mb-1">Lab Panel</h1>
          <p className="text-gray-600">Thêm và quản lý các xét nghiệm cho bệnh nhân</p>
        </div>

        {/* Top stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="p-3 bg-[#0077B6]/10 rounded-lg">
                <Users className="w-6 h-6 text-[#0077B6]" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Tổng lượt yêu cầu xét nghiệm</div>
                <div className="text-2xl text-gray-900 font-semibold">{totalBookings}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="text-sm text-gray-500 mb-2 flex items-center gap-2"><MapPin className="w-4 h-4 text-[#0077B6]"/> Phòng chờ</div>
              <div className="space-y-2">
                {waitingRooms.map((r) => (
                  <div key={`${r.floor}-${r.room}`} className="flex items-center justify-between p-2 bg-[#F7FAFC] rounded-lg">
                    <div>
                      <div className="text-sm text-gray-700">Tầng {r.floor} · {r.room}</div>
                      <div className="text-xs text-gray-500">Ước tính chờ: {r.avgWait} phút</div>
                    </div>
                    <div className="bg-[#0077B6] text-white px-3 py-1 rounded-full text-sm">{r.patients}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#0077B6]/10 rounded-lg">
                  <Phone className="w-5 h-5 text-[#0077B6]" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Chăm sóc khách hàng</div>
                  <div className="text-gray-900 font-medium">{customerCare.phone}</div>
                </div>
              </div>

              <div className="text-sm text-gray-600">{customerCare.hours}</div>

              <div className="flex gap-2 pt-2">
                <a href={`tel:${customerCare.phone.replace(/\s+/g, '')}`} className="w-full">
                  <Button className="w-full bg-[#0077B6] text-white">Gọi Ngay</Button>
                </a>
                <a href={`mailto:${customerCare.email}`} className="w-full">
                  <Button variant="outline" className="w-full">Gửi Email</Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add test form */}
        <Card className="mb-6">
          <CardContent className="space-y-4">
            <div>
              <Label>Chọn bệnh nhân mẫu</Label>
              <div className="flex gap-2">
                {samplePatients.map(p => (
                  <Button key={p} variant="outline" onClick={() => { setPatientId(p); loadTestsForPatient(p); sessionStorage.setItem('currentPatientId', p); }}>{p}</Button>
                ))}
                <Button onClick={() => generateDemoFor('A-12')} className="bg-[#0077B6] text-white">Tạo demo cho A-12</Button>
              </div>
            </div>

            <div>
              <Label>Patient ID (VD: A-12)</Label>
              <Input value={patientId} onChange={(e) => setPatientId(e.target.value)} placeholder="Nhập ID bệnh nhân" className="rounded-xl" />
            </div>

            <div>
              <Label>Tên Xét Nghiệm Mới</Label>
              <Input value={newTestName} onChange={(e) => setNewTestName(e.target.value)} placeholder="Tên xét nghiệm" className="rounded-xl" />
            </div>

            <div>
              <Label>Ghi chú (tùy chọn)</Label>
              <Input value={newTestNotes} onChange={(e) => setNewTestNotes(e.target.value)} placeholder="Ghi chú, chỉ định" className="rounded-xl" />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddTest} className="bg-[#0077B6] text-white">Thêm Xét Nghiệm</Button>
              <Button variant="outline" onClick={() => { setNewTestName(''); setNewTestNotes(''); }}>Xóa</Button>
              <Button variant="ghost" onClick={() => { 
                // mark all as done demo
                const updated: TestItem[] = tests.map(t => ({ ...t, status: 'done' }));
                saveTests(updated);
              }}>Đánh dấu tất cả xong</Button>
            </div>
          </CardContent>
        </Card>

        {/* Test list */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách xét nghiệm cho {patientId || '---'}</CardTitle>
          </CardHeader>
          <CardContent>
            {tests.length === 0 ? (
              <div className="text-sm text-gray-500">Chưa có xét nghiệm nào cho bệnh nhân này.</div>
            ) : (
              <div className="space-y-3">
                {tests.map(t => (
                  <div key={t.id} className="p-3 bg-[#F5F5F5] rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{t.name} {t.status === 'done' && <span className="ml-2 text-sm text-green-600">(Hoàn thành)</span>}</div>
                      {t.notes && <div className="text-sm text-gray-600">{t.notes}</div>}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => navigator.clipboard?.writeText(t.id) }>Sao chép ID</Button>
                      <Button onClick={() => toggleStatus(t.id)} className={`px-3 py-2 rounded-xl ${t.status === 'done' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                        {t.status === 'done' ? 'Đặt lại' : 'Đánh dấu xong'}
                      </Button>
                      <Button onClick={() => handleRemove(t.id)} className="bg-red-100 text-red-600">Xóa</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
