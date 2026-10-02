import { Link } from "react-router";
import { Droplets, Send, Sun, Moon, LogOut, Sparkles, ArrowRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

const sampleQuestions = [
  "چرا برنامه آبیاری من برای فردا تغییر کرده است؟",
  "اگر ۳۰ دقیقه کمتر آبیاری کنم چه می‌شود؟",
  "وضعیت سلامت محصول من چطور است؟",
  "آیا احتمال بارش در هفته آینده وجود دارد؟"
];

// System prompt to steer the assistant toward irrigation expertise
const SYSTEM_PROMPT = `You are an AI irrigation assistant for a smart farming platform. Your role is to help farmers with irrigation scheduling, water management, crop health, weather impacts, and sustainability. Answer questions in Persian (Farsi). Use the farmer's data if provided. Be concise, practical, and supportive. If a question falls outside agriculture, politely redirect.`;

export default function AIAssistantPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "سلام! من دستیار هوشمند آبانو هستم. چطور می‌توانم به شما کمک کنم؟ می‌توانید درباره برنامه آبیاری، وضعیت مزرعه یا هر سوال دیگری از من بپرسید.",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const aiResponse = await callGPT4o([...messages, userMessage]);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "متأسفانه در پردازش سوال شما مشکلی پیش آمد. لطفاً دوباره تلاش کنید.",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

const callGPT4o = async (conversation: Message[]): Promise<string> => {
  const apiMessages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...conversation
      .filter(m => m.role !== "system")
      .map(m => ({ role: m.role, content: m.content }))
  ];

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: apiMessages })   // <- wrap in object
  });

  if (!response.ok) {
    const errBody = await response.text();
    console.error("Chat API error:", response.status, errBody);
    throw new Error(`API call failed: ${response.status}`);
  }

  const data = await response.json();
  return data.reply;
};
  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      {/* Header – unchanged */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">آبانو</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  داشبورد
                </Link>
                <Link to="/land-management" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  مدیریت زمین
                </Link>
                <Link to="/assistant" className="text-sm font-medium text-primary">
                  دستیار هوشمند
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="w-10 h-10 rounded-lg bg-muted hover:bg-accent transition-colors flex items-center justify-center"
                aria-label="تغییر تم"
              >
                {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">خروج</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">دستیار هوشمند آبانو</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            ارائه تحلیل قابل درک از اطلاعات موجود در داشبورد و پاسخ به سوالات شما
          </p>
        </div>

        {/* Sample Questions */}
        {messages.length === 1 && (
          <div className="mb-8">
            <p className="text-sm font-medium text-muted-foreground mb-4 text-center">
              سوالات پرتکرار:
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {sampleQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(question)}
                  className="p-4 bg-card border border-border rounded-xl text-right hover:border-primary hover:bg-primary/5 transition-all group"
                >
                  <p className="text-sm text-foreground group-hover:text-primary transition-colors">
                    {question}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-foreground"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p
                  className={`text-xs mt-2 ${
                    message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString("fa-IR", {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-end">
              <div className="max-w-[80%] bg-card border border-border rounded-2xl p-4">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="flex gap-3"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="سوال خود را بپرسید..."
              className="flex-1 px-4 py-3 bg-input-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              <span className="hidden sm:inline">ارسال</span>
            </button>
          </form>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-accent transition-colors rounded-lg text-sm font-medium text-foreground"
          >
            <ArrowRight className="w-4 h-4" />
            بازگشت به داشبورد
          </Link>
        </div>
      </div>
    </div>
  );
}