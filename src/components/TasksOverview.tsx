import { Link, useNavigate } from 'react-router-dom';
import { Navigation } from './Navigation';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Users } from 'lucide-react';
import { useState } from 'react';
import { Badge } from './ui/badge';

export function TasksOverview() {
  const navigate = useNavigate();
  const savedId = sessionStorage.getItem('patientId') || '';
  const [patientIdInput, setPatientIdInput] = useState(savedId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F5F5F5]">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h1 className="text-gray-900 mb-4">Theo dõi hành trình khám</h1>
        <p className="text-gray-600 mb-6">Bạn chỉ có thể xem hành trình của chính mình. Nhập mã bệnh nhân của bạn hoặc dùng ID đã lưu.</p>

        <Card className="shadow-lg rounded-2xl mb-6">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <input
                value={patientIdInput}
                onChange={(e) => setPatientIdInput(e.target.value)}
                placeholder="Nhập ID bệnh nhân (vd: A-12)"
                className="col-span-2 rounded-xl p-3 border border-gray-300"
                aria-label="patient-id-input"
              />
              <div className="flex gap-2">
                <Button onClick={() => {
                  if (!patientIdInput.trim()) return;
                  // store as current patient session (only patient can set their own id)
                  sessionStorage.setItem('patientId', patientIdInput.trim());
                  navigate(`/tasks/${encodeURIComponent(patientIdInput.trim())}`);
                }} className="bg-[#0077B6] text-white rounded-xl">Xem hành trình</Button>
                <Button variant="outline" onClick={() => { sessionStorage.removeItem('patientId'); setPatientIdInput(''); }} className="rounded-xl">Đăng xuất ID</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Show only current patient's quick card and task preview if set */}
        {savedId && (
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#0077B6] rounded-lg flex items-center justify-center text-white">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-900 font-medium">Bệnh nhân</div>
                    <div className="text-sm text-gray-600">{savedId}</div>
                  </div>
                </div>
                <div className="mt-4">
                  <Button onClick={() => navigate(`/tasks/${encodeURIComponent(savedId)}`)} className="w-full bg-[#0077B6] text-white rounded-xl">Xem hành trình của tôi</Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick tasks preview */}
            <Card className="shadow-lg rounded-2xl md:col-span-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-gray-900">Nhiệm vụ sắp tới</h3>
                    <div className="text-sm text-gray-600">Danh sách xét nghiệm liên quan đến ID của bạn</div>
                  </div>
                  <Button variant="outline" onClick={() => navigate(`/tasks/${encodeURIComponent(savedId)}`)} className="rounded-xl">Xem đầy đủ</Button>
                </div>

                <div className="space-y-3">
                  {[{
                    id: `${savedId}-t1`, name: 'Xét nghiệm máu toàn bộ', department: 'Huyết học', room: 'Phòng XN-1', avgMinutes: 30, status: 'assigned'
                  },{
                    id: `${savedId}-t2`, name: 'Phân tích nước tiểu', department: 'Vi sinh', room: 'Phòng XN-2', avgMinutes: 20, status: 'assigned'
                  }].map(task => (
                    <div key={task.id} className="p-3 bg-[#F5F5F5] rounded-xl flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-900">{task.name}</div>
                        <div className="text-xs text-gray-600">{task.department} • {task.room}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">{task.avgMinutes} phút</div>
                        <div className="mt-2"><Badge className="bg-gray-100 text-gray-700 border-gray-200 border">Chưa đến</Badge></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <Button onClick={() => { sessionStorage.setItem('workflowStep', '5'); navigate('/feedback'); }} className="w-full bg-[#0077B6] text-white rounded-xl">Hoàn thành bước — Gửi Phản Hồi</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}

export default TasksOverview;
