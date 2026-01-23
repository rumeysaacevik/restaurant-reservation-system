import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Dashboard.css";
import axios from "../services/axiosConfig";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("reservations");
  const navigate = useNavigate();

  // Profil / şifre
  const [profileData, setProfileData] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
  });
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // ✅ Düzenleme modalı
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingRes, setEditingRes] = useState(null); // {id, date, time, guests}

  const timeSlotsMorning = ["09:00", "09:30", "10:00", "10:30"];
  const timeSlotsNoon = ["12:00", "12:30", "13:00", "13:30"];
  const allTimeSlots = [...timeSlotsMorning, ...timeSlotsNoon];

  const guestOptions = useMemo(() => [1, 2, 3, 4, 5, 6, 7, 8], []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/giris");
      return;
    }
    setUser(storedUser);

    const nameParts = storedUser.name ? storedUser.name.split(" ") : [""];
    setProfileData({
      name: nameParts[0] || "",
      surname: nameParts.slice(1).join(" ") || "",
      email: storedUser.email || "",
      phone: storedUser.phoneNumber || storedUser.phone || "+90 5XX XXX XX XX",
    });

    async function loadDashboardData() {
      try {
        // Rezervasyonlar
        const resRes = await axios.get(
          `/api/reservations/my-reservations?email=${storedUser.email}`
        );
        setReservations(resRes.data || []);

        // Değerlendirmeler
      const resRev = await axios.get(`/api/reviews/user?email=${storedUser.email}`);

        const mapped = (resRev.data || []).map((r) => ({
          id: r.id,
          rating: r.rating ?? 0,
          comment: r.comment ?? "",
          restaurantName:
            r.restaurant?.name || `Restoran #${r.restaurant?.id || ""}`,
          date: r.createdAt
            ? new Date(r.createdAt).toLocaleDateString("tr-TR")
            : "",
          status: "Onaylandı",
        }));
        setReviews(mapped);
      } catch (err) {
        console.error(
          "Dashboard verileri yüklenemedi:",
          err?.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [navigate]);


  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      const updatePayload = {
        id: user.id,
        name: profileData.name,
        surname: profileData.surname,
        email: profileData.email,
        phoneNumber: profileData.phone,
        role: user.role,
      };

      const response = await axios.put("/api/users/update", updatePayload);
      if (response.status === 200) {
        const updatedUser = { ...user, ...updatePayload };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        alert("Bilgiler başarıyla güncellendi!");
      }
    } catch (err) {
      alert(err.response?.data || "Güncelleme hatası!");
    }
  };

  // --- ŞİFRE ---
  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (passwordData.new !== passwordData.confirm) {
      alert("Yeni şifreler eşleşmiyor!");
      return;
    }

    try {
      await axios.put("/api/users/update-password", {
        id: user.id,
        password: passwordData.new
      });

      alert("Şifre başarıyla güncellendi!");
      setPasswordData({ current: "", new: "", confirm: "" });
    } catch (err) {
      alert("Şifre güncellenirken hata oluştu.");
    }
  };


  // --- HESAP SİL ---
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Hesabınızı silmek istediğinize emin misiniz?"
    );
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`/api/users/${user.id}`);
      if (response.status === 200 || response.status === 204) {
        localStorage.clear();
        alert("Hoşça kalın!");
        navigate("/");
      }
    } catch (err) {
      alert("Hesap silinirken hata oluştu.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // =======================
  // ✅ REZERVASYON DÜZENLE
  // =======================
  const openEditModal = (res) => {
    const dt = new Date(res.reservationTime);
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const dd = String(dt.getDate()).padStart(2, "0");
    const hh = String(dt.getHours()).padStart(2, "0");
    const min = String(dt.getMinutes()).padStart(2, "0");

    setEditingRes({
      id: res.id,
      date: `${yyyy}-${mm}-${dd}`,
      time: `${hh}:${min}`,
      guests: res.numberOfGuests || 2,
    });
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setEditingRes(null);
  };

  const handleSaveEdit = async () => {
    if (!editingRes?.id) return;

    // ✅ Backend LocalDateTime.parse(...) için: "YYYY-MM-DDTHH:mm:ss"
    const reservationTime = `${editingRes.date}T${editingRes.time}:00`;

    try {
      const payload = {
        reservationTime,
        numberOfGuests: editingRes.guests,
      };

      // ✅ Controller: PUT /api/reservations/{id}/edit
      const res = await axios.put(
        `/api/reservations/${editingRes.id}/edit`,
        payload
      );

      const updated = res.data;
      setReservations((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r))
      );

      alert("Rezervasyon güncellendi!");
      closeEditModal();
    } catch (err) {
      console.error(
        "Rezervasyon güncelleme hatası:",
        err?.response?.data || err.message
      );
      alert(err?.response?.data || "Rezervasyon güncellenemedi!");
    }
  };

  // =======================
  // ✅ REZERVASYON İPTAL
  // =======================
  const handleCancelReservation = async (reservationId) => {
    const ok = window.confirm("Rezervasyonu iptal etmek istiyor musunuz?");
    if (!ok) return;

    try {
      const res = await axios.put(`/api/reservations/${reservationId}/cancel`);
      const updated = res.data;

      setReservations((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r))
      );

      alert("Rezervasyon iptal edildi.");
    } catch (err) {
      console.error(
        "Rezervasyon iptal hatası:",
        err?.response?.data || err.message
      );
      alert(err?.response?.data || "Rezervasyon iptal edilemedi!");
    }
  };

  // =======================
  // ✅ YOL TARİFİ (ŞİMDİLİK: location yazdır)
  // =======================
  const handleShowLocation = (res) => {
    const location = res?.restaurant?.location;
    if (!location) {
      alert("Bu rezervasyon için lokasyon bilgisi bulunamadı.");
      return;
    }
    alert(`Lokasyon: ${location}`);
  };

  if (!user) return null;
  if (loading) return <div className="loading-screen">Yükleniyor...</div>;

  const firstNameOnly = (profileData.name || "").split(" ")[0];

  return (
    <div className="dashboard-container">
      <Navbar />

      <div className="dashboard-wrapper">
        {/* SOL PANEL */}
        <aside className="sidebar-new">
          <div className="user-profile-card">
            <div className="avatar-circle">
              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${firstNameOnly}&backgroundColor=e11d48`}
                alt="Kullanıcı"
              />
              <span className="online-status"></span>
            </div>

            <h3 className="user-name-display">{firstNameOnly}</h3>
            <p className="user-role">Gurme Üye</p>

            <div className="user-stats-row">
              <div className="stat-item">
                <strong>{reservations.length}</strong>
                <span>Rezervasyon</span>
              </div>
              <div className="stat-item">
                <strong>{reviews.length}</strong>
                <span>Yorum</span>
              </div>
            </div>

            <nav className="sidebar-nav">
              <button
                className={`nav-item ${activeTab === "reservations" ? "active" : ""}`}
                onClick={() => setActiveTab("reservations")}
              >
                📅 Rezervasyonlarım
              </button>

              <button
                className={`nav-item ${activeTab === "reviews" ? "active" : ""}`}
                onClick={() => setActiveTab("reviews")}
              >
                ⭐ Değerlendirmelerim
              </button>


              <button
                className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
                onClick={() => setActiveTab("settings")}
              >
                ⚙️ Hesap Ayarları
              </button>

              <button className="nav-item logout-btn" onClick={handleLogout}>
                🚪 Çıkış Yap
              </button>
            </nav>

          </div>
        </aside>

        {/* SAĞ PANEL */}
        <main className="dashboard-content">
          {/* REZERVASYONLAR */}
          {activeTab === "reservations" && (
            <div className="animate-fade">
              <div className="dashboard-header">
                <div className="header-text">
                  <h1>Rezervasyonlarım</h1>
                  <p>Yaklaşan ve geçmiş restoran rezervasyonlarınızı yönetin.</p>
                </div>

                <button
                  className="premium-add-btn"
                  type="button"
                  onClick={() => navigate("/restoranlar")}
                >
                  + Yeni Rezervasyon
                </button>
              </div>

              <section className="dashboard-section">
                <h2 className="section-title">
                  Yaklaşan Etkinlikler <span>{reservations.length} Adet</span>
                </h2>

                <div className="reservation-list">
                  {reservations.length > 0 ? (
                    reservations.map((res) => (
                      <div key={res.id} className="premium-res-card">
                        <div className="res-card-image">
                          <img
                            src={res.restaurant?.imageUrl || "/images/default.jpg"}
                            alt="Restoran"
                          />
                          <span
                            className={`status-badge ${String(
                              res.status || ""
                            ).toLowerCase()}`}
                          >
                            {res.status === "CONFIRMED"
                              ? "ONAYLANDI"
                              : res.status === "CANCELLED"
                                ? "İPTAL"
                                : "BEKLİYOR"}
                          </span>
                        </div>

                        <div className="res-card-details">
                          <div className="res-card-header">
                            <h3>{res.restaurant?.name}</h3>
                            <span className="res-id-tag">#REZ-{res.id}</span>
                          </div>

                          <div className="res-meta-grid">
                            <span>
                              📅{" "}
                              {new Date(res.reservationTime).toLocaleDateString(
                                "tr-TR"
                              )}
                            </span>
                            <span>
                              ⏰{" "}
                              {new Date(res.reservationTime).toLocaleTimeString(
                                "tr-TR",
                                { hour: "2-digit", minute: "2-digit" }
                              )}
                            </span>
                            <span>👥 {res.numberOfGuests} Kişi</span>
                          </div>

                          <div className="res-card-actions">
                            <button
                              className="btn-action-light"
                              type="button"
                              onClick={() => openEditModal(res)}
                              disabled={res.status === "CANCELLED"}
                              title={
                                res.status === "CANCELLED"
                                  ? "İptal edilen rezervasyon düzenlenemez"
                                  : ""
                              }
                            >
                              📝 Düzenle
                            </button>

                            <button
                              className="btn-action-danger"
                              type="button"
                              onClick={() => handleCancelReservation(res.id)}
                              disabled={res.status === "CANCELLED"}
                              title={
                                res.status === "CANCELLED"
                                  ? "Zaten iptal edildi"
                                  : ""
                              }
                            >
                              ❌ İptal Et
                            </button>

                            <button
                              className="btn-action-primary"
                              type="button"
                              onClick={() => handleShowLocation(res)}
                            >
                              Yol Tarifi Al
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-data">
                      Henüz aktif bir rezervasyonunuz bulunmuyor.
                    </p>
                  )}
                </div>
              </section>
            </div>
          )}

          {/* DEĞERLENDİRMELER */}
          {activeTab === "reviews" && (
            <div className="reviews-view-container animate-fade">
              <div className="dashboard-header">
                <div className="header-text">
                  <h1>Değerlendirmelerim</h1>
                  <p>Deneyimlerinizi paylaştığınız mekanlar ve yorumlarınız.</p>
                </div>
              </div>

              <div className="reviews-list-grid">
                {reviews.length > 0 ? (
                  reviews.map((rev) => (
                    <div key={rev.id} className="review-card-modern">
                      <div className="review-card-header">
                        <h3>{rev.restaurantName}</h3>
                        <div className="stars">
                          {"⭐".repeat(
                            Math.max(0, Math.min(5, rev.rating))
                          )}
                        </div>
                      </div>
                      <p className="review-text">"{rev.comment}"</p>
                      <div className="review-footer">
                        <span className="review-date">{rev.date}</span>
                        <span className="status-pill">{rev.status}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-data">Henüz bir değerlendirme yapmadınız.</p>
                )}
              </div>
            </div>
          )}

          {/* AYARLAR */}
          {activeTab === "settings" && (
            <div className="settings-container animate-fade">
              <div className="dashboard-header">
                <div className="header-text">
                  <h1>Hesap Ayarları</h1>
                  <p>Profil bilgilerinizi ve güvenlik tercihlerinizi yönetin.</p>
                </div>
                <button className="btn-help-light">❓ Yardım Al</button>
              </div>

              <form
                className="settings-card main-info"
                onSubmit={handleUpdateProfile}
              >
                <div className="card-header-inline">
                  <div className="icon-box red">👤</div>
                  <div>
                    <h3>Kişisel Bilgiler</h3>
                    <p>Hesap ayrıntılarınızı güncelleyin</p>
                  </div>
                </div>

                <div className="form-grid compact">
                  <div className="input-field">
                    <label>Ad</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="input-field">
                    <label>Soyad</label>
                    <input
                      type="text"
                      value={profileData.surname}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          surname: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="input-field">
                    <label>E-posta Adresi</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="input-field">
                    <label>Telefon Numarası</label>
                    <input
                      type="text"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <button type="submit" className="btn-save-primary">
                  Değişiklikleri Kaydet
                </button>
              </form>

              <div className="settings-split-row">
                <form className="settings-card" onSubmit={handleUpdatePassword}>
                  <div className="card-header-inline">
                    <div className="icon-box orange">🔒</div>
                    <div>
                      <h3>Güvenlik</h3>
                      <p>Şifrenizi güncelleyin</p>
                    </div>
                  </div>
                  <div className="form-vertical-compact">
                    <div className="input-field">
                      <label>Mevcut Şifre</label>
                      <input
                        type="password"
                        value={passwordData.current}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            current: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="input-field">
                      <label>Yeni Şifre</label>
                      <input
                        type="password"
                        value={passwordData.new}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            new: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="input-field">
                      <label>Yeni Şifre (Tekrar)</label>
                      <input
                        type="password"
                        value={passwordData.confirm}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirm: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <button type="submit" className="btn-dark-compact">
                      Şifreyi Güncelle
                    </button>
                  </div>
                </form>

                <div className="settings-card">
                  <div className="card-header-inline">
                    <div className="icon-box blue">🔔</div>
                    <div>
                      <h3>Bildirimler</h3>
                      <p>İletişim tercihleri</p>
                    </div>
                  </div>
                  <div className="toggle-group">
                    <div className="toggle-item">
                      <span>Rezervasyon Güncellemeleri</span>
                      <label className="switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="danger-zone">
                <p>Diğer İşlemler</p>
                <div className="delete-account-card">
                  <div>
                    <h4>Hesap Silme</h4>
                    <p>Verileriniz kalıcı olarak silinir.</p>
                  </div>
                  <button
                    type="button"
                    className="btn-outline-danger"
                    onClick={handleDeleteAccount}
                  >
                    Hesabımı Sil
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ✅ DÜZENLE MODALI */}
      {isEditOpen && editingRes && (
        <div className="modal-overlay" onMouseDown={closeEditModal}>
          <div className="modal-card" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Rezervasyonu Düzenle</h3>
              <button
                className="modal-close"
                type="button"
                onClick={closeEditModal}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-row">
                <div className="modal-field">
                  <label>Tarih</label>
                  <input
                    type="date"
                    value={editingRes.date}
                    onChange={(e) =>
                      setEditingRes({ ...editingRes, date: e.target.value })
                    }
                  />
                </div>

                <div className="modal-field">
                  <label>Kişi</label>
                  <select
                    value={editingRes.guests}
                    onChange={(e) =>
                      setEditingRes({
                        ...editingRes,
                        guests: Number(e.target.value),
                      })
                    }
                  >
                    {guestOptions.map((g) => (
                      <option key={g} value={g}>
                        {g} Kişi
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-field">
                <label>Saat</label>
                <div className="time-grid">
                  {allTimeSlots.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`time-pill ${editingRes.time === t ? "active" : ""
                        }`}
                      onClick={() => setEditingRes({ ...editingRes, time: t })}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn-action-light"
                onClick={closeEditModal}
              >
                Vazgeç
              </button>
              <button
                type="button"
                className="btn-action-primary"
                onClick={handleSaveEdit}
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Dashboard;
