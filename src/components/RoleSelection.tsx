import { useNavigate } from 'react-router-dom';
import { Navigation } from './Navigation';
import { Users, Shield, ArrowRight, Lock, UserCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

export function RoleSelection() {
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'civilian' | 'cbcs') => {
    // Store role in sessionStorage for later use
    sessionStorage.setItem('userRole', role);
    sessionStorage.setItem('workflowStep', '0');
    navigate('/ai-suggestion');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F5F5F5]">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-12">
          <div className="inline-block p-3 bg-[#0077B6]/10 rounded-2xl mb-6">
            <UserCheck className="w-12 h-12 text-[#0077B6]" />
          </div>
          <h1 className="text-gray-900 mb-4">Chào Mừng Đến 199 Smart Health Hub</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Vui lòng chọn loại đăng ký để đảm bảo xử lý dữ liệu bảo mật và phù hợp
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Civilian/BHYT Card */}
          <Card 
            className="border-2 border-transparent hover:border-[#0077B6] transition-all cursor-pointer group bg-white rounded-2xl shadow-lg hover:shadow-2xl"
            onClick={() => handleRoleSelect('civilian')}
          >
            <CardContent className="p-8 md:p-10">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-24 h-24 bg-gradient-to-br from-[#0077B6] to-[#00B4D8] rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-12 h-12 text-white" />
                </div>
                
                <div>
                  <h2 className="text-gray-900 mb-3">Dân Sự / BHYT</h2>
                  <p className="text-gray-600">
                    Dành cho bệnh nhân thường có hoặc không có bảo hiểm y tế (BHYT)
                  </p>
                </div>

                <div className="w-full space-y-3 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#00B4D8]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-[#00B4D8] rounded-full"></div>
                    </div>
                    <span className="text-gray-600">Quy trình đăng ký tiêu chuẩn</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#00B4D8]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-[#00B4D8] rounded-full"></div>
                    </div>
                    <span className="text-gray-600">Hỗ trợ bảo hiểm y tế</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#00B4D8]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-[#00B4D8] rounded-full"></div>
                    </div>
                    <span className="text-gray-600">Hạ tầng dữ liệu bảo mật</span>
                  </div>
                </div>

                <Button 
                  className="w-full bg-[#0077B6] hover:bg-[#005a8c] text-white py-6 rounded-xl group-hover:bg-[#005a8c]"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRoleSelect('civilian');
                  }}
                >
                  Đăng Ký Dân Sự
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* CBCS/Police Family Card */}
          <Card 
            className="border-2 border-transparent hover:border-[#00B4D8] transition-all cursor-pointer group bg-white rounded-2xl shadow-lg hover:shadow-2xl"
            onClick={() => handleRoleSelect('cbcs')}
          >
            <CardContent className="p-8 md:p-10">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-24 h-24 bg-gradient-to-br from-[#00B4D8] to-[#0077B6] rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Shield className="w-12 h-12 text-white" />
                </div>
                
                <div>
                  <h2 className="text-gray-900 mb-3">CBCS / Gia Đình Công An</h2>
                  <p className="text-gray-600">
                    Dành cho cán bộ chiến sĩ công an và thành viên gia đình với yêu cầu dữ liệu mật
                  </p>
                </div>

                <div className="w-full space-y-3 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#0077B6]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Lock className="w-3 h-3 text-[#0077B6]" />
                    </div>
                    <span className="text-gray-600">Đường truyền dữ liệu mã hóa</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#0077B6]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Lock className="w-3 h-3 text-[#0077B6]" />
                    </div>
                    <span className="text-gray-600">Hạ tầng bảo mật riêng biệt</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#0077B6]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Lock className="w-3 h-3 text-[#0077B6]" />
                    </div>
                    <span className="text-gray-600">Bảo vệ quyền riêng tư nâng cao</span>
                  </div>
                </div>

                <Button 
                  className="w-full bg-[#00B4D8] hover:bg-[#0096b8] text-white py-6 rounded-xl group-hover:bg-[#0096b8]"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRoleSelect('cbcs');
                  }}
                >
                  Đăng Ký CBCS
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Notice */}
        <div className="mt-12 max-w-3xl mx-auto">
          <Card className="bg-gradient-to-r from-[#0077B6]/5 to-[#00B4D8]/5 border-[#0077B6]/20 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#0077B6] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-gray-900 mb-2">Dữ Liệu Của Bạn Được Bảo Mật</h3>
                  <p className="text-gray-600">
                    Tất cả dữ liệu bệnh nhân được lưu trữ trên hạ tầng nội bộ với mã hóa cấp quân sự. 
                    Dữ liệu CBCS được xử lý qua đường truyền mã hóa hoàn toàn riêng biệt để đảm bảo 
                    tính bảo mật tối đa và tuân thủ các quy định an ninh.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
