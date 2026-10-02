import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import {
  Droplets, Calendar, MapPin, Leaf, Sun, Moon, LogOut, MessageSquare,
  TrendingUp, AlertCircle, Loader2,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

// ---------- TypeScript interfaces ----------
interface Field {
  code: string;
  product: string;
  area: number;
  waterVolume: number;
  daysSinceIrrigation: number;
  relativeStatus: number;
  priority: number;
  irrigationTime: number;
  toleranceToRain: number;
}

interface DashboardData {
  customerName: string;
  lastUpdate: string;
  summary: {
    totalWaterUsage: number;
    cropHealth: number;
    totalArea: number;
    daysProgram: number;
  };
  fields: Field[];
}

export default function DashboardPage() {
  const { customerCode } = useParams();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [activeTab, setActiveTab] = useState<"schedule" | "land">("schedule");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Theme persistence
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // Fetch dashboard data from backend
  useEffect(() => {
    if (!customerCode) {
      setError("کد مشتری در URL مشخص نشده است.");
      setLoading(false);
      return;
    }

    setLoading(true);
    // During development, the Vite proxy will forward /api to the backend.
    fetch(`/api/dashboard/${customerCode}`)
      .then((res) => {
        if (!res.ok) throw new Error("خطا در دریافت اطلاعات");
        return res.json();
      })
      .then((json: DashboardData) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [customerCode]);

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background" dir="rtl">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  // Error screen
  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background" dir="rtl">
        <div className="text-center p-8">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-xl font-bold text-foreground mb-2">خطا</p>
          <p className="text-muted-foreground">{error || "اطلاعاتی یافت نشد."}</p>
        </div>
      </div>
    );
  }

  // Map product names for display (you can extend this)
  const productNameMap: Record<string, string> = {
    گندم: "گندم",
    برنج: "برنج",
    گلرنگ: "گلرنگ",
  };

  // Data for the bar chart
  const waterChartData = data.fields.map((f) => ({
    name: f.code,
    water: f.waterVolume,
    time: f.irrigationTime,
  }));

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
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
                <Link to={`/dashboard/${customerCode}`} className="text-sm font-medium text-primary">
                  داشبورد
                </Link>
                <Link to="/land-management" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  مدیریت زمین
                </Link>
                <Link to="/assistant" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
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
              <Link to="/login" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">خروج</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">خوش آمدید، {data.customerName}</h1>
          <p className="text-muted-foreground">آخرین بروزرسانی: {data.lastUpdate}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Droplets className="w-6 h-6 text-primary" />
              </div>
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">{data.summary.totalWaterUsage.toLocaleString()} م³</p>
            <p className="text-sm text-muted-foreground">مصرف آب این ماه</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-accent" />
              </div>
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">{data.summary.cropHealth}٪</p>
            <p className="text-sm text-muted-foreground">سلامت محصولات</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">{data.summary.totalArea} هکتار</p>
            <p className="text-sm text-muted-foreground">مساحت زمین</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">{data.summary.daysProgram} روز</p>
            <p className="text-sm text-muted-foreground">برنامه آبیاری</p>
          </div>
        </div>

        {/* Smart Alert */}
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 mb-8 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-foreground">توصیه هوشمند</p>
            <p className="text-sm text-muted-foreground mt-1">
              اولویت آبیاری بر اساس وضعیت نسبی و حجم آب تعیین شده است. جدول زیر را ببینید.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border mb-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("schedule")}
              className={`pb-4 px-2 border-b-2 transition-colors ${
                activeTab === "schedule" ? "border-primary text-primary font-medium" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              برنامه توزیع آب
            </button>
            <button
              onClick={() => setActiveTab("land")}
              className={`pb-4 px-2 border-b-2 transition-colors ${
                activeTab === "land" ? "border-primary text-primary font-medium" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              اطلاعات زمین
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "schedule" && (
          <div className="space-y-8">
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-xl font-bold text-foreground mb-6">مصرف آب هر زمین</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={waterChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "0.5rem" }} />
                  <Legend />
                  <Bar dataKey="water" fill="var(--color-primary)" name="حجم آب (m³)" />
                  <Bar dataKey="time" fill="var(--color-accent)" name="زمان آبیاری (دقیقه)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">اولویت‌های آبیاری</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="text-right py-3 px-4">کد</th>
                      <th className="text-right py-3 px-4">محصول</th>
                      <th className="text-right py-3 px-4">مساحت</th>
                      <th className="text-right py-3 px-4">حجم آب</th>
                      <th className="text-right py-3 px-4">روز از آبیاری</th>
                      <th className="text-right py-3 px-4">وضعیت نسبی</th>
                      <th className="text-right py-3 px-4">اولویت</th>
                      <th className="text-right py-3 px-4">زمان(دقیقه)</th>
                      <th className="text-right py-3 px-4">تحمل</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.fields.map((field, idx) => (
                      <tr key={idx} className="border-b border-border/50 hover:bg-muted/20">
                        <td className="py-3 px-4 font-medium">{field.code}</td>
                        <td className="py-3 px-4">{productNameMap[field.product] || field.product}</td>
                        <td className="py-3 px-4">{field.area}</td>
                        <td className="py-3 px-4">{field.waterVolume}</td>
                        <td className="py-3 px-4">{field.daysSinceIrrigation}</td>
                        <td className="py-3 px-4">{field.relativeStatus.toFixed(2)}</td>
                        <td className="py-3 px-4 font-bold text-primary">{field.priority.toFixed(2)}</td>
                        <td className="py-3 px-4">{field.irrigationTime}</td>
                        <td className={`py-3 px-4 ${field.toleranceToRain < 0 ? 'text-destructive' : 'text-accent'}`}>
                          {field.toleranceToRain > 0 ? `+${field.toleranceToRain}` : field.toleranceToRain}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "land" && (
          <div className="space-y-8">
            {data.fields.map((field, idx) => (
              <div key={idx} className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">
                  {field.code} – {productNameMap[field.product] || field.product}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                    <span className="text-muted-foreground">مساحت</span>
                    <span className="font-semibold">{field.area} هکتار</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                    <span className="text-muted-foreground">حجم آب</span>
                    <span className="font-semibold">{field.waterVolume} m³</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                    <span className="text-muted-foreground">روز از آبیاری</span>
                    <span className="font-semibold">{field.daysSinceIrrigation}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                    <span className="text-muted-foreground">وضعیت نسبی</span>
                    <span className="font-semibold">{field.relativeStatus.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                    <span className="text-muted-foreground">اولویت</span>
                    <span className="font-semibold text-primary">{field.priority.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                    <span className="text-muted-foreground">زمان آبیاری</span>
                    <span className="font-semibold">{field.irrigationTime} دقیقه</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                    <span className="text-muted-foreground">تحمل تا بارندگی</span>
                    <span className={`font-semibold ${field.toleranceToRain < 0 ? 'text-destructive' : 'text-accent'}`}>
                      {field.toleranceToRain > 0 ? `+${field.toleranceToRain}` : field.toleranceToRain}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI Assistant CTA */}
        <div className="mt-8 bg-gradient-to-br from-primary to-accent rounded-2xl p-8 text-center">
          <MessageSquare className="w-12 h-12 text-white mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">دستیار هوشمند آبانو</h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            سوالات خود درباره برنامه آبیاری، وضعیت مزرعه و پیشنهادات را از دستیار هوشمند بپرسید
          </p>
          <Link to="/assistant" className="inline-block px-8 py-3 bg-white text-primary rounded-xl hover:shadow-xl transition-shadow font-medium">
            شروع گفتگو
          </Link>
        </div>
      </div>
    </div>
  );
}