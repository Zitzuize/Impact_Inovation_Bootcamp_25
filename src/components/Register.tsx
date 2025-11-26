import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Shield, User, Lock, Calendar as CalendarIcon, MapPin, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cccdId: '',
    fullName: '',
    phone: '',
    dateOfBirth: undefined as Date | undefined,
    address: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    cccdId: '',
    fullName: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const validateForm = () => {
    const newErrors = {
      cccdId: '',
      fullName: '',
      phone: '',
      dateOfBirth: '',
      address: '',
      username: '',
      password: '',
      confirmPassword: '',
    };

    if (!formData.cccdId.trim()) {
      newErrors.cccdId = 'Vui lòng nhập số CMND/CCCD';
    } else if (formData.cccdId.length !== 12) {
      newErrors.cccdId = 'Số CMND/CCCD phải có 12 chữ số';
    }

    if (!formData.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ và tên';
    if (!/^0\d{9}$/.test(formData.phone)) newErrors.phone = 'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Vui lòng chọn ngày sinh';
    if (!formData.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ';
    if (!formData.username.trim()) newErrors.username = 'Vui lòng nhập tên đăng nhập';
    if (!formData.password) newErrors.password = 'Vui lòng nhập mật khẩu';
    else if (formData.password.length !== 6) newErrors.password = 'Mật khẩu phải có đúng 6 số';
    else if (!/^\d+$/.test(formData.password)) newErrors.password = 'Mật khẩu chỉ được chứa số';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Mật khẩu không khớp';

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('username', formData.username);
      sessionStorage.setItem('fullName', formData.fullName);
      sessionStorage.setItem('cccd', formData.cccdId);
      // Redirect to login page after successful registration
      navigate('/login');
    }
  };

  const handlePasswordChange = (field: 'password' | 'confirmPassword', value: string) => {
    if (value === '' || (/^\d+$/.test(value) && value.length <= 6)) {
      setFormData({ ...formData, [field]: value });
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Chọn ngày sinh';
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F5F5F5] py-8 px-4">
      <div className="w-full max-w-2xl mx-auto">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <Link to="/login" className="inline-block p-4 bg-gradient-to-br from-[#0077B6] to-[#00B4D8] rounded-3xl mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <span className="text-white text-2xl">199</span>
            </div>
          </Link>
          <h1 className="text-gray-900 mb-2">Đăng Ký Tài Khoản</h1>
          <p className="text-gray-600">Tạo tài khoản mới để sử dụng dịch vụ</p>
        </div>

        <Card className="shadow-2xl border-none rounded-3xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 justify-center">
              <UserPlus className="w-6 h-6 text-[#0077B6]" />
              Thông Tin Đăng Ký
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-6">
              {/* Registration Method Tabs */}
              

              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-2 md:col-span-2">
                  <Label>Họ Và Tên *</Label>
                  <Input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className={`rounded-xl ${errors.fullName ? 'border-red-500' : ''}`}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm">{errors.fullName}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label>Số Điện Thoại *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="tel"
                      placeholder="0123456789"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      maxLength={10}
                      className={`rounded-xl pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-sm">{errors.phone}</p>
                  )}
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <Label>Ngày Sinh *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={`w-full justify-start text-left rounded-xl ${errors.dateOfBirth ? 'border-red-500' : ''}`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formatDate(formData.dateOfBirth)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.dateOfBirth}
                        onSelect={(date) => setFormData({ ...formData, dateOfBirth: date })}
                        disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                        defaultMonth={new Date(2000, 0)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.dateOfBirth && (
                    <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>
                  )}
                </div>

                {/* Address */}
                <div className="space-y-2 md:col-span-2">
                  <Label>Địa Chỉ *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className={`rounded-xl pl-10 ${errors.address ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.address && (
                    <p className="text-red-500 text-sm">{errors.address}</p>
                  )}
                </div>
              </div>

              {/* Account Information */}
              <div className="pt-4 border-t border-gray-200 space-y-4">
                <h3 className="text-gray-900">Thông Tin Tài Khoản</h3>
                
                {/* Username */}
                <div className="space-y-2">
                  <Label>Tên Đăng Nhập *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Chọn tên đăng nhập"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className={`rounded-xl pl-10 ${errors.username ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.username && (
                    <p className="text-red-500 text-sm">{errors.username}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Password */}
                  <div className="space-y-2">
                    <Label>Mật Khẩu (6 số) *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="password"
                        placeholder="••••••"
                        value={formData.password}
                        onChange={(e) => handlePasswordChange('password', e.target.value)}
                        maxLength={6}
                        inputMode="numeric"
                        className={`rounded-xl pl-10 ${errors.password ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm">{errors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label>Xác Nhận Mật Khẩu *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="password"
                        placeholder="••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                        maxLength={6}
                        inputMode="numeric"
                        className={`rounded-xl pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2">
                <input type="checkbox" required className="mt-1" />
                <p className="text-sm text-gray-600">
                  Tôi đồng ý với{' '}
                  <button type="button" className="text-[#0077B6] hover:underline">
                    Điều khoản sử dụng
                  </button>{' '}
                  và{' '}
                  <button type="button" className="text-[#0077B6] hover:underline">
                    Chính sách bảo mật
                  </button>{' '}
                  của 199 Smart Health Hub
                </p>
              </div>

              {/* Register Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#0077B6] to-[#00B4D8] hover:from-[#005a8c] hover:to-[#0096b8] text-white py-6 rounded-xl"
              >
                <UserPlus className="mr-2 w-5 h-5" />
                Đăng Ký Tài Khoản
              </Button>

              {/* Login Link */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-gray-600">
                  Đã có tài khoản?{' '}
                  <Link to="/login" className="text-[#0077B6] hover:underline">
                    Đăng nhập ngay
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="mt-6 bg-gradient-to-r from-[#0077B6]/10 to-[#00B4D8]/10 border-[#0077B6]/20 rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-[#0077B6] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600">
                Thông tin cá nhân của bạn được mã hóa và bảo mật theo tiêu chuẩn y tế cao nhất. 
                Chúng tôi cam kết bảo vệ quyền riêng tư của bạn.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}