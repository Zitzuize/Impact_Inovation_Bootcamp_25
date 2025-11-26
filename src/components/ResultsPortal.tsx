import { useState } from 'react';
import { Navigation } from './Navigation';
import { FileText, Download, Eye, Calendar, Bell, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface MedicalRecord {
  id: string;
  type: 'lab' | 'prescription' | 'imaging' | 'report';
  title: string;
  date: string;
  doctor: string;
  department: string;
  status: 'ready' | 'pending' | 'reviewed';
  fileSize?: string;
}

interface Appointment {
  id: string;
  type: 'follow-up' | 'test' | 'consultation';
  department: string;
  doctor: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed';
  notes?: string;
}

export function ResultsPortal() {
  const [activeTab, setActiveTab] = useState('results');

  const records: MedicalRecord[] = [
    {
      id: '1',
      type: 'lab',
      title: 'Kết Quả Xét Nghiệm Máu',
      date: '2025-11-08',
      doctor: 'BS. Nguyễn Văn A',
      department: 'Tim Mạch',
      status: 'ready',
      fileSize: '245 KB',
    },
    {
      id: '2',
      type: 'imaging',
      title: 'Chụp X-Quang Ngực',
      date: '2025-11-07',
      doctor: 'BS. Trần Thị B',
      department: 'Chẩn Đoán Hình Ảnh',
      status: 'ready',
      fileSize: '1.2 MB',
    },
    {
      id: '3',
      type: 'prescription',
      title: 'Đơn Thuốc',
      date: '2025-11-06',
      doctor: 'BS. Lê Văn C',
      department: 'Tiêu Hóa',
      status: 'reviewed',
      fileSize: '156 KB',
    },
    {
      id: '4',
      type: 'report',
      title: 'Báo Cáo Khám Bệnh',
      date: '2025-11-05',
      doctor: 'BS. Phạm Thị D',
      department: 'Thần Kinh',
      status: 'ready',
      fileSize: '342 KB',
    },
    {
      id: '5',
      type: 'lab',
      title: 'Phân Tích Nước Tiểu',
      date: '2025-11-04',
      doctor: 'BS. Hoàng Văn E',
      department: 'Thận',
      status: 'pending',
      fileSize: '-',
    },
  ];

  const appointments: Appointment[] = [
    {
      id: '1',
      type: 'follow-up',
      department: 'Tim Mạch',
      doctor: 'BS. Nguyễn Văn A',
      date: '2025-11-15',
      time: '09:00 - 09:30',
      status: 'upcoming',
      notes: 'Vui lòng mang theo kết quả xét nghiệm máu',
    },
    {
      id: '2',
      type: 'test',
      department: 'Chẩn Đoán Hình Ảnh',
      doctor: 'BS. Trần Thị B',
      date: '2025-11-20',
      time: '14:00 - 14:30',
      status: 'upcoming',
      notes: 'Yêu cầu nhịn ăn 8 tiếng trước xét nghiệm',
    },
    {
      id: '3',
      type: 'consultation',
      department: 'Tiêu Hóa',
      doctor: 'BS. Lê Văn C',
      date: '2025-11-02',
      time: '10:00 - 10:30',
      status: 'completed',
    },
  ];

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'lab': return '🔬';
      case 'imaging': return '📷';
      case 'prescription': return '💊';
      case 'report': return '📄';
      default: return '📋';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge className="bg-green-100 text-green-700 border-green-200 border">Sẵn Sàng</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 border">Đang Chờ</Badge>;
      case 'reviewed':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200 border">Đã Xem</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200 border">Không Xác Định</Badge>;
    }
  };

  const getAppointmentIcon = (type: string) => {
    switch (type) {
      case 'follow-up': return '🔄';
      case 'test': return '🔬';
      case 'consultation': return '👨‍⚕️';
      default: return '📅';
    }
  };

  const getAppointmentTypeName = (type: string) => {
    switch (type) {
      case 'follow-up': return 'Tái khám';
      case 'test': return 'Xét nghiệm';
      case 'consultation': return 'Tư vấn';
      default: return type;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatLongDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F5F5F5]">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Hồ Sơ Y Tế & Kết Quả</h1>
          <p className="text-gray-600">Xem kết quả xét nghiệm, đơn thuốc và lịch hẹn sắp tới</p>
        </div>

        {/* Notification Banner */}
        <Card className="mb-6 bg-gradient-to-r from-[#0077B6]/10 to-[#00B4D8]/10 border-[#0077B6]/20 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#0077B6] rounded-xl flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-2">Có Kết Quả Mới</h3>
                <p className="text-gray-600 mb-3">
                  Bạn có 2 kết quả xét nghiệm mới sẵn sàng để xem. Lịch tái khám của bạn được lên lịch vào ngày 15 tháng 11 năm 2025.
                </p>
                <Button className="bg-[#0077B6] hover:bg-[#005a8c] text-white rounded-xl">
                  Xem Ngay
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 mb-6 bg-[#F5F5F5] p-1 rounded-xl">
            <TabsTrigger value="results" className="rounded-lg data-[state=active]:bg-white">
              Kết Quả Xét Nghiệm
            </TabsTrigger>
            <TabsTrigger value="appointments" className="rounded-lg data-[state=active]:bg-white">
              Lịch Hẹn
            </TabsTrigger>
          </TabsList>

          {/* Test Results Tab */}
          <TabsContent value="results" className="space-y-4">
            {records.map((record) => (
              <Card key={record.id} className="shadow-lg border-none rounded-2xl hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-14 h-14 bg-[#0077B6]/10 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                        {getRecordIcon(record.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-gray-900">{record.title}</h3>
                          {getStatusBadge(record.status)}
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {formatDate(record.date)}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4"></div>
                            {record.doctor} • {record.department}
                          </div>
                          {record.fileSize && record.fileSize !== '-' && (
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              PDF • {record.fileSize}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 md:flex-col">
                      {record.status !== 'pending' ? (
                        <>
                          <Button 
                            variant="outline" 
                            className="flex-1 md:flex-none border-[#0077B6] text-[#0077B6] hover:bg-[#0077B6]/5 rounded-xl"
                          >
                            <Eye className="w-4 h-4 md:mr-2" />
                            <span className="hidden md:inline">Xem</span>
                          </Button>
                          <Button 
                            className="flex-1 md:flex-none bg-[#0077B6] hover:bg-[#005a8c] text-white rounded-xl"
                          >
                            <Download className="w-4 h-4 md:mr-2" />
                            <span className="hidden md:inline">Tải Về</span>
                          </Button>
                        </>
                      ) : (
                        <Button 
                          disabled
                          variant="outline" 
                          className="flex-1 md:flex-none rounded-xl opacity-50"
                        >
                          Đang xử lý...
                        </Button>
                      )}
                    </div>
                  </div>

                  {record.status === 'ready' && record.id === '1' && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <div className="text-blue-900 mb-1">Ghi Chú Của Bác Sĩ</div>
                          <div className="text-blue-700">
                            Kết quả xét nghiệm máu của bạn cho thấy các giá trị bình thường. Vui lòng lên lịch 
                            tái khám để thảo luận về kết quả chi tiết.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-4">
            <div className="space-y-6">
              {/* Upcoming Appointments */}
              <div>
                <h3 className="text-gray-900 mb-4">Lịch Hẹn Sắp Tới</h3>
                <div className="space-y-4">
                  {appointments.filter(a => a.status === 'upcoming').map((appointment) => (
                    <Card key={appointment.id} className="shadow-lg border-none rounded-2xl">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-14 h-14 bg-gradient-to-br from-[#0077B6] to-[#00B4D8] rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                              {getAppointmentIcon(appointment.type)}
                            </div>
                            
                            <div className="flex-1">
                              <h3 className="text-gray-900 mb-2">
                                {getAppointmentTypeName(appointment.type)} - {appointment.department}
                              </h3>
                              
                              <div className="space-y-1 text-sm text-gray-600 mb-3">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-[#0077B6]" />
                                  {formatLongDate(appointment.date)}
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4"></div>
                                  {appointment.time} • {appointment.doctor}
                                </div>
                              </div>

                              {appointment.notes && (
                                <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-xl text-sm">
                                  <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                                  <div className="text-yellow-900">{appointment.notes}</div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              className="flex-1 md:flex-none border-[#0077B6] text-[#0077B6] hover:bg-[#0077B6]/5 rounded-xl"
                            >
                              Đổi Lịch
                            </Button>
                            <Button 
                              className="flex-1 md:flex-none bg-[#0077B6] hover:bg-[#005a8c] text-white rounded-xl"
                            >
                              Xem Chi Tiết
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Past Appointments */}
              <div>
                <h3 className="text-gray-900 mb-4">Lịch Hẹn Đã Qua</h3>
                <div className="space-y-4">
                  {appointments.filter(a => a.status === 'completed').map((appointment) => (
                    <Card key={appointment.id} className="shadow-lg border-none rounded-2xl opacity-75">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="text-gray-900 mb-1">
                              {getAppointmentTypeName(appointment.type)} - {appointment.department}
                            </h3>
                            <div className="text-sm text-gray-600">
                              {formatDate(appointment.date)} • {appointment.time} • {appointment.doctor}
                            </div>
                          </div>

                          <Badge className="bg-green-100 text-green-700 border-green-200 border">
                            Hoàn Thành
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Help Card */}
        <Card className="mt-8 bg-gradient-to-r from-[#00B4D8]/10 to-[#0077B6]/10 border-[#0077B6]/20 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#0077B6] rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-gray-900 mb-2">Cần Hỗ Trợ?</h3>
                <p className="text-gray-600 mb-4">
                  Nếu bạn có câu hỏi về kết quả hoặc cần thảo luận với bác sĩ, 
                  vui lòng gọi đường dây hỗ trợ bệnh nhân <span className="text-[#0077B6]">1900-199-199</span> hoặc 
                  đặt lịch tư vấn.
                </p>
                <Button className="bg-[#0077B6] hover:bg-[#005a8c] text-white rounded-xl">
                  Liên Hệ Hỗ Trợ
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
