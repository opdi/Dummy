import React, { useState } from 'react';
import { 
  MessageCircle, 
  Calendar, 
  Users, 
  Brain, 
  Mic, 
  Send, 
  Bell, 
  Shield, 
  Heart, 
  BookOpen,
  Activity,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles,
  Menu,
  X
} from 'lucide-react';

const MindsetApp = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { 
      type: 'ai', 
      message: "Hi Lovish! 👋 I'm Reva, your AI mental health companion. I'm here to listen, support, and help you navigate whatever you're going through. How are you feeling right now?", 
      time: '2:30 PM',
      mood: 'supportive',
      suggestions: ['I\'m feeling stressed', 'I\'m doing okay', 'I need someone to talk to', 'I\'m having a tough day']
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [moodScore, setMoodScore] = useState(7.2);
  const [sessionInsights, setSessionInsights] = useState({
    sentiment: 'positive',
    riskLevel: 'low',
    topics: ['academic stress', 'sleep'],
    recommendedActions: []
  });
  const [user] = useState({
    name: "Lovish",
    year: "Junior",
    lastSession: "2 days ago",
    riskLevel: "Low"
  });

  const analyzeMessage = (message) => {
    const stressKeywords = ['stressed', 'overwhelmed', 'pressure', 'anxious', 'worried'];
    const sadKeywords = ['sad', 'depressed', 'lonely', 'hopeless', 'down'];
    const crisisKeywords = ['hurt myself', 'end it all', 'can\'t go on', 'no point'];
    
    let sentiment = 'neutral';
    let riskLevel = 'low';
    let topics = [];
    
    const lowerMessage = message.toLowerCase();
    
    if (crisisKeywords.some(word => lowerMessage.includes(word))) {
      riskLevel = 'critical';
      sentiment = 'crisis';
    } else if (sadKeywords.some(word => lowerMessage.includes(word))) {
      sentiment = 'negative';
      riskLevel = 'moderate';
    } else if (stressKeywords.some(word => lowerMessage.includes(word))) {
      sentiment = 'stressed';
      topics.push('stress');
    }
    
    if (lowerMessage.includes('exam') || lowerMessage.includes('test') || lowerMessage.includes('study')) {
      topics.push('academic pressure');
    }
    if (lowerMessage.includes('sleep') || lowerMessage.includes('tired')) {
      topics.push('sleep issues');
    }
    if (lowerMessage.includes('friend') || lowerMessage.includes('relationship')) {
      topics.push('relationships');
    }
    
    return { sentiment, riskLevel, topics };
  };

  const generateAIResponse = (userMessage, analysis) => {
    const responses = {
      crisis: [
        "I'm really concerned about what you're sharing with me. Your safety is the most important thing right now. I'm connecting you with a crisis counselor immediately. You're not alone in this. 🚨",
        "Thank you for trusting me with these feelings. I want you to know that there are people who care and want to help. I'm alerting our crisis team right now. Please stay with me. 💙"
      ],
      negative: [
        "I hear how much pain you're in right now, and I want you to know that your feelings are completely valid. You've taken a brave step by sharing this with me. 💙",
        "It sounds like you're carrying a heavy emotional burden. I'm here to listen and support you through this difficult time. You don't have to face this alone.",
        "Thank you for opening up about these difficult feelings. Depression can feel overwhelming, but there are ways through this. Would you like to explore some coping strategies together?"
      ],
      stressed: [
        "I can sense you're feeling overwhelmed right now. Stress can feel consuming, but we can work through this together. What's been weighing on your mind the most?",
        "It sounds like you're dealing with a lot of pressure. Let's take a moment to acknowledge how hard you're working. What would help you feel more supported right now?",
        "Stress is your mind's way of saying you care deeply about things. That shows strength, even when it doesn't feel that way. What's one small thing we could do to help you feel more in control?"
      ],
      positive: [
        "I'm glad to hear there are positive aspects in your life right now! It's wonderful when we can recognize those moments. What's been bringing you joy lately?",
        "That's really encouraging to hear! It sounds like you're in a good headspace. How can we build on these positive feelings?"
      ],
      neutral: [
        "Thank you for sharing that with me. I'm here to listen and understand. Can you tell me more about what's been on your mind lately?",
        "I appreciate you opening up. Sometimes it helps just to have someone listen. What would be most helpful for you right now?",
        "I'm glad you're here talking with me. Every conversation is a step toward better mental health. What's been occupying your thoughts recently?"
      ]
    };
    
    const suggestions = {
      crisis: ['Connect with crisis counselor now', 'Call emergency services', 'Reach out to trusted friend'],
      negative: ['Schedule counselor session', 'Try breathing exercises', 'Explore mindfulness', 'Journal about feelings'],
      stressed: ['Practice deep breathing', 'Time management tips', 'Study break strategies', 'Talk to counselor'],
      positive: ['Continue positive habits', 'Share with community', 'Set new goals'],
      neutral: ['Mood check-in', 'Explore feelings', 'Self-care tips', 'Connect with others']
    };
    
    const category = analysis.sentiment || 'neutral';
    const responseArray = responses[category] || responses.neutral;
    const suggestionArray = suggestions[category] || suggestions.neutral;
    
    return {
      message: responseArray[Math.floor(Math.random() * responseArray.length)],
      suggestions: suggestionArray.slice(0, 3),
      mood: category
    };
  };

  const sendMessage = (messageText) => {
    const message = messageText || newMessage;
    if (!message.trim()) return;
    
    const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    setChatMessages(prev => [...prev, { 
      type: 'user', 
      message: message, 
      time: timestamp
    }]);
    setNewMessage('');
    setIsTyping(true);
    
    // Analyze user message
    const analysis = analyzeMessage(message);
    
    // Update session insights
    setSessionInsights(prev => ({
      ...prev,
      sentiment: analysis.sentiment,
      riskLevel: analysis.riskLevel,
      topics: [...new Set([...prev.topics, ...analysis.topics])]
    }));
    
    // Generate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(message, analysis);
      
      setChatMessages(prev => [...prev, { 
        type: 'ai', 
        message: aiResponse.message,
        suggestions: aiResponse.suggestions,
        mood: aiResponse.mood,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        analysis: analysis.riskLevel === 'critical' ? analysis : null
      }]);
      setIsTyping(false);
      
      // Update mood score based on conversation
      if (analysis.sentiment === 'positive') {
        setMoodScore(prev => Math.min(10, prev + 0.2));
      } else if (analysis.sentiment === 'negative') {
        setMoodScore(prev => Math.max(1, prev - 0.3));
      }
    }, 2000);
  };

  const startVoiceRecognition = () => {
    setIsListening(true);
    // Simulate voice recognition
    setTimeout(() => {
      setIsListening(false);
      setNewMessage("I've been feeling really overwhelmed with my exams lately");
    }, 3000);
  };

  const NavButton = ({ icon: Icon, label, view, badge }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setIsMobileMenuOpen(false);
      }}
      className={`flex items-center gap-3 w-full p-3 lg:p-4 rounded-xl transition-all duration-200 relative ${
        currentView === view 
          ? 'bg-blue-50 text-blue-600 shadow-sm' 
          : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      <Icon size={18} className="lg:w-5 lg:h-5" />
      <span className="font-medium text-sm lg:text-base">{label}</span>
      {badge && (
        <span className="absolute right-3 lg:right-4 bg-red-500 text-white text-xs rounded-full px-2 py-1">
          {badge}
        </span>
      )}
    </button>
  );

  const StatCard = ({ icon: Icon, title, value, subtitle, color = "blue" }) => {
    const colorClasses = {
      blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-600 bg-blue-500',
      green: 'from-green-50 to-green-100 border-green-200 text-green-600 bg-green-500',
      purple: 'from-purple-50 to-purple-100 border-purple-200 text-purple-600 bg-purple-500',
      pink: 'from-pink-50 to-pink-100 border-pink-200 text-pink-600 bg-pink-500'
    };

    const colors = colorClasses[color] || colorClasses.blue;
    
    return (
      <div className={`bg-gradient-to-br ${colors.split(' ')[0]} ${colors.split(' ')[1]} p-4 lg:p-6 rounded-xl lg:rounded-2xl border ${colors.split(' ')[2]}`}>
        <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-3">
          <div className={`p-1.5 lg:p-2 ${colors.split(' ')[4]} text-white rounded-lg`}>
            <Icon size={16} className="lg:w-5 lg:h-5" />
          </div>
          <h3 className="font-semibold text-gray-800 text-sm lg:text-base">{title}</h3>
        </div>
        <div className={`text-xl lg:text-2xl font-bold ${colors.split(' ')[3]} mb-1`}>{value}</div>
        <div className="text-xs lg:text-sm text-gray-600">{subtitle}</div>
      </div>
    );
  };

  // Mobile Header Component
  const MobileHeader = () => (
    <div className="lg:hidden bg-white border-b border-gray-200 p-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Brain className="text-white" size={18} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">Mindset</h1>
            <p className="text-xs text-gray-600">Mental Health Platform</p>
          </div>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </div>
  );

  // Mobile Navigation Overlay
  const MobileNavOverlay = () => (
    <div className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-300 ${
      isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
    }`}>
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
      <div className={`absolute right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ${
        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Mindset</h1>
                <p className="text-sm text-gray-600">Mental Health Platform</p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>
          
          <nav className="space-y-2">
            <NavButton icon={Activity} label="Dashboard" view="dashboard" />
            <NavButton icon={MessageCircle} label="AI Chat" view="chat" />
            <NavButton icon={Calendar} label="Book Session" view="booking" />
            <NavButton icon={Users} label="Community" view="community" />
            <NavButton icon={Bell} label="Alerts" view="alerts" badge="!" />
          </nav>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">{user.name}</h4>
                <p className="text-sm text-gray-600">{user.year} Student</p>
              </div>
              <Settings className="text-gray-400" size={18} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-4 lg:space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 lg:p-8 rounded-2xl lg:rounded-3xl">
        <div className="flex items-center gap-3 lg:gap-4 mb-4">
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Sparkles className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold">Welcome back, {user.name}</h1>
            <p className="opacity-90 text-sm lg:text-base">How are you feeling today?</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:gap-4">
          <button 
            onClick={() => setCurrentView('chat')}
            className="bg-white/20 backdrop-blur-sm px-4 lg:px-6 py-2 lg:py-3 rounded-lg lg:rounded-xl hover:bg-white/30 transition-all text-sm lg:text-base"
          >
            Start Conversation
          </button>
          <button 
            onClick={() => setCurrentView('booking')}
            className="bg-white text-blue-600 px-4 lg:px-6 py-2 lg:py-3 rounded-lg lg:rounded-xl hover:shadow-lg transition-all text-sm lg:text-base"
          >
            Book Session
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <StatCard 
          icon={Heart} 
          title="Mood Score" 
          value={moodScore.toFixed(1)} 
          subtitle="Above average this week" 
          color="green"
        />
        <StatCard 
          icon={Activity} 
          title="Check-ins" 
          value="12" 
          subtitle="This month" 
          color="blue"
        />
        <StatCard 
          icon={Calendar} 
          title="Next Session" 
          value="Tomorrow" 
          subtitle="2:00 PM with Dr. Ragini Sinha" 
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div className="bg-white p-4 lg:p-6 rounded-xl lg:rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="text-green-500" size={16} />
              <span className="text-sm">Completed mood check-in</span>
              <span className="text-xs text-gray-500 ml-auto">2h ago</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <MessageCircle className="text-blue-500" size={16} />
              <span className="text-sm">AI chat session completed</span>
              <span className="text-xs text-gray-500 ml-auto">1d ago</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <Calendar className="text-purple-500" size={16} />
              <span className="text-sm">Session booked with counselor</span>
              <span className="text-xs text-gray-500 ml-auto">2d ago</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 lg:p-6 rounded-xl lg:rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">Wellness Tools</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 lg:p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-md transition-all flex flex-col items-center justify-center min-h-[80px] lg:min-h-[100px]">
              <Brain className="text-blue-500 mb-2 lg:mb-3" size={24} />
              <div className="text-sm lg:text-base font-semibold text-blue-700">Mindfulness</div>
              <div className="text-xs text-blue-600 mt-1 text-center">Guided meditation</div>
            </button>
            <button className="p-4 lg:p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-md transition-all flex flex-col items-center justify-center min-h-[80px] lg:min-h-[100px]">
              <BookOpen className="text-green-500 mb-2 lg:mb-3" size={24} />
              <div className="text-sm lg:text-base font-semibold text-green-700">Journal</div>
              <div className="text-xs text-green-600 mt-1 text-center">Express thoughts</div>
            </button>
            <button className="p-4 lg:p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-md transition-all flex flex-col items-center justify-center min-h-[80px] lg:min-h-[100px]">
              <Activity className="text-purple-500 mb-2 lg:mb-3" size={24} />
              <div className="text-sm lg:text-base font-semibold text-purple-700">Mood Track</div>
              <div className="text-xs text-purple-600 mt-1 text-center">Daily check-ins</div>
            </button>
            <button className="p-4 lg:p-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl hover:shadow-md transition-all flex flex-col items-center justify-center min-h-[80px] lg:min-h-[100px]">
              <Heart className="text-pink-500 mb-2 lg:mb-3" size={24} />
              <div className="text-sm lg:text-base font-semibold text-pink-700">Self-Care</div>
              <div className="text-xs text-pink-600 mt-1 text-center">Wellness tips</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderChat = () => (
    <div className="space-y-4 lg:space-y-6">
      {/* Chat Interface */}
      <div className="bg-white rounded-2xl lg:rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Enhanced Header */}
        <div className="p-4 lg:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="relative">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Brain className="text-white" size={20} />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 lg:w-4 lg:h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="text-base lg:text-lg font-bold text-gray-800">Reva AI</h3>
                <p className="text-xs lg:text-sm text-green-600">🟢 Active & Learning</p>
                <p className="text-xs text-gray-500 hidden sm:block">Specialized in college mental health</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`text-xs lg:text-sm font-medium mb-1 ${
                sessionInsights.riskLevel === 'critical' ? 'text-red-600' :
                sessionInsights.riskLevel === 'moderate' ? 'text-yellow-600' : 'text-green-600'
              }`}>
                Risk: {sessionInsights.riskLevel}
              </div>
              <div className="text-xs text-gray-500">
                12:34
              </div>
            </div>
          </div>
          
          {/* Session Insights Bar */}
          <div className="mt-3 lg:mt-4 p-2 lg:p-3 bg-white/70 backdrop-blur-sm rounded-lg lg:rounded-xl">
            <div className="flex items-center gap-2 lg:gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${
                  sessionInsights.sentiment === 'positive' ? 'bg-green-500' :
                  sessionInsights.sentiment === 'negative' ? 'bg-red-500' :
                  sessionInsights.sentiment === 'stressed' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}></div>
                <span>Sentiment: {sessionInsights.sentiment}</span>
              </div>
              {sessionInsights.topics.length > 0 && (
                <div className="flex items-center gap-1 truncate">
                  <span className="truncate">Topics: {sessionInsights.topics.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Messages */}
        <div className="h-64 sm:h-80 lg:h-96 overflow-y-auto">
          <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs sm:max-w-sm ${msg.type === 'user' ? '' : 'space-y-2 lg:space-y-3'}`}>
                  {/* Message Bubble */}
                  <div className={`px-4 lg:px-6 py-3 lg:py-4 rounded-2xl lg:rounded-3xl shadow-sm ${
                    msg.type === 'user' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                      : msg.mood === 'crisis' 
                      ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-800 border border-red-200'
                      : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border border-gray-200'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className={`text-xs ${
                        msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {msg.time}
                      </p>
                      {msg.type === 'ai' && msg.mood && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          msg.mood === 'crisis' ? 'bg-red-200 text-red-700' :
                          msg.mood === 'negative' ? 'bg-yellow-200 text-yellow-700' :
                          msg.mood === 'supportive' ? 'bg-blue-200 text-blue-700' :
                          'bg-green-200 text-green-700'
                        }`}>
                          {msg.mood}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* AI Suggestions */}
                  {msg.type === 'ai' && msg.suggestions && (
                    <div className="flex flex-wrap gap-2 ml-2 lg:ml-4">
                      {msg.suggestions.map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => sendMessage(suggestion)}
                          className="px-2 lg:px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs rounded-full border border-blue-200 transition-all hover:shadow-sm"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Crisis Alert */}
                  {msg.analysis && msg.analysis.riskLevel === 'critical' && (
                    <div className="ml-2 lg:ml-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                      <div className="flex items-center gap-2 text-red-700">
                        <AlertTriangle size={16} />
                        <span className="text-xs font-medium">Crisis Alert Activated</span>
                      </div>
                      <p className="text-xs text-red-600 mt-1">Counselor has been notified automatically</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 lg:px-6 py-3 lg:py-4 rounded-2xl lg:rounded-3xl border border-gray-200">
                  <div className="flex items-center gap-2">
                    <Brain size={16} className="text-gray-400" />
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-xs text-gray-500 ml-2 hidden sm:inline">Reva is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Enhanced Input */}
        <div className="p-4 lg:p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-end gap-2 lg:gap-3">
            <button 
              onClick={startVoiceRecognition}
              className={`p-2 lg:p-3 rounded-lg lg:rounded-xl transition-all ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-white border border-gray-200 hover:border-blue-300 text-gray-600 hover:text-blue-600'
              }`}
            >
              <Mic size={18} className="lg:w-5 lg:h-5" />
            </button>
            
            <div className="flex-1 relative">
              <textarea
                placeholder={isListening ? "Listening..." : "Share what's on your mind..."}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white"
                rows="2"
                disabled={isListening}
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                Press Enter to send
              </div>
            </div>
            
            <button 
              onClick={() => sendMessage()}
              disabled={!newMessage.trim() || isListening}
              className="p-2 lg:p-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg lg:rounded-xl transition-all hover:shadow-lg"
            >
              <Send size={18} className="lg:w-5 lg:h-5" />
            </button>
          </div>
          
          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>🔒 End-to-end encrypted</span>
              <span className="hidden sm:inline">🧠 AI analyzing for your wellbeing</span>
            </div>
            <div>
              Mood: <span className="font-medium text-blue-600">{moodScore.toFixed(1)}/10</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* AI Analytics Panel */}
      <div className="bg-white p-4 lg:p-6 rounded-xl lg:rounded-2xl border border-gray-200 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Activity size={20} />
          Real-time AI Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="text-blue-500" size={16} />
              <span className="text-sm font-medium text-blue-800">Emotional State</span>
            </div>
            <div className="text-lg font-bold text-blue-600 capitalize">{sessionInsights.sentiment}</div>
            <div className="text-xs text-blue-600">Continuously monitored</div>
          </div>
          
          <div className={`p-4 rounded-xl ${
            sessionInsights.riskLevel === 'critical' ? 'bg-red-50' :
            sessionInsights.riskLevel === 'moderate' ? 'bg-yellow-50' : 'bg-green-50'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Shield className={
                sessionInsights.riskLevel === 'critical' ? 'text-red-500' :
                sessionInsights.riskLevel === 'moderate' ? 'text-yellow-500' : 'text-green-500'
              } size={16} />
              <span className={`text-sm font-medium ${
                sessionInsights.riskLevel === 'critical' ? 'text-red-800' :
                sessionInsights.riskLevel === 'moderate' ? 'text-yellow-800' : 'text-green-800'
              }`}>Risk Assessment</span>
            </div>
            <div className={`text-lg font-bold capitalize ${
              sessionInsights.riskLevel === 'critical' ? 'text-red-600' :
              sessionInsights.riskLevel === 'moderate' ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {sessionInsights.riskLevel}
            </div>
            <div className={`text-xs ${
              sessionInsights.riskLevel === 'critical' ? 'text-red-600' :
              sessionInsights.riskLevel === 'moderate' ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {sessionInsights.riskLevel === 'critical' ? 'Counselor alerted' : 'Safe range'}
            </div>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="text-purple-500" size={16} />
              <span className="text-sm font-medium text-purple-800">AI Confidence</span>
            </div>
            <div className="text-lg font-bold text-purple-600">94%</div>
            <div className="text-xs text-purple-600">High accuracy mode</div>
          </div>
        </div>
        
        {sessionInsights.topics.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm font-medium text-gray-700 mb-2">Detected Topics:</div>
            <div className="flex flex-wrap gap-2">
              {sessionInsights.topics.map((topic, i) => (
                <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderBooking = () => (
    <div className="space-y-4 lg:space-y-6">
      <div className="bg-white p-4 lg:p-6 rounded-xl lg:rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Book a Counseling Session</h2>
        
        {/* Session Type Toggle */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex-1 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl text-blue-700 font-medium transition-all hover:bg-blue-100">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Brain className="text-white" size={18} />
                </div>
                <span>On-Campus Sessions</span>
              </div>
              <p className="text-xs text-blue-600">Meet counselors at the student wellness center</p>
            </button>
            
            <button className="flex-1 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-green-700 font-medium transition-all hover:bg-green-100">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <Heart className="text-white" size={18} />
                </div>
                <span>External Therapy</span>
              </div>
              <p className="text-xs text-green-600">Connect with certified therapists outside campus</p>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-4">Available Counselors</h3>
            <div className="space-y-3">
              {/* On-Campus Counselors */}
              <div className="bg-blue-25 border-l-4 border-blue-400 p-1 rounded-r-lg mb-3">
                <p className="text-xs font-medium text-blue-700 px-3">📍 On-Campus</p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    RS
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Dr. Ragini Sinha</h4>
                    <p className="text-sm text-gray-600">Anxiety & Depression Specialist</p>
                    <p className="text-xs text-green-600">Available Today • Student Wellness Center</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    4.9 ⭐
                  </div>
                </div>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                    A
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Dr. Avinaash</h4>
                    <p className="text-sm text-gray-600">Stress & Academic Pressure</p>
                    <p className="text-xs text-yellow-600">Available Tomorrow • Counseling Office</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    4.8 ⭐
                  </div>
                </div>
              </div>

              {/* External Therapists */}
              <div className="bg-green-25 border-l-4 border-green-400 p-1 rounded-r-lg mb-3 mt-4">
                <p className="text-xs font-medium text-green-700 px-3">🏢 External Partners</p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-xl hover:border-green-300 hover:shadow-sm transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    SK
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Dr. Sanya Kapoor</h4>
                    <p className="text-sm text-gray-600">Licensed Clinical Psychologist</p>
                    <p className="text-xs text-green-600">Available Today • MindSpace Clinic</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-sm text-gray-500">4.9 ⭐</div>
                    <div className="text-xs text-purple-600">₹800/session</div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-xl hover:border-green-300 hover:shadow-sm transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                    RP
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Dr. Rohan Patel</h4>
                    <p className="text-sm text-gray-600">Cognitive Behavioral Therapist</p>
                    <p className="text-xs text-yellow-600">Available Tomorrow • Serenity Center</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-sm text-gray-500">4.7 ⭐</div>
                    <div className="text-xs text-orange-600">₹1000/session</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-700 mb-4">Schedule Session</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                <input type="date" className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
                <select className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>10:00 AM</option>
                  <option>12:00 PM</option>
                  <option>2:00 PM</option>
                  <option>4:00 PM</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Session Type</label>
                <select className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>In-Person</option>
                  <option>Video Call</option>
                  <option>Phone Call</option>
                </select>
              </div>
              
              {/* Additional Options for External */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="text-amber-500 mt-0.5" size={16} />
                  <div>
                    <p className="text-sm font-medium text-amber-800">External Therapy Note</p>
                    <p className="text-xs text-amber-700 mt-1">
                      Sessions with external partners may have associated costs. 
                      Insurance coverage and financial assistance options available.
                    </p>
                  </div>
                </div>
              </div>
              
              <button className="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition-colors font-medium">
                Book Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCommunity = () => (
    <div className="space-y-4 lg:space-y-6">
      <div className="bg-white p-4 lg:p-6 rounded-xl lg:rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Anonymous Community</h2>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm">
                A
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700">
                  "Just wanted to share that talking to someone really helped me get through my exam stress. 
                  Don't hesitate to reach out for help! 💙"
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span>2 hours ago</span>
                  <button className="text-blue-500 hover:text-blue-600">❤️ 12</button>
                  <button className="text-blue-500 hover:text-blue-600">Reply</button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
                B
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700">
                  "Has anyone tried the mindfulness exercises in the app? They're actually really calming."
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span>5 hours ago</span>
                  <button className="text-blue-500 hover:text-blue-600">❤️ 8</button>
                  <button className="text-blue-500 hover:text-blue-600">Reply</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <textarea 
            placeholder="Share your thoughts anonymously..."
            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows="3"
          />
          <div className="flex justify-end mt-3">
            <button className="bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600 transition-colors">
              Post Anonymously
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-4 lg:space-y-6">
      <div className="bg-white p-4 lg:p-6 rounded-xl lg:rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Emergency Alert System</h2>
        
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-red-500 mt-1" size={20} />
              <div className="flex-1">
                <h4 className="font-medium text-red-800">Critical Alert Protocol</h4>
                <p className="text-sm text-red-700 mt-1">
                  If AI detects concerning patterns in conversations, counselors are immediately notified 
                  with a comprehensive mental health summary.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-start gap-3">
              <Clock className="text-yellow-500 mt-1" size={20} />
              <div className="flex-1">
                <h4 className="font-medium text-yellow-800">24/7 Monitoring</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Our AI continuously monitors conversation patterns to ensure student safety and wellbeing.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-start gap-3">
              <Shield className="text-green-500 mt-1" size={20} />
              <div className="flex-1">
                <h4 className="font-medium text-green-800">Privacy Protected</h4>
                <p className="text-sm text-green-700 mt-1">
                  All alerts maintain student privacy while ensuring appropriate care is provided.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(currentView) {
      case 'dashboard': return renderDashboard();
      case 'chat': return renderChat();
      case 'booking': return renderBooking();
      case 'community': return renderCommunity();
      case 'alerts': return renderAlerts();
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Mobile Header */}
      <MobileHeader />
      
      {/* Mobile Navigation Overlay */}
      <MobileNavOverlay />
      
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 bg-white shadow-lg h-screen sticky top-0">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Mindset</h1>
                <p className="text-sm text-gray-600">Mental Health Platform</p>
              </div>
            </div>
            
            <nav className="space-y-2">
              <NavButton icon={Activity} label="Dashboard" view="dashboard" />
              <NavButton icon={MessageCircle} label="AI Chat" view="chat" />
              <NavButton icon={Calendar} label="Book Session" view="booking" />
              <NavButton icon={Users} label="Community" view="community" />
              <NavButton icon={Bell} label="Alerts" view="alerts" badge="!" />
            </nav>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{user.name}</h4>
                  <p className="text-sm text-gray-600">{user.year} Student</p>
                </div>
                <Settings className="text-gray-400" size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default MindsetApp;
