import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navigation } from './Navigation';
import { Calendar as CalendarIcon, Clock, CreditCard, CheckCircle, QrCode, Download } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export function AppointmentBooking() {
  const location = useLocation();
  const navigate = useNavigate();
  const suggestedDepartment = location.state?.department;
  const savedCccd = sessionStorage.getItem('cccd') || '';
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    department: suggestedDepartment || '',
    doctor: '',
    date: undefined as Date | undefined,
    timeSlot: '',
    fullName: '',
    phone: '',
    idNumber: savedCccd,
    reason: '',
  });
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [qrSrc, setQrSrc] = useState('/src/assets/My_QR_Code_1-1024.jpeg');

  useEffect(() => {
    const stepVal = Number(sessionStorage.getItem('workflowStep') || '0');
    // only allow booking when user is at ai or booking step
    if (stepVal > 1) {
      // user already past booking, allow view
    }
  }, []);

  const departments = [
    'Tim Mạch',
    'Tiêu Hóa',
    'Chấn Thương Chỉnh Hình',
    'Thần Kinh',
    'Da Liễu',
    'Tai Mũi Họng',
    'Mắt',
    'Nhi Khoa',
    'Nội Tổng Hợp',
  ];

  const timeSlots = [
    '08:00 - 08:30',
    '08:30 - 09:00',
    '09:00 - 09:30',
    '09:30 - 10:00',
    '10:00 - 10:30',
    '13:00 - 13:30',
    '13:30 - 14:00',
    '14:00 - 14:30',
    '14:30 - 15:00',
    '15:00 - 15:30',
  ];

  const consultationFee = 200000; // 200,000 VND

  const handlePayment = (method: string) => {
    // Simulate payment processing depending on method
    setTimeout(() => {
      setPaymentComplete(true);
      setQrCode(`QR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
      setStep(3);
      // advance workflow step to indicate payment done
      sessionStorage.setItem('workflowStep', '2');
    }, 1500);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Chọn ngày';
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F5F5F5]">
      <Navigation />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="text-center mb-8">
          <h1 className="text-gray-900 mb-2">Đặt Lịch Hẹn</h1>
          <p className="text-gray-600">Hoàn tất đặt lịch và bỏ qua hàng chờ đăng ký</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    step >= num
                      ? 'bg-[#0077B6] text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {num}
                </div>
                {num < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      step > num ? 'bg-[#0077B6]' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between max-w-md mx-auto mt-2 text-sm text-gray-600">
            <span>Chi tiết</span>
            <span>Thanh toán</span>
            <span>Xác nhận</span>
          </div>
        </div>

        {/* Step 1: Appointment Details */}
        {step === 1 && (
          <Card className="shadow-xl border-none rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-6 h-6 text-[#0077B6]" />
                Thông Tin Lịch Hẹn
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Khoa *</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Chọn khoa" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Ngày Hẹn *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left rounded-xl">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formatDate(formData.date)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                          mode="single"
                          selected={formData.date}
                          onSelect={(date) => setFormData({ ...formData, date })}
                          disabled={(date) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today;
                          }}
                          initialFocus
                       />

                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Giờ Khám *</Label>
                  <Select
                    value={formData.timeSlot}
                    onValueChange={(value) => setFormData({ ...formData, timeSlot: value })}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Chọn giờ" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          <div className="flex items-center gap-2"><Clock className="w-4 h-4" />{slot}</div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Họ Và Tên *</Label>
                  <Input value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} placeholder="Nhập họ và tên" className="rounded-xl" />
                </div>

                <div className="space-y-2">
                  <Label>Số Điện Thoại *</Label>
                  <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="0123456789" className="rounded-xl" />
                </div>

                <div className="space-y-2">
                  <Label>Số CMND/CCCD *</Label>
                  <Input value={formData.idNumber} onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })} placeholder="Số CMND/CCCD tự động" className="rounded-xl" />
                </div>

                <div className="space-y-2">
                  <Label>Lý Do Khám</Label>
                  <Input value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} placeholder="Mô tả ngắn gọn (tùy chọn)" className="rounded-xl" />
                </div>
              </div>

              <Button onClick={() => setStep(2)} disabled={!formData.department || !formData.date || !formData.timeSlot || !formData.fullName || !formData.phone} className="w-full bg-[#0077B6] hover:bg-[#005a8c] text-white py-6 rounded-xl disabled:opacity-50">Tiếp Tục Thanh Toán</Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <Card className="shadow-xl border-none rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-[#0077B6]" />
                Thanh Toán Trước
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Appointment Summary */}
              <div className="bg-[#F5F5F5] rounded-2xl p-6 space-y-3">
                <h3 className="text-gray-900 mb-4">Tóm Tắt Lịch Hẹn</h3>
                <div className="flex justify-between"><span className="text-gray-600">Khoa:</span><span className="text-gray-900">{formData.department}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Ngày & Giờ:</span><span className="text-gray-900">{formatDate(formData.date)} - {formData.timeSlot}</span></div>
                <div className="border-t border-gray-300 pt-3 mt-3"><div className="flex justify-between"><span className="text-gray-900">Phí Khám:</span><span className="text-[#0077B6]">{consultationFee.toLocaleString()} VNĐ</span></div></div>
              </div>

              {/* Payment Method */}
              <div className="space-y-4">
                <Label>Phương Thức Thanh Toán</Label>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="border-2 border-[#0077B6] rounded-xl p-4 text-center cursor-pointer bg-[#0077B6]/5" onClick={() => handlePayment('visa')}>
                    <div className="text-gray-900">Thẻ Visa</div>
                  </div>
                  <div className="border-2 border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-[#0077B6]" onClick={() => handlePayment('banking')}>
                    <div className="text-gray-600">Ứng dụng ngân hàng</div>
                  </div>
                  <div className="border-2 border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-[#0077B6]" onClick={() => handlePayment('counter')}>
                    <div className="text-gray-600">Thanh toán tại quầy</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={() => setStep(1)} variant="outline" className="flex-1 border-[#0077B6] text-[#0077B6] hover:bg-[#0077B6]/5 py-6 rounded-xl">Quay Lại</Button>
                <Button onClick={() => handlePayment('visa')} className="flex-1 bg-[#0077B6] hover:bg-[#005a8c] text-white py-6 rounded-xl">Thanh Toán {consultationFee.toLocaleString()} VNĐ</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Confirmation with QR Code */}
        {step === 3 && paymentComplete && (
          <Card className="shadow-xl border-none rounded-2xl">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              
              <div>
                <h2 className="text-gray-900 mb-2">Đã Xác Nhận Lịch Hẹn!</h2>
                <p className="text-gray-600">Lịch hẹn của bạn đã được đặt và thanh toán thành công.</p>
              </div>

              <div className="bg-[#F5F5F5] rounded-2xl p-8 max-w-md mx-auto">
                <div className="w-full flex justify-center mb-4">
                  <div className="rounded-2xl border-4 border-[#0077B6] p-3 bg-transparent">
                    <div className="bg-white p-4 rounded-lg">
                      <img src={qrSrc} alt="QR" className="w-40 h-40 mx-auto mb-3" onError={(e: any) => { e.currentTarget.onerror = null; e.currentTarget.src = '/src/assets/qr-sample.svg'; }} />
                      <div className="text-xs text-gray-500 font-mono text-center">{qrCode}</div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">Xuất trình mã QR này khi check-in để bỏ qua hàng chờ đăng ký</p>
              </div>

              <div className="bg-gradient-to-r from-[#0077B6]/10 to-[#00B4D8]/10 rounded-2xl p-6 text-left max-w-md mx-auto">
                <h3 className="text-gray-900 mb-4">Lịch Hẹn Của Bạn</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between"><span>Khoa:</span><span className="text-gray-900">{formData.department}</span></div>
                  <div className="flex justify-between"><span>Ngày:</span><span className="text-gray-900">{formatDate(formData.date)}</span></div>
                  <div className="flex justify-between"><span>Giờ:</span><span className="text-gray-900">{formData.timeSlot}</span></div>
                  <div className="flex justify-between"><span>Số Thứ Tự:</span><span className="text-[#0077B6]">A-12</span></div>
                </div>
              </div>

              <div className="space-y-3">
                <Button onClick={() => { const link = document.createElement('a'); link.href = qrSrc; link.download = 'appointment-qr.png'; document.body.appendChild(link); link.click(); link.remove(); }} className="w-full max-w-md bg-[#0077B6] hover:bg-[#005a8c] text-white py-6 rounded-xl">
                  <Download className="mr-2 w-5 h-5" />
                  Tải Mã QR
                </Button>
                <p className="text-gray-500 text-sm">Tin nhắn xác nhận đã được gửi đến {formData.phone}</p>
              </div>

              <Card className="bg-[#F5F5F5] border-none rounded-2xl max-w-md mx-auto mb-8">
                <CardContent className="p-6">
                  <h3 className="text-gray-900 mb-3">Các Bước Tiếp Theo</h3>
                  <ol className="space-y-2 text-gray-600 list-decimal list-inside">
                    <li>Lưu hoặc chụp màn hình mã QR của bạn</li>
                    <li>Đến trước 10 phút so với giờ hẹn</li>
                    <li>Quét mã QR tại quầy check-in</li>
                    <li>Vào thẳng khoa {formData.department}</li>
                  </ol>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button onClick={() => { sessionStorage.setItem('workflowStep', '3'); navigate('/check-in'); }} className="flex-1 bg-[#0077B6] text-white rounded-xl py-4">Hoàn thành bước và tới Check-in</Button>
                <Button variant="outline" onClick={() => navigate('/')} className="flex-1 rounded-xl">Về Trang Chủ</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}