import { Link } from "react-router";
import { Droplets, BarChart3, Users, Leaf, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

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

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Droplets className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">آبانو</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                خانه
              </Link>
              <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                درباره ما
              </Link>
              <Link to="/product" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                درباره محصول
              </Link>
              <Link to="/blog" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                وبلاگ
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="w-10 h-10 rounded-lg bg-muted hover:bg-accent transition-colors flex items-center justify-center"
                aria-label="تغییر تم"
              >
                {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              <Link
                to="/login"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
              >
                ورود / ثبت نام
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-background"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
                <Leaf className="w-4 h-4" />
                <span>سامانه هوشمند توزیع آب</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                مدیریت هوشمند آب
                <span className="text-primary block mt-2">با تکنولوژی پیشرفته</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                آبانو یک پلتفرم هوشمند برای توزیع عادلانه آب کشاورزی و بهینه‌سازی برنامه آبیاری است. با استفاده از تصاویر ماهواره‌ای و هوش مصنوعی، به کشاورزان کمک می‌کند تا بهترین تصمیمات را برای مزارع خود بگیرند.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/login?role=farmer"
                  className="px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity text-center font-medium flex items-center justify-center gap-2"
                >
                  <Users className="w-5 h-5" />
                  ورود کشاورزان
                </Link>
                <Link
                  to="/login?role=manager"
                  className="px-8 py-4 bg-card border border-border text-foreground rounded-xl hover:bg-accent/50 transition-colors text-center font-medium flex items-center justify-center gap-2"
                >
                  <BarChart3 className="w-5 h-5" />
                  ورود مدیران و کارشناسان
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm border border-border flex items-center justify-center p-8">
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="bg-card rounded-2xl p-6 border border-border shadow-lg">
                    <Droplets className="w-8 h-8 text-primary mb-3" />
                    <p className="text-2xl font-bold text-foreground">۱۲۴۵</p>
                    <p className="text-sm text-muted-foreground mt-1">کشاورز فعال</p>
                  </div>
                  <div className="bg-card rounded-2xl p-6 border border-border shadow-lg">
                    <Leaf className="w-8 h-8 text-accent mb-3" />
                    <p className="text-2xl font-bold text-foreground">۸۹٪</p>
                    <p className="text-sm text-muted-foreground mt-1">بهینه‌سازی آب</p>
                  </div>
                  <div className="bg-card rounded-2xl p-6 border border-border shadow-lg">
                    <BarChart3 className="w-8 h-8 text-primary mb-3" />
                    <p className="text-2xl font-bold text-foreground">۳۵۰۰</p>
                    <p className="text-sm text-muted-foreground mt-1">هکتار زمین</p>
                  </div>
                  <div className="bg-card rounded-2xl p-6 border border-border shadow-lg">
                    <Users className="w-8 h-8 text-accent mb-3" />
                    <p className="text-2xl font-bold text-foreground">۴۲</p>
                    <p className="text-sm text-muted-foreground mt-1">کارشناس</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">
              ویژگی‌های آبانو
            </h2>
            <p className="text-lg text-muted-foreground">
              سامانه‌ای جامع برای مدیریت هوشمند منابع آبی و افزایش بهره‌وری کشاورزی
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Droplets,
                title: "برنامه آبیاری هوشمند",
                description: "برنامه‌ریزی دقیق آبیاری بر اساس داده‌های ماهواره‌ای و هوش مصنوعی"
              },
              {
                icon: BarChart3,
                title: "داشبورد تحلیلی",
                description: "نمایش آمار و تحلیل‌های جامع برای تصمیم‌گیری بهتر"
              },
              {
                icon: Leaf,
                title: "پایش وضعیت مزارع",
                description: "نظارت بر سلامت محصولات از طریق شاخص‌های ماهواره‌ای"
              },
              {
                icon: Users,
                title: "توزیع عادلانه آب",
                description: "تخصیص منصفانه منابع آبی بین تمام کشاورزان منطقه"
              },
              {
                icon: BarChart3,
                title: "پیش‌بینی هوشمند",
                description: "پیش‌بینی نیاز آبی مزارع در هفته آینده"
              },
              {
                icon: Droplets,
                title: "گزارش‌دهی شفاف",
                description: "دسترسی به گزارش‌های کامل و شفاف از مصرف آب"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-8 border border-border hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary to-accent rounded-3xl p-12 lg:p-20 text-center">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
              آماده شروع هستید؟
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              همین حالا به جمع هزاران کشاورز و متخصص آب کشور بپیوندید
            </p>
            <Link
              to="/login"
              className="inline-block px-10 py-4 bg-white text-primary rounded-xl hover:shadow-xl transition-shadow font-medium text-lg"
            >
              شروع کنید
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">آبانو</span>
              </div>
              <p className="text-sm text-muted-foreground">
                سامانه هوشمند توزیع و برنامه آبیاری
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">دسترسی سریع</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-sm text-muted-foreground hover:text-primary">خانه</Link></li>
                <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary">درباره ما</Link></li>
                <li><Link to="/product" className="text-sm text-muted-foreground hover:text-primary">محصول</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">خدمات</h4>
              <ul className="space-y-2">
                <li><Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary">داشبورد</Link></li>
                <li><Link to="/assistant" className="text-sm text-muted-foreground hover:text-primary">دستیار هوشمند</Link></li>
                <li><Link to="/support" className="text-sm text-muted-foreground hover:text-primary">پشتیبانی</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">تماس با ما</h4>
              <ul className="space-y-2">
                <li className="text-sm text-muted-foreground">تلفن: ۰۲۱-۱۲۳۴۵۶۷۸</li>
                <li className="text-sm text-muted-foreground">ایمیل: info@abano.ir</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © ۱۴۰۳ آبانو. تمامی حقوق محفوظ است.
          </div>
        </div>
      </footer>
    </div>
  );
}
