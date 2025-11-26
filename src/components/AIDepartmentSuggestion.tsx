import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from './Navigation';
import { Bot, Send, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';

interface Message {
  type: 'user' | 'ai';
  text: string;
  department?: string;
}

export function AIDepartmentSuggestion() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'ai',
      text: 'Xin chào! Tôi là trợ lý y tế AI của bạn. Tôi sẽ giúp bạn tìm đúng khoa cho chuyến khám. Vui lòng mô tả các triệu chứng hoặc cho biết bạn cảm thấy đau ở đâu.',
    },
  ]);
  const [input, setInput] = useState('');
  const [suggestedDepartment, setSuggestedDepartment] = useState<string | null>(null);

  useEffect(() => {
    // Prevent accessing this step if workflowStep is ahead or not initialized
    const step = Number(sessionStorage.getItem('workflowStep') || '0');
    if (step > 0) {
      // already past AI step, allow access
      return;
    }
    // ensure workflow step is 0 when user reaches here
    sessionStorage.setItem('workflowStep', '0');
  }, []);

  const departmentKeywords = {
    'Tim Mạch': ['tim', 'ngực đau', 'hồi hộp', 'khó thở', 'tim đập', 'huyết áp'],
    'Tiêu Hóa': ['dạ dày', 'bụng', 'tiêu hóa', 'buồn nôn', 'nôn', 'tiêu chảy', 'táo bón'],
    'Chấn Thương Chỉnh Hình': ['xương', 'khớp', 'gãy', 'đau lưng', 'đầu gối', 'mắt cá', 'vai', 'cơ'],
    'Thần Kinh': ['đầu đau', 'đau nửa đầu', 'chóng mặt', 'co giật', 'tê', 'thần kinh'],
    'Da Liễu': ['da', 'phát ban', 'mụn', 'ngứa', 'dị ứng'],
    'Tai Mũi Họng': ['tai', 'mũi', 'họng', 'đau họng', 'thính giác', 'xoang'],
    'Mắt': ['mắt', 'thị lực', 'mờ', 'nhìn'],
    'Nhi Khoa': ['trẻ em', 'em bé', 'trẻ sơ sinh', 'con'],
  };

  const analyzeSymptons = (text: string): string => {
    const lowerText = text.toLowerCase();
    
    for (const [department, keywords] of Object.entries(departmentKeywords)) {
      for (const keyword of keywords) {
        if (lowerText.includes(keyword)) {
          return department;
        }
      }
    }
    
    return 'Nội Tổng Hợp';
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = { type: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);

    // Analyze and suggest department
    const department = analyzeSymptons(input);
    setSuggestedDepartment(department);

    // Add AI response
    setTimeout(() => {
      const aiMessage: Message = {
        type: 'ai',
        text: `Dựa trên các triệu chứng của bạn, tôi khuyên bạn nên đến khoa ${department}. Các chuyên gia ở đây sẽ có thể giúp bạn giải quyết vấn đề.`,
        department,
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);

    setInput('');
  };

  const quickSymptoms = [
    'Đau dạ dày',
    'Đau ngực',
    'Đau đầu',
    'Đau lưng',
    'Phát ban da',
    'Đau họng',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F5F5F5]">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-gradient-to-br from-[#0077B6] to-[#00B4D8] rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-gray-900 mb-2">Gợi Ý Khoa Khám Bằng AI</h1>
          <p className="text-gray-600">Cho chúng tôi biết triệu chứng và chúng tôi sẽ hướng dẫn bạn đến đúng chuyên khoa</p>
        </div>

        {/* Chat Container */}
        <Card className="mb-6 shadow-xl border-none rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            {/* Messages */}
            <div className="h-[400px] md:h-[500px] overflow-y-auto p-6 space-y-4 bg-white">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      message.type === 'ai'
                        ? 'bg-gradient-to-br from-[#0077B6] to-[#00B4D8]'
                        : 'bg-gray-200'
                    }`}
                  >
                    {message.type === 'ai' ? (
                      <Bot className="w-6 h-6 text-white" />
                    ) : (
                      <span className="text-gray-700 text-sm">Bạn</span>
                    )}
                  </div>
                  
                  <div
                    className={`max-w-[75%] p-4 rounded-2xl ${
                      message.type === 'ai'
                        ? 'bg-[#F5F5F5] text-gray-800'
                        : 'bg-[#0077B6] text-white'
                    }`}
                  >
                    <p>{message.text}</p>
                    {message.department && (
                      <div className="mt-3 pt-3 border-t border-gray-300">
                        <div className="text-sm opacity-75 mb-2">Khoa Khuyến Nghị:</div>
                        <div className="bg-white text-[#0077B6] px-4 py-2 rounded-xl inline-block">
                          {message.department}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Symptoms */}
            {messages.length === 1 && (
              <div className="px-6 pb-4 bg-white border-t border-gray-100">
                <p className="text-sm text-gray-600 mb-3">Lựa chọn nhanh:</p>
                <div className="flex flex-wrap gap-2">
                  {quickSymptoms.map((symptom, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="rounded-full border-[#0077B6]/30 text-[#0077B6] hover:bg-[#0077B6]/10"
                      onClick={() => {
                        setInput(symptom);
                        setTimeout(() => handleSend(), 100);
                      }}
                    >
                      {symptom}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-[#F5F5F5] border-t border-gray-200">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Mô tả các triệu chứng của bạn..."
                  className="flex-1 rounded-xl border-gray-300 focus:border-[#0077B6]"
                />
                <Button
                  onClick={handleSend}
                  className="bg-[#0077B6] hover:bg-[#005a8c] text-white px-6 rounded-xl"
                  disabled={!input.trim()}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {suggestedDepartment && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => {
                // advance workflow to booking
                sessionStorage.setItem('workflowStep', '1');
                navigate('/book-appointment', { state: { department: suggestedDepartment } });
              }}
              className="bg-[#0077B6] hover:bg-[#005a8c] text-white px-8 py-6 rounded-xl"
            >
              Đặt Lịch Hẹn
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              onClick={() => {
                setSuggestedDepartment(null);
                setMessages([messages[0]]);
              }}
              variant="outline"
              className="border-[#0077B6] text-[#0077B6] hover:bg-[#0077B6]/5 px-8 py-6 rounded-xl"
            >
              Hỏi Lại
            </Button>
          </div>
        )}

        {/* Info Card */}
        <Card className="mt-8 bg-gradient-to-r from-[#00B4D8]/10 to-[#0077B6]/10 border-[#0077B6]/20 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Bot className="w-8 h-8 text-[#0077B6] flex-shrink-0" />
              <div>
                <h3 className="text-gray-900 mb-2">AI Giúp Bạn Như Thế Nào</h3>
                <p className="text-gray-600">
                  AI của chúng tôi phân tích các triệu chứng bằng cơ sở dữ liệu y tế và hướng bạn đến 
                  khoa phù hợp nhất. Điều này giúp giảm thời gian chờ đợi và đảm bảo bạn gặp đúng 
                  chuyên gia ngay từ lần khám đầu tiên.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
