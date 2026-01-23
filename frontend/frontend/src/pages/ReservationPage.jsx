import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../services/axiosConfig";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./ReservationPage.css";

const MORNING_SLOTS = ["09:00", "09:30", "10:00", "10:30"];
const NOON_SLOTS = ["12:00", "12:30", "13:00", "13:30"];

const ReservationPage = () => {
  const navigate = useNavigate();
  const { restaurantId } = useParams();

  const [user, setUser] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [date, setDate] = useState(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });
  const [guests, setGuests] = useState(2);
  const [selectedTime, setSelectedTime] = useState("09:30");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  // Demo: bazı saatleri “dolu” göstermek için (istersen backend ile bağlarız)
  const bookedTimes = useMemo(() => {
    // aynı gün için tutarlı olsun diye küçük bir deterministic seçim
    const seed = Number(String(restaurantId || "1").replace(/\D/g, "")) || 1;
    const pick = (arr, idx) => arr[idx % arr.length];
    return new Set([pick(MORNING_SLOTS, seed), pick(NOON_SLOTS, seed + 1)]);
  }, [restaurantId]);

  const isLoggedIn = useMemo(() => {
    return !!localStorage.getItem("token") || !!localStorage.getItem("user");
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");

    if (!isLoggedIn || !storedUser) {
      alert("Rezervasyon oluşturmak için lütfen kayıt olun ya da giriş yapın.");
      navigate("/giris");
      return;
    }

    setUser(storedUser);

    // profil bilgilerinden otomatik doldur
    setName(storedUser?.name || "");
    setPhone(storedUser?.phoneNumber || storedUser?.phone || "");

    async function loadRestaurant() {
      try {
        // Not: endpoint sende farklıysa burayı değiştir:
        // Örn: /api/restaurants/{id}
        const res = await axios.get(`/api/restaurants/${restaurantId}`);
        setRestaurant(res.data);
      } catch (e) {
        console.error(
          "Restoran bilgisi alınamadı:",
          e?.response?.data || e.message
        );
        // fallback
        setRestaurant({
          id: restaurantId,
          name: "Restoran",
          location: "Konum bilgisi yok",
          imageUrl: "/images/default.jpg",
          rating: 4.9,
          reviewCount: 0,
        });
      } finally {
        setLoading(false);
      }
    }

    loadRestaurant();
  }, [navigate, restaurantId, isLoggedIn]);

  const availabilityText = useMemo(() => {
    if (bookedTimes.has(selectedTime)) return "DOLU";
    return "MÜSAİT";
  }, [selectedTime, bookedTimes]);

  const availabilityClass = useMemo(() => {
    return bookedTimes.has(selectedTime)
      ? "status-pill--busy"
      : "status-pill--ok";
  }, [selectedTime, bookedTimes]);

  const canSubmit = useMemo(() => {
    if (!date || !selectedTime || !guests) return false;
    if (!name?.trim() || !phone?.trim()) return false;
    if (bookedTimes.has(selectedTime)) return false;
    return true;
  }, [date, selectedTime, guests, name, phone, bookedTimes]);

  const handleConfirm = async () => {
    if (!canSubmit) {
      if (bookedTimes.has(selectedTime)) {
        alert("Seçtiğiniz saat dolu. Lütfen başka bir saat seçin.");
        return;
      }
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      // Reservation datetime: 2025-01-01T09:30:00
      const reservationTime = `${date}T${selectedTime}:00`;

      // Not: Backend endpoint ve payload sende farklı olabilir.
      // En sık kullanılan örnek payload:
      const payload = {
        restaurantId: Number(restaurantId),
        userEmail: user?.email,
        reservationTime,
        numberOfGuests: Number(guests),
        phoneNumber: phone,
        note,
      };

      // ✅ endpoint sende farklıysa burayı değiştir:
      // örn: "/api/reservations" ya da "/api/reservations/create"
      const res = await axios.post("/api/reservations", payload);

      alert("Rezervasyonunuz alındı ✅");
      // panel/rezervasyonlarım sayfasına dön
      navigate("/panel");
      return res.data;
    } catch (err) {
      // ✅ FIX: alert'e object basma -> okunabilir mesaja çevir
      console.error("Rezervasyon oluşturma hatası:", err);

      const data = err?.response?.data;
      const msg =
        typeof data === "string"
          ? data
          : data?.message
          ? data.message
          : JSON.stringify(data);

      alert(msg || "Rezervasyon oluşturulamadı.");
    }
  };

  if (loading) {
    return (
      <div className="reservation-page">
        <Navbar />
        <div className="reservation-loading">Yükleniyor...</div>
        <Footer />
      </div>
    );
  }

  const bgUrl = restaurant?.imageUrl || "/images/default.jpg";
  const rating = restaurant?.rating ?? 4.9;
  const reviewCount =
    restaurant?.reviewCount ?? restaurant?.reviews?.length ?? 0;

  return (
    <div className="reservation-page" style={{ "--bg-url": `url(${bgUrl})` }}>
      <Navbar />

      <div className="reservation-shell">
        <div className="reservation-card">
          {/* LEFT */}
          <aside className="reservation-left">
            <button
              className="back-btn"
              type="button"
              onClick={() => navigate("/restoranlar")}
            >
              ← Restoranlara Dön
            </button>

            <h2 className="res-name">{restaurant?.name}</h2>
            <div className="res-meta">
              <div className="res-location">
                📍 {restaurant?.location || "Konum bilgisi yok"}
              </div>
            </div>

            <div className="res-rating-box">
              <div className="stars">
                {"⭐".repeat(Math.round(Math.min(5, Math.max(1, rating))))}
              </div>
              <div className="rating-text">
                <strong>{Number(rating).toFixed(1)}</strong>
                <span>({reviewCount} Değerlendirme)</span>
              </div>
              <div className="quote">
                “Doğanın içinde, unutulmaz bir deneyim sunuyoruz.”
              </div>
            </div>
          </aside>

          {/* RIGHT */}
          <section className="reservation-right">
            <div className="right-head">
              <div>
                <h1>Rezervasyon Oluştur</h1>
                <p>Lütfen rezervasyon detaylarını eksiksiz doldurun.</p>
              </div>

              <div className={`status-pill ${availabilityClass}`}>
                <span className="dot" />
                {availabilityText}
              </div>
            </div>

            <div className="form-row">
              <div className="field">
                <label>Tarih Seçin</label>
                <div className="input-wrap">
                  <span className="icon">📅</span>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="field">
                <label>Kişi Sayısı</label>
                <div className="input-wrap">
                  <span className="icon">👥</span>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <option key={n} value={n}>
                        {n} Kişi
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="time-card">
              <div className="time-head">
                <h3>Saat Seçin</h3>
                <div className="legend">
                  <span className="lg-item">
                    <span className="lg-dot lg-dot--busy" /> Dolu
                  </span>
                  <span className="lg-item">
                    <span className="lg-dot lg-dot--selected" /> Seçili
                  </span>
                </div>
              </div>

              <div className="time-block">
                <div className="time-label">SABAH</div>
                <div className="time-grid">
                  {MORNING_SLOTS.map((t) => {
                    const isBooked = bookedTimes.has(t);
                    const isSel = selectedTime === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        className={[
                          "time-btn",
                          isSel ? "is-selected" : "",
                          isBooked ? "is-booked" : "",
                        ].join(" ")}
                        onClick={() => !isBooked && setSelectedTime(t)}
                        disabled={isBooked}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="time-block">
                <div className="time-label">ÖĞLE</div>
                <div className="time-grid">
                  {NOON_SLOTS.map((t) => {
                    const isBooked = bookedTimes.has(t);
                    const isSel = selectedTime === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        className={[
                          "time-btn",
                          isSel ? "is-selected" : "",
                          isBooked ? "is-booked" : "",
                        ].join(" ")}
                        onClick={() => !isBooked && setSelectedTime(t)}
                        disabled={isBooked}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="contact-card">
              <h3>İletişim Bilgileri</h3>

              <div className="form-row">
                <div className="field">
                  <div className="input-wrap">
                    <span className="icon">👤</span>
                    <input
                      type="text"
                      placeholder="Ad Soyad"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="field">
                  <div className="input-wrap">
                    <span className="icon">📞</span>
                    <input
                      type="text"
                      placeholder="Telefon"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="field">
                <label>Özel İstekler (Opsiyonel)</label>
                <textarea
                  placeholder="Doğum günü kutlaması, mama sandalyesi vb."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              <div className="policy">
                <strong>İptal Politikası</strong>
                <span>Rezervasyon saatine 2 saat kala iptal edilebilir.</span>
              </div>

              <div className="actions">
                <button
                  type="button"
                  className="confirm-btn"
                  onClick={handleConfirm}
                  disabled={!canSubmit}
                  title={!canSubmit ? "Lütfen formu tamamlayın" : ""}
                >
                  Rezervasyonu Onayla <span className="arrow">→</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ReservationPage;
