import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* ✔ Genel Sayfalar */
import Home from "./pages/Home";
import Restaurants from "./pages/Restaurants";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MenuPage from "./pages/MenuPage";
import ReservationPage from "./pages/ReservationPage";

/* ⭐ RESTORAN DETAY */
import RestaurantDetail from "./pages/RestaurantDetail";

/* ⭐ YENİ: DEĞERLENDİRMELERİM */
import MyReviews from "./pages/MyReviews";

/* ⭐ ADMIN */
import AdminPanel from "./pages/AdminPanel";
import AdminSettings from "./pages/AdminSettings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🏠 KAMUYA AÇIK ROTALAR */}
        <Route path="/" element={<Home />} />
        <Route path="/restoranlar" element={<Restaurants />} />
        <Route path="/restoranlar/:id" element={<RestaurantDetail />} />
        <Route path="/restoranlar/:id/menu" element={<MenuPage />} />
        <Route path="/rezervasyon/:restaurantId" element={<ReservationPage />} />
        <Route path="/hakkimizda" element={<About />} />
        <Route path="/iletisim" element={<Contact />} />

        {/* 🔐 GİRİŞ & KAYIT */}
        <Route path="/giris" element={<Login />} />
        <Route path="/kayit" element={<Register />} />

        {/* ⭐ KULLANICI PANELİ */}
        <Route path="/panel" element={<Dashboard />} />

        {/* ⭐ KULLANICI → DEĞERLENDİRMELERİM */}
        <Route path="/panel/degerlendirmelerim" element={<MyReviews />} />

        {/* ⭐ ADMIN PANELİ */}
        <Route path="/admin" element={<AdminPanel />}>
          <Route index element={<Navigate to="panel" replace />} />
          <Route path="panel" element={<div>Genel Bakış İçeriği</div>} />
          <Route path="kullanicilar" element={<div>Kullanıcı Listesi</div>} />
          <Route path="restoranlar" element={<div>Restoran Yönetimi</div>} />
          <Route path="rezervasyonlar" element={<div>Rezervasyon Yönetimi</div>} />
          <Route path="ayarlar" element={<AdminSettings />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
