import { Link, useLocation } from 'react-router-dom';
import { Calendar, QrCode, Settings, Menu, LogOut, User as UserIcon, Activity, Clipboard } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';

export function Navigation() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  const username = sessionStorage.getItem('username') || 'Người dùng';
  const role = sessionStorage.getItem('role') || '';
  
  const defaultNavItems = [
    { name: 'Trang chủ', path: '/', icon: Calendar },
    { name: 'Đặt lịch', path: '/book-appointment', icon: Calendar },
    { name: 'Check-in', path: '/check-in', icon: QrCode },
    { name: 'Theo dõi hành trình', path: '/tasks', icon: Activity },
  ];

  // For doctors: only show Admin dashboard (no home)
  const doctorNavItems = [
    { name: 'Lab Panel', path: '/admin', icon: Clipboard },
  ];

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '#/login';
  };

  const navToRender = role === 'patient' ? [] : (role === 'doctor' ? doctorNavItems : defaultNavItems);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#0077B6] rounded-xl flex items-center justify-center">
              <span className="text-white">199</span>
            </div>
            <span className="text-[#0077B6] hidden sm:inline">Smart Health Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navToRender.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#0077B6] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            {isLoggedIn ? (
              <div className="ml-4 flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-[#F5F5F5] rounded-lg">
                  <UserIcon className="w-4 h-4 text-[#0077B6]" />
                  <span className="text-sm text-gray-700">{username}</span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="rounded-lg"
                  size="sm"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button className="ml-4 bg-[#0077B6] hover:bg-[#005a8c] text-white rounded-lg">
                  Đăng nhập
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="w-6 h-6 text-gray-700" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#0077B6] rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">199</span>
                    </div>
                    Menu
                  </SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 space-y-2">
                  {isLoggedIn && (
                    <div className="mb-4 p-3 bg-[#F5F5F5] rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <UserIcon className="w-4 h-4 text-[#0077B6]" />
                        <span className="text-sm text-gray-900">{username}</span>
                      </div>
                      <div className="text-xs text-gray-600">Tài khoản đã đăng nhập</div>
                    </div>
                  )}
                  
                  {navToRender.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                          isActive
                            ? 'bg-[#0077B6] text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                  
                  <div className="pt-4 mt-4 border-t border-gray-200">
                    {isLoggedIn ? (
                      <Button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleLogout();
                        }}
                        variant="outline"
                        className="w-full justify-start gap-3 px-4 py-3 rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-5 h-5" />
                        Đăng xuất
                      </Button>
                    ) : (
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full bg-[#0077B6] hover:bg-[#005a8c] text-white rounded-xl">
                          Đăng nhập
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}