import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from './Navigation';
import { Star, Send, CheckCircle, ThumbsUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

export function FeedbackRating() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [ratings, setRatings] = useState({
    overall: 0,
    doctor: 0,
    staff: 0,
    facilities: 0,
    waitTime: 0,
  });
  const [hoveredRating, setHoveredRating] = useState({
    overall: 0,
    doctor: 0,
    staff: 0,
    facilities: 0,
    waitTime: 0,
  });
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const appointmentDetails = {
    date: '8 tháng 11 năm 2025',
    department: 'Tim Mạch',
    doctor: 'BS. Nguyễn Văn A',
    queueNumber: 'A-12',
  };

  const ratingCategories = [
    { key: 'overall', label: 'Trải Nghiệm Tổng Thể', icon: '⭐' },
    { key: 'doctor', label: 'Tư Vấn Bác Sĩ', icon: '👨‍⚕️' },
    { key: 'staff', label: 'Dịch Vụ Nhân Viên', icon: '👥' },
    { key: 'facilities', label: 'Cơ Sở Vật Chất & Vệ Sinh', icon: '🏥' },
    { key: 'waitTime', label: 'Quản Lý Thời Gian Chờ', icon: '⏱️' },
  ];

  const handleRating = (category: keyof typeof ratings, rating: number) => {
    setRatings({ ...ratings, [category]: rating });
  };

  const handleSubmit = () => {
    // Simulate submission
    setTimeout(() => {
      setSubmitted(true);
      // reset workflow so user can start again next time
      sessionStorage.removeItem('workflowStep');
    }, 1000);
  };

  const canSubmit = ratings.overall > 0 && ratings.doctor > 0 && ratings.staff > 0;

  const getRatingText = (rating: number) => {
    if (rating === 0) return '';
    if (rating === 1) return 'Kém';
    if (rating === 2) return 'Trung Bình';
    if (rating === 3) return 'Tốt';
    if (rating === 4) return 'Rất Tốt';
    if (rating === 5) return 'Xuất Sắc';
    return '';
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-[#F5F5F5]">
        <Navigation />
        
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <Card className="shadow-xl border-none rounded-2xl text-center">
            <CardContent className="p-12">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-14 h-14 text-white" />
              </div>
              
              <h1 className="text-gray-900 mb-4">Cảm Ơn Phản Hồi Của Bạn!</h1>
              <p className="text-gray-600 text-lg mb-8">
                Phản hồi của bạn giúp chúng tôi cải thiện dịch vụ và mang lại sự chăm sóc tốt hơn cho tất cả bệnh nhân.
              </p>

              {/* Summary */}
              <div className="bg-[#F5F5F5] rounded-2xl p-6 max-w-md mx-auto mb-8">
                <h3 className="text-gray-900 mb-4">Đánh Giá Của Bạn</h3>
                <div className="space-y-3">
                  {ratingCategories.map((category) => (
                    <div key={category.key} className="flex items-center justify-between">
                      <span className="text-gray-700">{category.label}</span>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < ratings[category.key as keyof typeof ratings]
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Card className="bg-gradient-to-r from-[#0077B6]/10 to-[#00B4D8]/10 border-[#0077B6]/20 rounded-2xl max-w-lg mx-auto mb-8">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <ThumbsUp className="w-6 h-6 text-[#0077B6] flex-shrink-0 mt-1" />
                    <div className="text-left">
                      <h3 className="text-gray-900 mb-2">Nhận Điểm Thưởng!</h3>
                      <p className="text-gray-600">
                        Bạn đã nhận được 50 điểm thưởng cho việc cung cấp phản hồi. Sử dụng những điểm này 
                        để được giảm giá cho các lần khám tiếp theo.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  type="button"
                  onClick={() => navigate('/')}
                  className="relative z-20 bg-[#0077B6] hover:bg-[#005a8c] text-white px-8 py-6 rounded-xl"
                >
                  Về Trang Chủ
                </Button>
                <Button 
                  type="button"
                  onClick={() => navigate('/book-appointment')}
                  variant="outline"
                  className="relative z-20 border-[#0077B6] text-[#0077B6] hover:bg-[#0077B6]/5 px-8 py-6 rounded-xl"
                >
                  Đặt Lịch Hẹn Khác
                </Button>
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
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-[#0077B6]/10 rounded-2xl mb-4">
            <Star className="w-10 h-10 text-[#0077B6]" />
          </div>
          <h1 className="text-gray-900 mb-2">Đánh Giá Chuyến Khám</h1>
          <p className="text-gray-600">Phản hồi của bạn giúp chúng tôi phục vụ bạn tốt hơn</p>
        </div>

        {/* Visit Summary */}
        <Card className="mb-8 bg-gradient-to-r from-[#0077B6]/5 to-[#00B4D8]/5 border-[#0077B6]/20 rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-gray-900 mb-4">Chuyến Khám Gần Đây</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#0077B6] rounded-full"></div>
                <div>
                  <div className="text-gray-600 text-sm">Ngày</div>
                  <div className="text-gray-900">{appointmentDetails.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#0077B6] rounded-full"></div>
                <div>
                  <div className="text-gray-600 text-sm">Khoa</div>
                  <div className="text-gray-900">{appointmentDetails.department}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#0077B6] rounded-full"></div>
                <div>
                  <div className="text-gray-600 text-sm">Bác Sĩ</div>
                  <div className="text-gray-900">{appointmentDetails.doctor}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#0077B6] rounded-full"></div>
                <div>
                  <div className="text-gray-600 text-sm">Số Thứ Tự</div>
                  <div className="text-gray-900">{appointmentDetails.queueNumber}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rating Form */}
        <Card className="shadow-xl border-none rounded-2xl mb-8">
          <CardHeader>
            <CardTitle>Vui Lòng Đánh Giá Trải Nghiệm Của Bạn</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {ratingCategories.map((category) => (
              <div key={category.key} className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div className="flex-1">
                    <Label className="text-gray-900">{category.label}</Label>
                    {ratings[category.key as keyof typeof ratings] > 0 && (
                      <div className="text-sm text-[#0077B6]">
                        {getRatingText(ratings[category.key as keyof typeof ratings])}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 md:gap-3">
                  {Array.from({ length: 5 }).map((_, index) => {
                    const starValue = index + 1;
                    const isHovered = hoveredRating[category.key as keyof typeof hoveredRating] >= starValue;
                    const isSelected = ratings[category.key as keyof typeof ratings] >= starValue;
                    
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleRating(category.key as keyof typeof ratings, starValue)}
                        onMouseEnter={() => setHoveredRating({ ...hoveredRating, [category.key]: starValue })}
                        onMouseLeave={() => setHoveredRating({ ...hoveredRating, [category.key]: 0 })}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-10 h-10 md:w-12 md:h-12 transition-colors ${
                            isSelected || isHovered
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300 hover:text-gray-400'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Comments */}
            <div className="space-y-3 pt-6 border-t border-gray-200">
              <Label>Nhận Xét Thêm (Tùy Chọn)</Label>
              <Textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Chia sẻ thêm về trải nghiệm của bạn..."
                className="min-h-32 rounded-xl resize-none"
              />
              <p className="text-sm text-gray-500">
                Nhận xét của bạn sẽ giúp chúng tôi xác định các lĩnh vực cần cải thiện
              </p>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="w-full bg-[#0077B6] hover:bg-[#005a8c] text-white py-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="mr-2 w-5 h-5" />
              Gửi Phản Hồi
            </Button>

            {!canSubmit && (
              <p className="text-sm text-center text-gray-500">
                Vui lòng đánh giá ít nhất Trải Nghiệm Tổng Thể, Bác Sĩ và Nhân Viên để gửi
              </p>
            )}
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <Card className="bg-[#F5F5F5] border-none rounded-2xl">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 text-sm">
              Phản hồi của bạn là ẩn danh và chỉ được sử dụng để cải thiện dịch vụ y tế của chúng tôi. 
              Chúng tôi coi trọng quyền riêng tư của bệnh nhân và bảo vệ tất cả thông tin được gửi.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
