import { Link } from "react-router";
import { Droplets, Sun, Moon, LogOut, MapPin, Save, Plus, Trash2, Edit3, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default marker icon issue
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LandArea {
  id: string;
  name: string;
  area: number;
  crop: string;
  coordinates: [number, number][];
  center: [number, number];
}

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LandManagementPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [lands, setLands] = useState<LandArea[]>([
    {
      id: "1",
      name: "زمین شماره ۱",
      area: 15,
      crop: "گندم",
      coordinates: [
        [29.6145, 52.5385],
        [29.6155, 52.5395],
        [29.6135, 52.5405],
        [29.6125, 52.5395],
      ],
      center: [29.614, 52.5395],
    },
  ]);
  const [selectedLand, setSelectedLand] = useState<LandArea | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState<[number, number][]>([]);
  const [newLandName, setNewLandName] = useState("");
  const [newLandCrop, setNewLandCrop] = useState("");

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

  const handleMapClick = (lat: number, lng: number) => {
    if (isDrawing) {
      setDrawingPoints((prev) => [...prev, [lat, lng]]);
    }
  };

  const startDrawing = () => {
    setIsDrawing(true);
    setDrawingPoints([]);
    setNewLandName("");
    setNewLandCrop("");
  };

  const cancelDrawing = () => {
    setIsDrawing(false);
    setDrawingPoints([]);
  };

  const saveLand = () => {
    if (drawingPoints.length < 3) {
      alert("لطفاً حداقل 3 نقطه را انتخاب کنید");
      return;
    }
    if (!newLandName || !newLandCrop) {
      alert("لطفاً نام زمین و نوع محصول را وارد کنید");
      return;
    }

    const centerLat = drawingPoints.reduce((sum, p) => sum + p[0], 0) / drawingPoints.length;
    const centerLng = drawingPoints.reduce((sum, p) => sum + p[1], 0) / drawingPoints.length;

    const newLand: LandArea = {
      id: Date.now().toString(),
      name: newLandName,
      area: Math.round(Math.random() * 20 + 5),
      crop: newLandCrop,
      coordinates: drawingPoints,
      center: [centerLat, centerLng],
    };

    setLands((prev) => [...prev, newLand]);
    setIsDrawing(false);
    setDrawingPoints([]);
    setNewLandName("");
    setNewLandCrop("");
  };

  const deleteLand = (id: string) => {
    if (confirm("آیا از حذف این زمین اطمینان دارید؟")) {
      setLands((prev) => prev.filter((land) => land.id !== id));
      if (selectedLand?.id === id) {
        setSelectedLand(null);
      }
    }
  };

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
                <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  داشبورد
                </Link>
                <Link to="/land-management" className="text-sm font-medium text-primary">
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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">مدیریت زمین‌ها</h1>
          <p className="text-muted-foreground">انتخاب و مدیریت محل زمین‌های کشاورزی از روی نقشه</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold text-foreground">نقشه</h2>
                </div>
                <div className="flex items-center gap-2">
                  {isDrawing ? (
                    <>
                      <button
                        onClick={cancelDrawing}
                        className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-accent transition-colors text-sm font-medium"
                      >
                        لغو
                      </button>
                      <button
                        onClick={saveLand}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm font-medium flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        ذخیره زمین
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={startDrawing}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm font-medium flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      افزودن زمین جدید
                    </button>
                  )}
                </div>
              </div>

              <div className="h-[600px] relative">
                <MapContainer
                  center={[29.614, 52.5395]}
                  zoom={15}
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <MapClickHandler onMapClick={handleMapClick} />

                  {/* Existing lands */}
                  {lands.map((land) => (
                    <div key={land.id}>
                      <Polygon
                        positions={land.coordinates}
                        pathOptions={{
                          color: selectedLand?.id === land.id ? "#10b981" : "#0891b2",
                          fillColor: selectedLand?.id === land.id ? "#10b981" : "#0891b2",
                          fillOpacity: 0.3,
                        }}
                        eventHandlers={{
                          click: () => setSelectedLand(land),
                        }}
                      />
                      <Marker position={land.center}>
                        <Popup>
                          <div className="text-right" dir="rtl">
                            <h3 className="font-bold text-sm mb-1">{land.name}</h3>
                            <p className="text-xs text-gray-600">محصول: {land.crop}</p>
                            <p className="text-xs text-gray-600">مساحت: {land.area} هکتار</p>
                          </div>
                        </Popup>
                      </Marker>
                    </div>
                  ))}

                  {/* Drawing polygon */}
                  {isDrawing && drawingPoints.length > 0 && (
                    <>
                      {drawingPoints.map((point, index) => (
                        <Marker key={index} position={point} />
                      ))}
                      {drawingPoints.length > 2 && (
                        <Polygon
                          positions={drawingPoints}
                          pathOptions={{
                            color: "#f59e0b",
                            fillColor: "#f59e0b",
                            fillOpacity: 0.2,
                            dashArray: "5, 5",
                          }}
                        />
                      )}
                    </>
                  )}
                </MapContainer>

                {isDrawing && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow-lg z-[1000]">
                    <p className="text-sm font-medium">
                      روی نقشه کلیک کنید تا نقاط زمین را مشخص کنید ({drawingPoints.length} نقطه انتخاب شده)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Drawing Form */}
            {isDrawing && (
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-semibold text-foreground mb-4">اطلاعات زمین جدید</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">نام زمین</label>
                    <input
                      type="text"
                      value={newLandName}
                      onChange={(e) => setNewLandName(e.target.value)}
                      className="w-full px-4 py-2 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="مثال: زمین شماره ۲"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">نوع محصول</label>
                    <select
                      value={newLandCrop}
                      onChange={(e) => setNewLandCrop(e.target.value)}
                      className="w-full px-4 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">انتخاب کنید</option>
                      <option value="گندم">گندم</option>
                      <option value="برنج">برنج</option>
                      <option value="ذرت">ذرت</option>
                      <option value="یونجه">یونجه</option>
                      <option value="پنبه">پنبه</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Land List */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-semibold text-foreground mb-4">زمین‌های ثبت شده</h3>
              <div className="space-y-3">
                {lands.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    هنوز زمینی ثبت نشده است
                  </p>
                ) : (
                  lands.map((land) => (
                    <div
                      key={land.id}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        selectedLand?.id === land.id
                          ? "border-accent bg-accent/10"
                          : "border-border bg-muted/30 hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedLand(land)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{land.name}</h4>
                          <p className="text-sm text-muted-foreground">محصول: {land.crop}</p>
                          <p className="text-sm text-muted-foreground">مساحت: {land.area} هکتار</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteLand(land.id);
                          }}
                          className="w-8 h-8 rounded-lg bg-destructive/10 hover:bg-destructive/20 transition-colors flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                      {selectedLand?.id === land.id && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <p className="text-xs text-muted-foreground">
                            مختصات: {land.coordinates.length} نقطه
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                راهنما
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• روی "افزودن زمین جدید" کلیک کنید</li>
                <li>• با کلیک روی نقشه، نقاط محدوده زمین را مشخص کنید</li>
                <li>• حداقل 3 نقطه مورد نیاز است</li>
                <li>• نام و نوع محصول را وارد کنید</li>
                <li>• روی "ذخیره زمین" کلیک کنید</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
