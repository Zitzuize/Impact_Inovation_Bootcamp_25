import { Link } from 'react-router-dom';
import { Navigation } from './Navigation';
import { Calendar, Shield, Clock, Star, ArrowRight, Smartphone, Users, Activity } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

export function HomePage() {
  const features = [
    {
      icon: Calendar,
      title: 'Lịch Hẹn Thông Minh',
      description: 'AI tư vấn khoa khám và đặt lịch hẹn ngay lập tức',
      color: '#0077B6',
    },
    {
      icon: Shield,
      title: 'Bảo Mật & Riêng Tư',
      description: 'Hạ tầng nội bộ với đường truyền mã hóa dữ liệu CBCS',
      color: '#00B4D8',
    },
    {
      icon: Clock,
      title: 'Bỏ Qua Hàng Chờ',
      description: 'Thanh toán trước và check-in bằng mã QR. Vào thẳng phòng khám',
      color: '#0077B6',
    },
    {
      icon: Star,
      title: 'Chăm Sóc Tốt Hơn',
      description: 'Quản lý hàng đợi thời gian thực và đồng bộ lịch bác sĩ',
      color: '#00B4D8',
    },
  ];

  const stats = [
    { value: '50%', label: 'Giảm Thời Gian Chờ' },
    { value: '100%', label: 'Bảo Mật Dữ Liệu' },
    { value: '24/7', label: 'Đặt Lịch Online' },
    { value: '5★', label: 'Đánh Giá Bệnh Nhân' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F5F5F5]">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-[#00B4D8]/10 rounded-full text-[#0077B6]">
                Phối Hợp Thông Minh Cho Y Tế An Toàn
              </div>
              <h1 className="text-gray-900">
                Bỏ Qua Hàng Chờ.<br />
                Được Chăm Sóc Tốt Hơn.
              </h1>
              <p className="text-gray-600 text-lg">
                199 Smart Health Hub giúp loại bỏ tình trạng tắc nghẽn, giảm thời gian chờ đợi, 
                và bảo vệ dữ liệu y tế của bạn với công nghệ phối hợp bệnh viện tiên tiến.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/role-selection">
                  <Button className="bg-[#0077B6] hover:bg-[#005a8c] text-white px-8 py-6 rounded-xl">
                    Bắt Đầu
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/book-appointment">
                  <Button variant="outline" className="border-[#0077B6] text-[#0077B6] hover:bg-[#0077B6]/5 px-8 py-6 rounded-xl">
                    Đặt Lịch Hẹn
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0077B6]/20 to-[#00B4D8]/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#0077B6] rounded-2xl flex items-center justify-center">
                      <Activity className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <div className="text-gray-500 text-sm">Hoạt Động Hôm Nay</div>
                      <div className="text-gray-900 text-2xl">1,234 Bệnh Nhân</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-gray-700">Tim Mạch</span>
                      </div>
                      <span className="text-[#0077B6]">5 phút</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-gray-700">Tiêu Hóa</span>
                      </div>
                      <span className="text-[#0077B6]">12 phút</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                        <span className="text-gray-700">Chấn Thương Chỉnh Hình</span>
                      </div>
                      <span className="text-[#0077B6]">23 phút</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#0077B6] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-white text-4xl md:text-5xl mb-2">{stat.value}</div>
                <div className="text-[#00B4D8]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-gray-900 mb-4">Tại Sao Chọn 199 Smart Health Hub?</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Được xây dựng để giải quyết các vấn đề thực tế của bệnh viện: tắc nghẽn, chờ đợi lâu và rủi ro bảo mật dữ liệu.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white rounded-2xl">
                  <CardContent className="p-6">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${feature.color}15` }}
                    >
                      <Icon className="w-7 h-7" style={{ color: feature.color }} />
                    </div>
                    <h3 className="text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-gray-900 mb-4">Cách Hoạt Động</h2>
            <p className="text-gray-600 text-lg">Đơn giản, nhanh chóng và bảo mật</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#0077B6] text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                1
              </div>
              <h3 className="text-gray-900 mb-3">Chọn Loại Đăng Ký</h3>
              <p className="text-gray-600">
                Chọn giữa Dân Sự/BHYT hoặc CBCS/Gia Đình Công An để xử lý dữ liệu bảo mật
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-[#00B4D8] text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                2
              </div>
              <h3 className="text-gray-900 mb-3">Đặt Lịch & Thanh Toán</h3>
              <p className="text-gray-600">
                AI gợi ý khoa phù hợp, đặt lịch hẹn và thanh toán trước phí khám
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-[#0077B6] text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                3
              </div>
              <h3 className="text-gray-900 mb-3">Bỏ Qua Hàng Chờ</h3>
              <p className="text-gray-600">
                Check-in bằng mã QR và vào thẳng cuộc hẹn khám bệnh của bạn
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#0077B6] to-[#00B4D8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Smartphone className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-white mb-4">Sẵn Sàng Trải Nghiệm Y Tế Thông Minh Hơn?</h2>
          <p className="text-white/90 text-lg mb-8">
            Tham gia cùng hàng nghìn bệnh nhân đã loại bỏ thời gian chờ đợi và cải thiện trải nghiệm bệnh viện.
          </p>
          <Link to="/role-selection">
            <Button className="bg-white text-[#0077B6] hover:bg-gray-100 px-8 py-6 rounded-xl text-lg">
              Bắt Đầu Hành Trình
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-[#0077B6] rounded-xl flex items-center justify-center">
                  <span>199</span>
                </div>
                <span>Smart Health Hub</span>
              </div>
              <p className="text-gray-400">
                Phối hợp thông minh cho y tế an toàn
              </p>
            </div>
            <div>
              <h4 className="mb-4">Liên Kết Nhanh</h4>
              <div className="space-y-2 text-gray-400">
                <div>Về Chúng Tôi</div>
                <div>Dịch Vụ</div>
                <div>Liên Hệ</div>
              </div>
            </div>
            <div>
              <h4 className="mb-4">Cho Bệnh Nhân</h4>
              <div className="space-y-2 text-gray-400">
                <div>Đặt Lịch Hẹn</div>
                <div>Xem Kết Quả</div>
                <div>Gửi Phản Hồi</div>
              </div>
            </div>
            <div>
              <h4 className="mb-4">Bảo Mật</h4>
              <div className="space-y-2 text-gray-400">
                <div>Hạ Tầng Nội Bộ</div>
                <div>Bảo Vệ Dữ Liệu CBCS</div>
                <div>Chính Sách Bảo Mật</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            © 2025 199 Smart Health Hub. Bảo lưu mọi quyền.
          </div>
        </div>
      </footer>
    </div>
  );
}
