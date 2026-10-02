import { Link, useNavigate, useSearchParams } from "react-router";
import { Droplets, Users, BarChart3, Mail, Lock, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get("role");
  const [selectedRole, setSelectedRole] = useState<"farmer" | "manager" | null>(
    roleParam === "farmer" || roleParam === "manager" ? roleParam : null
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
        <div className="w-full max-w-5xl">
          <div className="text-center mb-12">
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center">
                <Droplets className="w-8 h-8 text-primary-foreground" />
              </div>
              <span className="text-3xl font-bold text-foreground">آبانو</span>
            </Link>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              پلتفرم جامع مدیریت آب
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              لطفاً نقش خود را انتخاب کنید تا به پنل مربوطه وارد شوید
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <button
              onClick={() => setSelectedRole("farmer")}
              className="group bg-card border-2 border-border hover:border-primary rounded-2xl p-8 transition-all hover:shadow-xl text-right"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all">
                <Users className="w-9 h-9 text-primary group-hover:text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">کشاورزان</h2>
              <p className="text-muted-foreground mb-4">
                دسترسی به برنامه آبیاری، وضعیت مزرعه و دستیار هوشمند
              </p>
              <div className="flex items-center gap-2 text-primary font-medium">
                <span>ورود به پنل کشاورز</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button
              onClick={() => setSelectedRole("manager")}
              className="group bg-card border-2 border-border hover:border-accent rounded-2xl p-8 transition-all hover:shadow-xl text-right"
            >
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:scale-110 transition-all">
                <BarChart3 className="w-9 h-9 text-accent group-hover:text-accent-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">مدیران و کارشناسان</h2>
              <p className="text-muted-foreground mb-4">
                دسترسی به داشبورد تحلیلی، گزارش‌ها و مدیریت توزیع آب
              </p>
              <div className="flex items-center gap-2 text-accent font-medium">
                <span>ورود به پنل مدیریت</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 bg-muted/30 rounded-2xl p-8">
            <div className="text-center">
              <h3 className="font-semibold text-foreground mb-2">شعار محصول</h3>
              <p className="text-sm text-muted-foreground">
                توزیع عادلانه آب، آینده پایدار کشاورزی
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-foreground mb-2">درباره محصول</h3>
              <p className="text-sm text-muted-foreground">
                سامانه هوشمند مبتنی بر AI و تصاویر ماهواره‌ای
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-foreground mb-2">هدف محصول</h3>
              <p className="text-sm text-muted-foreground">
                بهینه‌سازی مصرف آب و افزایش بهره‌وری
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center">
              <Droplets className="w-8 h-8 text-primary-foreground" />
            </div>
            <span className="text-3xl font-bold text-foreground">آبانو</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {selectedRole === "farmer" ? "ورود کشاورزان" : "ورود مدیران و کارشناسان"}
          </h1>
          <p className="text-muted-foreground">
            به حساب کاربری خود وارد شوید
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                ایمیل
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 pr-11 bg-input-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="example@email.com"
                  required
                />
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                رمز عبور
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-11 bg-input-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="رمز عبور خود را وارد کنید"
                  required
                />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm text-muted-foreground">مرا به خاطر بسپار</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                فراموشی رمز عبور
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity font-medium flex items-center justify-center gap-2"
            >
              <span>ورود به سیستم</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              حساب کاربری ندارید؟{" "}
              <Link to="/register" className="text-primary font-medium hover:underline">
                ثبت نام کنید
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setSelectedRole(null)}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            بازگشت به انتخاب نقش
          </button>
        </div>
      </div>
    </div>
  );
}
