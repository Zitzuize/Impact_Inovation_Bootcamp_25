import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Shield, User, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Demo accounts
  const accounts = [
    { username: 'doctor1', password: '123123', role: 'doctor', display: 'Bác sĩ (doctor1)' },
    { username: 'patient1', password: '123123', role: 'patient', display: 'Bệnh nhân (patient1)' },
  ];

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');

    const account = accounts.find(a => a.username === username && a.password === password);
    if (!account) {
      setError('Tên đăng nhập hoặc mật khẩu không đúng');
      return;
    }

    // Set session and redirect based on role
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('username', account.username);
    sessionStorage.setItem('role', account.role);

    if (account.role === 'doctor') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F5F5F5] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-[#0077B6] to-[#00B4D8] rounded-3xl mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <span className="text-white text-2xl">199</span>
            </div>
          </div>
          <h1 className="text-gray-900 mb-2">Đăng Nhập</h1>
          <p className="text-gray-600">Sử dụng tài khoản demo để vào giao diện tương ứng</p>
        </div>

        <Card className="shadow-2xl border-none rounded-3xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 justify-center">
              <LogIn className="w-6 h-6 text-[#0077B6]" />
              Đăng Nhập
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Tên Đăng Nhập</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="rounded-xl pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Mật Khẩu</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-xl pl-10"
                  />
                </div>
              </div>

              {error && <div className="text-red-500 text-sm">{error}</div>}

              <Button type="submit" className="w-full bg-gradient-to-r from-[#0077B6] to-[#00B4D8] text-white py-4 rounded-xl">
                Đăng nhập
              </Button>

              <div className="text-sm text-gray-500 text-center">Tài khoản mẫu: doctor1 / 123123 (bác sĩ) — patient1 / 123123 (bệnh nhân)</div>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6 bg-gradient-to-r from-[#0077B6]/10 to-[#00B4D8]/10 border-[#0077B6]/20 rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-[#0077B6] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600">Thông tin demo chỉ dùng cho mục đích phát triển. Dữ liệu thực tế sẽ yêu cầu xác thực an toàn.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
