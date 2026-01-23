// AdminPanel.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../services/axiosConfig";
import "./AdminPanel.css";

const fmtDateTR = (d) =>
  new Date(d).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const fmtTimeTR = (d) =>
  new Date(d).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

const statusLabelTR = (s) => {
  const v = String(s || "").toUpperCase();
  if (v === "CONFIRMED") return "Onaylandı";
  if (v === "CANCELLED") return "İptal";
  return "Beklemede";
};

const statusClass = (s) => {
  const v = String(s || "").toUpperCase();
  if (v === "CONFIRMED") return "ok";
  if (v === "CANCELLED") return "bad";
  return "wait";
};

/** ✅ Kullanıcı durumu (sadece gösterim için; backend'de status yoksa ACTIVE say) */
const userStatusKey = (u) => {
  const raw = String(u?.status || u?.state || "").toUpperCase();
  if (raw === "PASSIVE" || raw === "PASIF" || raw === "DISABLED" || raw === "BANNED") return "PASSIVE";
  if (raw === "PENDING" || raw === "ONAY" || raw === "WAITING") return "PENDING";
  return "ACTIVE";
};

const userStatusLabelTR = (key) => {
  if (key === "ACTIVE") return "Aktif";
  if (key === "PASSIVE") return "Pasif";
  return "Onay Bekliyor";
};

const userStatusPillClass = (key) => {
  if (key === "ACTIVE") return "pill ok";
  if (key === "PASSIVE") return "pill bad";
  return "pill wait";
};

const roleKeyOf = (u) => {
  const r = String(u?.role || u?.userRole || u?.authority || "USER").toUpperCase();
  return r === "ADMIN" ? "ADMIN" : "USER";
};

const emptyRestaurantForm = {
  name: "",
  location: "",
  description: "",
  imageUrl: "",
  rating: "",
  priceRange: "",
  phone: "",
  email: "",
};

// ✅ AYARLAR (varsayılan)
const defaultSettings = {
  siteTitle: "İstanbul'un Lezzet Diyarı",
  supportEmail: "destek@r-venue.com",
  contactPhone: "+90 428 123 4567",
  metaDescription:
    "İstanbul'un eşsiz doğasında en iyi restoranları keşfedin, menüleri inceleyin ve anında rezervasyon yapın. Yöresel lezzetlerin buluşma noktası.",
  notifyEmail: true,
  notifySms: false,
  weeklyReport: true,
  logoUrl: "",
};

const LS_SETTINGS_KEY = "admin_settings";

const AdminPanel = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [reservations, setReservations] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  /** ✅ USERS */
  const [users, setUsers] = useState([]);

  const [activeMenu, setActiveMenu] = useState("panel"); // panel | reservations | restaurants | users | settings
  const [search, setSearch] = useState("");

  // Reservations filtreleri
  const [resvStatusFilter, setResvStatusFilter] = useState("ALL"); // ALL | PENDING | CONFIRMED | CANCELLED
  const [todayOnly, setTodayOnly] = useState(false);

  // Restaurants filtreleri
  const [restCuisineFilter, setRestCuisineFilter] = useState("ALL");

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // ✅ Restaurant modal
  const [restModalOpen, setRestModalOpen] = useState(false);
  const [restEditingId, setRestEditingId] = useState(null);
  const [restForm, setRestForm] = useState(emptyRestaurantForm);

  // ✅ User view modal
  const [userViewOpen, setUserViewOpen] = useState(false);
  const [userViewData, setUserViewData] = useState(null);

  // ✅ Settings
  const [settings, setSettings] = useState(defaultSettings);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const originalSettingsRef = useRef(defaultSettings);

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const fileInputRef = useRef(null);

  // basit admin guard
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "null");
    if (!u) {
      navigate("/giris");
      return;
    }
    if (u.role && String(u.role).toUpperCase() !== "ADMIN") {
      navigate("/");
      return;
    }
  }, [navigate]);

  const refreshAll = async () => {
    const r1 = await axios.get("/api/reservations/all");
    setReservations(r1.data || []);

    try {
      const r2 = await axios.get("/api/restaurants");
      setRestaurants(r2.data || []);
    } catch {
      setRestaurants([]);
    }

    // ✅ USERS (BACKEND: GET /api/users)
    try {
      const uRes = await axios.get("/api/users");
      const list = Array.isArray(uRes.data) ? uRes.data : [];
      setUsers(list);
    } catch (e) {
      console.error("Users fetch hatası:", e?.response?.data || e.message);
      setUsers([]);
    }
  };

  useEffect(() => {
    async function load() {
      try {
        await refreshAll();
      } catch (e) {
        console.error("AdminPanel yükleme hatası:", e?.response?.data || e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Menü / arama / filtre değişince pagination reset
  useEffect(() => {
    setPage(1);
  }, [activeMenu, search, resvStatusFilter, todayOnly, restCuisineFilter]);

  // ✅ Settings yükle (backend varsa)
  const loadSettings = async () => {
    setSettingsLoading(true);
    try {
      // 1) Backend dene
      try {
        const res = await axios.get("/api/settings");
        const data = res?.data && typeof res.data === "object" ? res.data : null;
        if (data) {
          const merged = { ...defaultSettings, ...data };
          setSettings(merged);
          originalSettingsRef.current = merged;
          setLogoPreview(merged.logoUrl || "");
          setLogoFile(null);
          localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(merged));
          return;
        }
      } catch (_) {
        // ignore
      }

      // 2) LocalStorage
      const raw = localStorage.getItem(LS_SETTINGS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const merged = { ...defaultSettings, ...(parsed || {}) };
        setSettings(merged);
        originalSettingsRef.current = merged;
        setLogoPreview(merged.logoUrl || "");
        setLogoFile(null);
        return;
      }

      // 3) Default
      setSettings(defaultSettings);
      originalSettingsRef.current = defaultSettings;
      setLogoPreview(defaultSettings.logoUrl || "");
      setLogoFile(null);
    } finally {
      setSettingsLoading(false);
    }
  };

  // Ayarlar menüsüne girince yükle
  useEffect(() => {
    if (activeMenu === "settings") {
      loadSettings();
      setSearch(""); // ayarlarda arama yok
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMenu]);

  const saveSettings = async () => {
    setSettingsSaving(true);
    try {
      const payload = {
        siteTitle: String(settings.siteTitle || "").trim(),
        supportEmail: String(settings.supportEmail || "").trim(),
        contactPhone: String(settings.contactPhone || "").trim(),
        metaDescription: String(settings.metaDescription || ""),
        notifyEmail: !!settings.notifyEmail,
        notifySms: !!settings.notifySms,
        weeklyReport: !!settings.weeklyReport,
        logoUrl: String(settings.logoUrl || ""),
      };

      if (!payload.siteTitle) {
        alert("Site başlığı boş olamaz.");
        return;
      }

      // 1) Logo upload (varsa)
      let uploadedLogoUrl = payload.logoUrl;
      if (logoFile) {
        const okSize = logoFile.size <= 2 * 1024 * 1024;
        if (!okSize) {
          alert("Logo dosyası maksimum 2MB olmalı.");
          return;
        }

        const fd = new FormData();
        fd.append("file", logoFile);

        try {
          const up = await axios.post("/api/settings/logo", fd, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          if (up?.data?.logoUrl) {
            uploadedLogoUrl = up.data.logoUrl;
          }
        } catch (e) {
          console.warn("Logo upload endpoint bulunamadı ya da hata:", e?.response?.data || e.message);
        }
      }

      const finalPayload = { ...payload, logoUrl: uploadedLogoUrl };

      // 2) Ayarları backend'e kaydetmeyi dene
      try {
        const res = await axios.put("/api/settings", finalPayload);
        const saved = res?.data && typeof res.data === "object" ? { ...finalPayload, ...res.data } : finalPayload;
        setSettings(saved);
        originalSettingsRef.current = saved;
        setLogoPreview(saved.logoUrl || logoPreview || "");
        setLogoFile(null);
        localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(saved));
        alert("Ayarlar kaydedildi!");
        return;
      } catch (e) {
        // ignore -> localStorage fallback
      }

      // 3) LocalStorage fallback
      setSettings(finalPayload);
      originalSettingsRef.current = finalPayload;
      setLogoPreview(finalPayload.logoUrl || logoPreview || "");
      setLogoFile(null);
      localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(finalPayload));
      alert("Ayarlar kaydedildi! (LocalStorage)");
    } catch (err) {
      console.error("Ayar kaydetme hatası:", err?.response?.data || err.message);
      alert(err?.response?.data || "Ayarlar kaydedilemedi!");
    } finally {
      setSettingsSaving(false);
    }
  };

  const cancelSettingsChanges = () => {
    const back = originalSettingsRef.current || defaultSettings;
    setSettings(back);
    setLogoFile(null);
    setLogoPreview(back.logoUrl || "");
  };

  const onPickLogo = (file) => {
    if (!file) return;

    const allowed = ["image/png", "image/jpeg", "image/svg+xml", "image/jpg"];
    if (!allowed.includes(file.type)) {
      alert("Sadece PNG, JPG veya SVG dosyası yükleyin.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("Maksimum dosya boyutu 2MB.");
      return;
    }

    setLogoFile(file);
    const url = URL.createObjectURL(file);
    setLogoPreview(url);
  };

  // ✅ ADMIN: Rezervasyon durumunu güncelle (Onayla / İptal) — fallback’li
  const setReservationStatus = async (reservationId, newStatus) => {
    const status = String(newStatus).toUpperCase();

    const tryCalls = [
      () => axios.put(`/api/reservations/${reservationId}/status?status=${encodeURIComponent(status)}`),
      () => axios.put(`/api/reservations/${reservationId}/status`, { status }),
      () =>
        status === "CONFIRMED"
          ? axios.put(`/api/reservations/${reservationId}/confirm`)
          : axios.put(`/api/reservations/${reservationId}/cancel`),
      () => axios.put(`/api/reservations/${reservationId}`, { status }),
    ];

    let updated = null;
    for (const call of tryCalls) {
      try {
        const res = await call();
        if (res?.data && typeof res.data === "object") updated = res.data;
        break;
      } catch (e) { }
    }

    if (updated?.id) {
      setReservations((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      return;
    }

    try {
      await refreshAll();
    } catch (err) {
      console.error("Status refresh hatası:", err?.response?.data || err.message);
      alert(err?.response?.data || "Durum güncellenemedi!");
    }
  };

  const handleApprove = (id) => {
    const ok = window.confirm("Rezervasyonu ONAYLAMAK istiyor musunuz?");
    if (!ok) return;
    setReservationStatus(id, "CONFIRMED");
  };

  const handleReject = (id) => {
    const ok = window.confirm("Rezervasyonu REDDETMEK / İPTAL etmek istiyor musunuz?");
    if (!ok) return;
    setReservationStatus(id, "CANCELLED");
  };

  // ✅ Restaurant CRUD
  const openCreateRestaurant = () => {
    setRestEditingId(null);
    setRestForm(emptyRestaurantForm);
    setRestModalOpen(true);
  };

  const openEditRestaurant = (r) => {
    setRestEditingId(r?.id ?? null);
    setRestForm({
      name: r?.name || "",
      location: r?.location || "",
      description: r?.description || "",
      imageUrl: r?.imageUrl || "",
      rating: r?.rating ?? "",
      priceRange: r?.priceRange || "",
      phone: r?.phone || "",
      email: r?.email || "",
    });
    setRestModalOpen(true);
  };

  const closeRestModal = () => {
    setRestModalOpen(false);
    setRestEditingId(null);
    setRestForm(emptyRestaurantForm);
  };

  const saveRestaurant = async () => {
    try {
      if (!restForm.name.trim()) {
        alert("Restoran adı boş olamaz.");
        return;
      }

      const payload = {
        name: restForm.name.trim(),
        location: restForm.location?.trim() || "",
        description: restForm.description || "",
        imageUrl: restForm.imageUrl?.trim() || "",
        rating: restForm.rating === "" ? null : Number(restForm.rating),
        priceRange: restForm.priceRange || "",
        phone: restForm.phone?.trim() || "",
        email: restForm.email?.trim() || "",
      };

      let res;
      if (restEditingId) {
        res = await axios.put(`/api/restaurants/${restEditingId}`, payload);
      } else {
        res = await axios.post(`/api/restaurants`, payload);
      }

      const saved = res?.data;
      if (saved?.id) {
        setRestaurants((prev) => {
          const exists = prev.some((x) => x.id === saved.id);
          return exists ? prev.map((x) => (x.id === saved.id ? saved : x)) : [saved, ...prev];
        });
      } else {
        await refreshAll();
      }

      alert(restEditingId ? "Restoran güncellendi!" : "Restoran eklendi!");
      closeRestModal();
    } catch (err) {
      console.error("Restoran kaydetme hatası:", err?.response?.data || err.message);
      alert(err?.response?.data || "Restoran kaydedilemedi!");
    }
  };

  // ✅ RESTORAN SİL (👁 kaldırıldı, yerine 🗑 aktif)
  const deleteRestaurant = async (r) => {
    const id = r?.id;
    if (!id) return;

    const name = r?.name || `#${id}`;
    const ok = window.confirm(`"${name}" restoranını SİLMEK istiyor musunuz?`);
    if (!ok) return;

    const before = restaurants;
    setRestaurants((prev) => prev.filter((x) => x.id !== id));

    try {
      await axios.delete(`/api/restaurants/${id}`);
    } catch (err) {
      console.error("Restoran silme hatası:", err?.response?.data || err.message);
      alert(err?.response?.data || "Restoran silinemedi!");
      setRestaurants(before);
      return;
    }

    // listeyi tazele (ilişkili kayıtlar vs. için)
    try {
      await refreshAll();
    } catch (_) { }
  };

  /**
   * ✅ ROL GÜNCELLE (backend endpoint: PUT /api/users/{id}/role body:{role})
   */
  const updateUserRole = async (userId, newRole) => {
    const role = String(newRole).toUpperCase();

    const before = users;
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));

    try {
      const res = await axios.put(`/api/users/${userId}/role`, { role });
      const updated = res?.data;
      if (updated?.id) {
        setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
      } else {
        await refreshAll();
      }
    } catch (err) {
      console.error("Rol güncelleme hatası:", err?.response?.data || err.message);
      alert(err?.response?.data || "Rol güncellenemedi");
      setUsers(before);
    }
  };

  const toggleUserRole = (u) => {
    if (!u?.id) return;

    const current = roleKeyOf(u);
    const next = current === "ADMIN" ? "USER" : "ADMIN";

    const fullName = `${u?.name || ""} ${u?.surname || ""}`.trim() || "Kullanıcı";
    const ok = window.confirm(`${fullName} rolü "${current}" → "${next}" olarak değişsin mi?`);
    if (!ok) return;

    updateUserRole(u.id, next);
  };

  const deleteUser = async (u) => {
    const id = u?.id;
    if (!id) return;

    const fullName = `${u?.name || ""} ${u?.surname || ""}`.trim() || "Kullanıcı";
    const ok = window.confirm(`${fullName} kullanıcısını tamamen silmek istiyor musunuz?`);
    if (!ok) return;

    const before = users;
    setUsers((prev) => prev.filter((x) => x.id !== id));

    if (userViewOpen && userViewData?.id === id) {
      setUserViewOpen(false);
      setUserViewData(null);
    }

    try {
      await axios.delete(`/api/users/${id}`);
    } catch (err) {
      console.error("Kullanıcı silme hatası:", err?.response?.data || err.message);
      alert(err?.response?.data || "Kullanıcı silinemedi");
      setUsers(before);
    }
  };

  const openUserView = (u) => {
    setUserViewData(u);
    setUserViewOpen(true);
  };
  const closeUserView = () => {
    setUserViewOpen(false);
    setUserViewData(null);
  };

  const metrics = useMemo(() => {
    const totalReservations = reservations.length;
    const cancelled = reservations.filter((x) => String(x.status).toUpperCase() === "CANCELLED").length;
    const cancelRate = totalReservations > 0 ? (cancelled / totalReservations) * 100 : 0;

    const activeRestaurants = restaurants.length;
    const totalUsers = users.length;

    return { totalReservations, activeRestaurants, totalUsers, cancelRate };
  }, [reservations, restaurants, users]);

  const pendingCount = useMemo(
    () => reservations.filter((r) => String(r.status).toUpperCase() === "PENDING").length,
    [reservations]
  );

  // ======= OVERVIEW (panel) =======
  const recentReservations = useMemo(() => {
    const list = [...reservations];
    list.sort((a, b) => new Date(b.reservationTime) - new Date(a.reservationTime));
    return list.slice(0, 6);
  }, [reservations]);

  const trendRestaurants = useMemo(() => {
    const list = [...restaurants];
    list.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    return list.slice(0, 3);
  }, [restaurants]);

  // ======= RESERVATIONS (manage) =======
  const filteredReservations = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = [...reservations];

    if (resvStatusFilter !== "ALL") {
      list = list.filter((x) => String(x.status).toUpperCase() === resvStatusFilter);
    }

    if (todayOnly) {
      const now = new Date();
      const y = now.getFullYear();
      const m = now.getMonth();
      const d = now.getDate();
      list = list.filter((x) => {
        const dt = new Date(x.reservationTime);
        return dt.getFullYear() === y && dt.getMonth() === m && dt.getDate() === d;
      });
    }

    if (q) {
      list = list.filter((x) => {
        const userName = `${x.user?.name || ""} ${x.user?.surname || ""}`.trim().toLowerCase();
        const restaurantName = (x.restaurant?.name || "").toLowerCase();
        const phone = (x.user?.phoneNumber || x.user?.phone || "").toLowerCase();
        return userName.includes(q) || restaurantName.includes(q) || phone.includes(q) || String(x.id || "").includes(q);
      });
    }

    list.sort((a, b) => new Date(b.reservationTime) - new Date(a.reservationTime));
    return list;
  }, [reservations, search, resvStatusFilter, todayOnly]);

  const resvTotalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredReservations.length / pageSize)),
    [filteredReservations.length]
  );

  const resvPageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredReservations.slice(start, start + pageSize);
  }, [filteredReservations, page]);

  // ======= RESTAURANTS (manage) =======
  const cuisineOptions = useMemo(() => {
    const set = new Set();
    restaurants.forEach((r) => {
      if (r.category) set.add(r.category);
      if (r.cuisineType) set.add(r.cuisineType);
    });
    return ["ALL", ...Array.from(set)];
  }, [restaurants]);

  const filteredRestaurants = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = [...restaurants];

    if (restCuisineFilter !== "ALL") {
      list = list.filter((r) => (r.category || r.cuisineType || "").toLowerCase() === restCuisineFilter.toLowerCase());
    }

    if (q) {
      list = list.filter((r) => {
        const name = (r.name || "").toLowerCase();
        const loc = (r.location || "").toLowerCase();
        const cat = (r.category || r.cuisineType || "").toLowerCase();
        const phone = (r.phone || "").toLowerCase();
        const email = (r.email || "").toLowerCase();
        return name.includes(q) || loc.includes(q) || cat.includes(q) || phone.includes(q) || email.includes(q) || String(r.id || "").includes(q);
      });
    }

    list.sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "tr"));
    return list;
  }, [restaurants, search, restCuisineFilter]);

  const restTotalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredRestaurants.length / pageSize)),
    [filteredRestaurants.length]
  );

  const restPageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRestaurants.slice(start, start + pageSize);
  }, [filteredRestaurants, page]);

  // ======= USERS (manage) =======
  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = [...users];

    if (q) {
      list = list.filter((u) => {
        const full = `${u?.name || ""} ${u?.surname || ""}`.trim().toLowerCase();
        const email = String(u?.email || "").toLowerCase();
        const phone = String(u?.phoneNumber || u?.phone || "").toLowerCase();
        const id = String(u?.id || "");
        return full.includes(q) || email.includes(q) || phone.includes(q) || id.includes(q);
      });
    }

    return list;
  }, [users, search]);

  const userTotalPages = useMemo(() => Math.max(1, Math.ceil(filteredUsers.length / pageSize)), [filteredUsers.length]);

  const userPageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, page]);

  const todayTR = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
  }, []);

  const adminUser = JSON.parse(localStorage.getItem("user") || "null");
  const adminName = adminUser?.name || "Sistem Yöneticisi";
  const adminMail = adminUser?.email || "admin@r-venue.com";

  if (loading) return <div className="admin-loading">Yükleniyor...</div>;

  const topTitle =
    activeMenu === "panel"
      ? "Genel Bakış"
      : activeMenu === "reservations"
        ? "Rezervasyonlar"
        : activeMenu === "restaurants"
          ? "Restoran Yönetimi"
          : activeMenu === "users"
            ? "Kullanıcılar"
            : "Sistem Ayarları";

  const topSub =
    activeMenu === "panel"
      ? `Bugün, ${todayTR}`
      : activeMenu === "reservations"
        ? "Tüm restoran rezervasyonlarını yönetin"
        : activeMenu === "restaurants"
          ? "Platformdaki tüm mekanların listesi"
          : activeMenu === "users"
            ? "Platformdaki kullanıcılar (görüntüleme + rol + silme)"
            : "Platform genel yapılandırma ve tercihleri";

  const searchPlaceholder =
    activeMenu === "restaurants"
      ? "Restoran ara..."
      : activeMenu === "users"
        ? "İsim, e-posta veya telefon..."
        : "Rezervasyon no, isim veya restoran";

  const showSearch = activeMenu !== "settings";

  return (
    <div className="admin-shell">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="brand-logo">🍽️</div>
          <div className="brand-text">
            <div className="brand-title">
              R-Venue<span>Admin</span>
            </div>
          </div>
        </div>

        <div className="admin-section-label">GENEL BAKIŞ</div>

        <button className={`side-item ${activeMenu === "panel" ? "active" : ""}`} onClick={() => setActiveMenu("panel")} type="button">
          <span className="side-ico">▦</span>
          Panel
        </button>

        <button className={`side-item ${activeMenu === "reservations" ? "active" : ""}`} onClick={() => setActiveMenu("reservations")} type="button">
          <span className="side-ico">📅</span>
          Rezervasyonlar
          <span className="side-badge">{pendingCount}</span>
        </button>

        <button className={`side-item ${activeMenu === "restaurants" ? "active" : ""}`} onClick={() => setActiveMenu("restaurants")} type="button">
          <span className="side-ico">🏪</span>
          Restoranlar
        </button>

        <button className={`side-item ${activeMenu === "users" ? "active" : ""}`} onClick={() => setActiveMenu("users")} type="button">
          <span className="side-ico">👥</span>
          Kullanıcılar
        </button>

        <div className="admin-section-label">YÖNETİM</div>
        <button
          className="side-item"
          type="button"
          onClick={() => {
            window.location.href = "http://localhost:8080/admin/summary";
          }}
        >
          <span className="side-ico">📊</span>
          Admin Summary
        </button>


        <button className={`side-item ${activeMenu === "settings" ? "active" : ""}`} type="button" onClick={() => setActiveMenu("settings")}>
          <span className="side-ico">⚙️</span>
          Ayarlar
        </button>

        <div className="admin-profile">
          <div className="admin-avatar">
            {(adminName || "A")
              .split(" ")
              .filter(Boolean)
              .slice(0, 2)
              .map((x) => x[0]?.toUpperCase())
              .join("")}
          </div>
          <div className="admin-profile-text">
            <div className="admin-profile-name">{adminName}</div>
            <div className="admin-profile-mail">{adminMail}</div>
          </div>
          <button
            className="admin-profile-logout"
            type="button"
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
            title="Çıkış"
          >
            ⎋
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="admin-main">
        {/* TOP BAR */}
        <div className="admin-topbar">
          <div>
            <h1 className="admin-title">{topTitle}</h1>
            <p className="admin-subtitle">{topSub}</p>
          </div>

          <div className="topbar-right">
            {showSearch ? (
              <div className="search-wrap">
                <span className="search-ico">🔎</span>
                <input className="search-input" placeholder={searchPlaceholder} value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            ) : (
              <div className="topbar-spacer" />
            )}

            <button className="notif-btn" type="button" title="Bildirimler">
              🔔
              <span className="notif-dot" />
            </button>
          </div>
        </div>

        {/* PANEL */}
        {activeMenu === "panel" && (
          <div className="admin-grid">
            <div className="stat-card">
              <div className="stat-head">
                <div className="stat-label">Toplam Rezervasyon</div>
                <div className="stat-ico pink">🎟️</div>
              </div>
              <div className="stat-value">{metrics.totalReservations.toLocaleString("tr-TR")}</div>
              <div className="stat-foot">
                <span className="chip up">+12.5%</span>
                <span className="muted">Geçen aya göre</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-head">
                <div className="stat-label">Aktif Restoranlar</div>
                <div className="stat-ico blue">🏪</div>
              </div>
              <div className="stat-value">{metrics.activeRestaurants.toLocaleString("tr-TR")}</div>
              <div className="stat-foot">
                <span className="chip info">+3 Yeni</span>
                <span className="muted">Bu hafta</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-head">
                <div className="stat-label">Toplam Üye</div>
                <div className="stat-ico purple">👥</div>
              </div>
              <div className="stat-value">{(metrics.totalUsers || 0).toLocaleString("tr-TR")}</div>
              <div className="stat-foot">
                <span className="chip up">+5.2%</span>
                <span className="muted">Geçen haftaya göre</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-head">
                <div className="stat-label">İptal Oranı</div>
                <div className="stat-ico orange">🚫</div>
              </div>
              <div className="stat-value">{metrics.cancelRate.toFixed(1)}%</div>
              <div className="stat-foot">
                <span className="chip down">-0.4%</span>
                <span className="muted">İyileşme</span>
              </div>
            </div>

            <section className="panel-card wide">
              <div className="panel-head">
                <div className="panel-title">
                  <span className="panel-title-ico">🧾</span> Son Rezervasyonlar
                </div>
              </div>

              <div className="table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>MÜŞTERİ</th>
                      <th>MEKAN</th>
                      <th>TARİH</th>
                      <th>KİŞİ</th>
                      <th>DURUM</th>
                      <th>İŞLEM</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentReservations.length > 0 ? (
                      recentReservations.map((r) => {
                        const u = r.user || {};
                        const rest = r.restaurant || {};
                        const initials = `${(u.name || "U")[0] || "U"}${(u.surname || "S")[0] || ""}`.toUpperCase();

                        return (
                          <tr key={r.id}>
                            <td>
                              <div className="cust">
                                <div className="cust-avatar">{initials}</div>
                                <div className="cust-meta">
                                  <div className="cust-name">
                                    {(u.name || "")} {(u.surname || "")}
                                  </div>
                                  <div className="cust-sub">
                                    {(u.phoneNumber || u.phone || "").trim()
                                      ? `+90 ${String(u.phoneNumber || u.phone).replace("+90", "").trim()}`
                                      : u.email || ""}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="place">{rest.name || "-"}</td>

                            <td className="datecol">
                              <div>{fmtDateTR(r.reservationTime)}</div>
                              <div className="muted">{fmtTimeTR(r.reservationTime)}</div>
                            </td>

                            <td>{r.numberOfGuests || "-"} Kişi</td>

                            <td>
                              <span className={`pill ${statusClass(r.status)}`}>{statusLabelTR(r.status)}</span>
                            </td>

                            <td>
                              <button type="button" className="dots-btn" onClick={() => setActiveMenu("reservations")} title="Rezervasyonlara git">
                                ⋮
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" className="empty-td">
                          Kayıt bulunamadı.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <aside className="panel-card side">
              <div className="panel-head">
                <div className="panel-title">Trend Mekanlar</div>
              </div>

              <div className="trend-list">
                {trendRestaurants.length > 0 ? (
                  trendRestaurants.map((t) => (
                    <div key={t.id} className="trend-item">
                      <img
                        className="trend-img"
                        src={t.imageUrl || "https://via.placeholder.com/56"}
                        alt={t.name}
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/56";
                        }}
                      />
                      <div className="trend-meta">
                        <div className="trend-name">{t.name}</div>
                        <div className="trend-sub">
                          {(t.category || "Popüler")} • {(t.location || "").slice(0, 18)}
                          {(t.location || "").length > 18 ? "..." : ""}
                        </div>
                      </div>
                      <div className="trend-rate">
                        <div className="trend-score">{Number(t.rating || 0).toFixed(1)} ★</div>
                        <div className="trend-rev muted">{Math.floor(Math.random() * 200 + 20)} Yorum</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="muted" style={{ padding: 12 }}>
                    Trend için restoran verisi yok.
                  </div>
                )}
              </div>
            </aside>
          </div>
        )}

        {/* REZERVASYONLAR */}
        {activeMenu === "reservations" && (
          <div className="admin-page">
            <div className="page-toolbar">
              <div className="toolbar-left" />

              <div className="toolbar-right">
                <select className="soft-select" value={resvStatusFilter} onChange={(e) => setResvStatusFilter(e.target.value)}>
                  <option value="ALL">Tüm Durumlar</option>
                  <option value="PENDING">Beklemede</option>
                  <option value="CONFIRMED">Onaylandı</option>
                  <option value="CANCELLED">İptal</option>
                </select>

                <button type="button" className={`soft-btn ${todayOnly ? "active" : ""}`} onClick={() => setTodayOnly((p) => !p)}>
                  📅 Bugün
                </button>
              </div>
            </div>

            <section className="panel-card wide">
              <div className="table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>REZERVASYON ID</th>
                      <th>MÜŞTERİ BİLGİSİ</th>
                      <th>RESTORAN</th>
                      <th>TARİH & SAAT</th>
                      <th>KİŞİ</th>
                      <th>DURUM</th>
                      <th style={{ textAlign: "right" }}>İŞLEMLER</th>
                    </tr>
                  </thead>

                  <tbody>
                    {resvPageItems.length > 0 ? (
                      resvPageItems.map((r) => {
                        const u = r.user || {};
                        const rest = r.restaurant || {};
                        const initials = `${(u.name || "U")[0] || "U"}${(u.surname || "S")[0] || ""}`.toUpperCase();
                        const st = String(r.status || "").toUpperCase();

                        return (
                          <tr key={r.id}>
                            <td className="muted">#REZ-{r.id}</td>

                            <td>
                              <div className="cust">
                                <div className="cust-avatar">{initials}</div>
                                <div className="cust-meta">
                                  <div className="cust-name">
                                    {(u.name || "")} {(u.surname || "")}
                                  </div>
                                  <div className="cust-sub">{u.email || "-"}</div>
                                </div>
                              </div>
                            </td>

                            <td className="place">{rest.name || "-"}</td>

                            <td className="datecol">
                              <div>{fmtDateTR(r.reservationTime)}</div>
                              <div className="muted">{fmtTimeTR(r.reservationTime)}</div>
                            </td>

                            <td>
                              <span className="mini-chip">👥 {r.numberOfGuests || "-"} </span>
                            </td>

                            <td>
                              <span className={`pill ${statusClass(r.status)}`}>{statusLabelTR(r.status)}</span>
                            </td>

                            <td style={{ textAlign: "right" }}>
                              <button
                                type="button"
                                className="ico-btn ok"
                                title="Onayla"
                                onClick={() => handleApprove(r.id)}
                                disabled={st === "CONFIRMED"}
                                style={{
                                  opacity: st === "CONFIRMED" ? 0.45 : 1,
                                  cursor: st === "CONFIRMED" ? "not-allowed" : "pointer",
                                }}
                              >
                                ✓
                              </button>

                              <button
                                type="button"
                                className="ico-btn bad"
                                title="Reddet / İptal Et"
                                onClick={() => handleReject(r.id)}
                                disabled={st === "CANCELLED"}
                                style={{
                                  opacity: st === "CANCELLED" ? 0.45 : 1,
                                  cursor: st === "CANCELLED" ? "not-allowed" : "pointer",
                                }}
                              >
                                ✕
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="7" className="empty-td">
                          Kayıt bulunamadı.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="pager">
                <div className="muted">
                  Toplam <b>{filteredReservations.length}</b> kayıttan{" "}
                  <b>{filteredReservations.length ? (page - 1) * pageSize + 1 : 0}</b>-<b>{Math.min(page * pageSize, filteredReservations.length)}</b> arası gösteriliyor
                </div>

                <div className="pager-btns">
                  <button className="soft-btn" type="button" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                    Önceki
                  </button>

                  <button className="page-pill" type="button">
                    {page}
                  </button>

                  <button className="soft-btn" type="button" disabled={page >= resvTotalPages} onClick={() => setPage((p) => Math.min(resvTotalPages, p + 1))}>
                    Sonraki
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* RESTORANLAR */}
        {activeMenu === "restaurants" && (
          <div className="admin-page">
            <div className="page-toolbar">
              <div className="toolbar-left" />

              <div className="toolbar-right">
                <select className="soft-select" value={restCuisineFilter} onChange={(e) => setRestCuisineFilter(e.target.value)}>
                  <option value="ALL">Mutfak Türü</option>
                  {cuisineOptions
                    .filter((x) => x !== "ALL")
                    .map((x) => (
                      <option key={x} value={x}>
                        {x}
                      </option>
                    ))}
                </select>

                <button type="button" className="create-btn" onClick={openCreateRestaurant}>
                  + Yeni Restoran Ekle
                </button>
              </div>
            </div>

            <section className="panel-card wide">
              <div className="table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>RESTORAN</th>
                      <th>ADRES & KONUM</th>
                      <th>İLETİŞİM</th>
                      <th>MENÜ</th>
                      <th style={{ textAlign: "right" }}>İŞLEMLER</th>
                    </tr>
                  </thead>

                  <tbody>
                    {restPageItems.length > 0 ? (
                      restPageItems.map((r) => (
                        <tr key={r.id}>
                          <td>
                            <div className="rest-cell">
                              <img
                                className="rest-avatar"
                                src={r.imageUrl || "https://via.placeholder.com/52"}
                                alt={r.name}
                                onError={(e) => {
                                  e.currentTarget.src = "https://via.placeholder.com/52";
                                }}
                              />
                              <div className="rest-meta">
                                <div className="rest-name">{r.name}</div>
                                <div className="rest-tags muted">
                                  {r.category || r.cuisineType || "Popüler"}
                                  {r.priceRange ? ` • ${r.priceRange}` : ""}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td>
                            <div className="muted">
                              {(r.location || "-").slice(0, 32)}
                              {(r.location || "").length > 32 ? "..." : ""}
                            </div>
                            <div className="muted" style={{ marginTop: 4 }}>
                              {(r.location || "").split(",").slice(-2).join(",").trim() || ""}
                            </div>
                          </td>

                          <td>
                            <div className="muted">📞 {r.phone || "+90 --- --- ----"}</div>
                            <div className="muted">✉️ {r.email || "-"}</div>
                          </td>

                          <td>
                            <button type="button" className="ico-btn" title="Menüyü Gör" onClick={() => navigate(`/restoranlar/${r.id}/menu`)}>
                              📖
                            </button>
                          </td>

                          <td style={{ textAlign: "right" }}>
                            <button type="button" className="ico-btn" title="Düzenle" onClick={() => openEditRestaurant(r)}>
                              ✎
                            </button>

                            {/* 👁 kaldırıldı -> 🗑 silme aktif */}
                            <button type="button" className="ico-btn bad" title="Restoranı Sil" onClick={() => deleteRestaurant(r)}>
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="empty-td">
                          Restoran bulunamadı.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="pager">
                <div className="muted">
                  Toplam <b>{filteredRestaurants.length}</b> restoran gösteriliyor
                </div>

                <div className="pager-btns">
                  <button className="soft-btn" type="button" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                    Önceki
                  </button>

                  <button className="page-pill" type="button">
                    {page}
                  </button>

                  <button className="soft-btn" type="button" disabled={page >= restTotalPages} onClick={() => setPage((p) => Math.min(restTotalPages, p + 1))}>
                    Sonraki
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* USERS */}
        {activeMenu === "users" && (
          <div className="admin-page">
            <section className="panel-card wide">
              <div className="table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>KULLANICI</th>
                      <th>İLETİŞİM</th>
                      <th>ROL</th>
                      <th>DURUM</th>
                      <th style={{ textAlign: "right" }}>İŞLEMLER</th>
                    </tr>
                  </thead>

                  <tbody>
                    {userPageItems.length > 0 ? (
                      userPageItems.map((u) => {
                        const fullName = `${u?.name || ""} ${u?.surname || ""}`.trim() || "Kullanıcı";
                        const email = u?.email || "-";
                        const phone = u?.phoneNumber || u?.phone || "-";
                        const statusKey = userStatusKey(u);
                        const roleKey = roleKeyOf(u);

                        const initials = fullName
                          .split(" ")
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((x) => x[0]?.toUpperCase())
                          .join("");

                        return (
                          <tr key={u?.id ?? `${email}-${fullName}`}>
                            <td>
                              <div className="cust">
                                <div className="cust-avatar">{initials || "U"}</div>
                                <div className="cust-meta">
                                  <div className="cust-name">{fullName}</div>
                                  <div className="cust-sub">ID: #{u?.id ?? "-"}</div>
                                </div>
                              </div>
                            </td>

                            <td>
                              <div className="muted">✉ {email}</div>
                              <div className="muted">☎ {phone}</div>
                            </td>

                            <td>
                              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                                <span className={`pill ${roleKey === "ADMIN" ? "ok" : "wait"}`}>{roleKey}</span>

                                <button type="button" className="soft-btn role-change-btn" onClick={() => toggleUserRole(u)} title="Rolü değiştir (USER ↔ ADMIN)">
                                  Rolü Değiştir
                                </button>
                              </div>
                            </td>

                            <td>
                              <span className={userStatusPillClass(statusKey)}>{userStatusLabelTR(statusKey)}</span>
                            </td>

                            <td style={{ textAlign: "right" }}>
                              <button type="button" className="ico-btn" title="Görüntüle" onClick={() => openUserView(u)}>
                                👁
                              </button>

                              <button type="button" className="ico-btn bad" title="Sil" onClick={() => deleteUser(u)}>
                                🗑️
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="5" className="empty-td">
                          Kullanıcı bulunamadı.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="pager">
                <div className="muted">
                  Toplam <b>{filteredUsers.length}</b> kullanıcıdan{" "}
                  <b>{filteredUsers.length ? (page - 1) * pageSize + 1 : 0}</b>-<b>{Math.min(page * pageSize, filteredUsers.length)}</b> arası gösteriliyor
                </div>

                <div className="pager-btns">
                  <button className="soft-btn" type="button" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                    Önceki
                  </button>

                  <button className="page-pill" type="button">
                    {page}
                  </button>

                  <button className="soft-btn" type="button" disabled={page >= userTotalPages} onClick={() => setPage((p) => Math.min(userTotalPages, p + 1))}>
                    Sonraki
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ✅ SETTINGS */}
        {activeMenu === "settings" && (
          <div className="admin-page">
            <div className="settings-shell">
              <div className="settings-grid-top">
                {/* Genel Bilgiler */}
                <section className="settings-card">
                  <div className="settings-card-head">
                    <div className="settings-card-title">
                      <span className="settings-ico">ℹ️</span>
                      Genel Bilgiler
                    </div>
                    <div className="settings-card-sub">Platform bilgilerini yönetin</div>
                  </div>

                  {settingsLoading ? (
                    <div className="muted" style={{ padding: 14 }}>
                      Yükleniyor...
                    </div>
                  ) : (
                    <div className="settings-form">
                      <div className="input-field">
                        <label>Site Başlığı</label>
                        <input
                          type="text"
                          value={settings.siteTitle}
                          onChange={(e) => setSettings((p) => ({ ...p, siteTitle: e.target.value }))}
                          placeholder="Örn: İstanbul Lezzet Diyarı"
                        />
                        <div className="help-text">Tarayıcı sekmesinde ve arama motorlarında görünecek başlık.</div>
                      </div>

                      <div className="two-col">
                        <div className="input-field">
                          <label>Destek E-posta</label>
                          <div className="icon-input">
                            <span className="in-ico">✉️</span>
                            <input
                              type="email"
                              value={settings.supportEmail}
                              onChange={(e) => setSettings((p) => ({ ...p, supportEmail: e.target.value }))}
                              placeholder="destek@site.com"
                            />
                          </div>
                        </div>

                        <div className="input-field">
                          <label>İletişim Telefonu</label>
                          <div className="icon-input">
                            <span className="in-ico">📞</span>
                            <input
                              type="text"
                              value={settings.contactPhone}
                              onChange={(e) => setSettings((p) => ({ ...p, contactPhone: e.target.value }))}
                              placeholder="+90 5xx xxx xx xx"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="input-field">
                        <label>Site Açıklaması (Meta Description)</label>
                        <textarea
                          rows={4}
                          value={settings.metaDescription}
                          onChange={(e) => setSettings((p) => ({ ...p, metaDescription: e.target.value }))}
                        />
                      </div>
                    </div>
                  )}
                </section>

                {/* Bildirim Ayarları */}
                <aside className="settings-card">
                  <div className="settings-card-head">
                    <div className="settings-card-title">
                      <span className="settings-ico">🔔</span>
                      Bildirim Ayarları
                    </div>
                    <div className="settings-card-sub">İletişim tercihleri</div>
                  </div>

                  {settingsLoading ? (
                    <div className="muted" style={{ padding: 14 }}>
                      Yükleniyor...
                    </div>
                  ) : (
                    <div className="settings-form">
                      <div className="switch-row">
                        <div className="switch-meta">
                          <div className="switch-title">E-posta Bildirimleri</div>
                          <div className="switch-desc">Yeni rezervasyonlarda mail al</div>
                        </div>

                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={!!settings.notifyEmail}
                            onChange={(e) => setSettings((p) => ({ ...p, notifyEmail: e.target.checked }))}
                          />
                          <span className="slider" />
                        </label>
                      </div>

                      <div className="switch-row">
                        <div className="switch-meta">
                          <div className="switch-title">SMS Bildirimleri</div>
                          <div className="switch-desc">Acil durumlarda SMS gönder</div>
                        </div>

                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={!!settings.notifySms}
                            onChange={(e) => setSettings((p) => ({ ...p, notifySms: e.target.checked }))}
                          />
                          <span className="slider" />
                        </label>
                      </div>

                      <div className="switch-row">
                        <div className="switch-meta">
                          <div className="switch-title">Haftalık Rapor</div>
                          <div className="switch-desc">Özet istatistikleri gönder</div>
                        </div>

                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={!!settings.weeklyReport}
                            onChange={(e) => setSettings((p) => ({ ...p, weeklyReport: e.target.checked }))}
                          />
                          <span className="slider" />
                        </label>
                      </div>
                    </div>
                  )}
                </aside>
              </div>

              {/* Logo ve Marka */}
              <section className="settings-card">
                <div className="settings-card-head">
                  <div className="settings-card-title">
                    <span className="settings-ico">🖼️</span>
                    Logo ve Marka
                  </div>
                  <div className="settings-card-sub">Platform görsel kimliği</div>
                </div>

                <div className="brand-grid">
                  <div className="brand-left">
                    <div className="brand-label">Mevcut Logo</div>

                    <div className="brand-preview">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo" />
                      ) : (
                        <div className="brand-placeholder">
                          <span>🍴</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="brand-right">
                    <div className="brand-label">Yeni Logo Yükle</div>

                    <div
                      className="dropzone"
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const f = e.dataTransfer.files?.[0];
                        onPickLogo(f);
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="drop-ico">☁️</div>
                      <div className="drop-title">Dosyayı buraya sürükleyin veya tıklayın</div>
                      <div className="drop-sub">PNG, JPG veya SVG (Max. 2MB)</div>
                    </div>

                    <input
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      type="file"
                      accept=".png,.jpg,.jpeg,.svg"
                      onChange={(e) => onPickLogo(e.target.files?.[0])}
                    />

                    {logoFile && (
                      <div className="muted" style={{ marginTop: 10 }}>
                        Seçilen: <b>{logoFile.name}</b>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Bottom actions */}
              <div className="settings-actions">
                <button type="button" className="btn-action-light" onClick={cancelSettingsChanges} disabled={settingsSaving || settingsLoading}>
                  Değişiklikleri İptal Et
                </button>

                <button type="button" className="btn-action-primary" onClick={saveSettings} disabled={settingsSaving || settingsLoading}>
                  {settingsSaving ? "Kaydediliyor..." : "Ayarları Kaydet"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ✅ RESTORAN MODAL */}
      {restModalOpen && (
        <div className="modal-overlay" onMouseDown={closeRestModal}>
          <div className="modal-card" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{restEditingId ? "Restoranı Düzenle" : "Yeni Restoran Ekle"}</h3>
              <button className="modal-close" type="button" onClick={closeRestModal}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="form-grid compact">
                <div className="input-field">
                  <label>Restoran Adı</label>
                  <input type="text" value={restForm.name} onChange={(e) => setRestForm((p) => ({ ...p, name: e.target.value }))} />
                </div>

                <div className="input-field">
                  <label>Konum (location)</label>
                  <input type="text" value={restForm.location} onChange={(e) => setRestForm((p) => ({ ...p, location: e.target.value }))} />
                </div>

                <div className="input-field">
                  <label>Telefon</label>
                  <input type="text" value={restForm.phone} onChange={(e) => setRestForm((p) => ({ ...p, phone: e.target.value }))} />
                </div>

                <div className="input-field">
                  <label>E-posta</label>
                  <input type="email" value={restForm.email} onChange={(e) => setRestForm((p) => ({ ...p, email: e.target.value }))} />
                </div>

                <div className="input-field" style={{ gridColumn: "1 / -1" }}>
                  <label>Açıklama</label>
                  <textarea rows={3} value={restForm.description} onChange={(e) => setRestForm((p) => ({ ...p, description: e.target.value }))} />
                </div>

                <div className="input-field" style={{ gridColumn: "1 / -1" }}>
                  <label>Resim URL</label>
                  <input type="text" value={restForm.imageUrl} onChange={(e) => setRestForm((p) => ({ ...p, imageUrl: e.target.value }))} />
                </div>

                <div className="input-field">
                  <label>Puan (rating)</label>
                  <input type="number" step="0.1" value={restForm.rating} onChange={(e) => setRestForm((p) => ({ ...p, rating: e.target.value }))} />
                </div>

                <div className="input-field">
                  <label>Fiyat Aralığı</label>
                  <input type="text" placeholder="$$ / $$$" value={restForm.priceRange} onChange={(e) => setRestForm((p) => ({ ...p, priceRange: e.target.value }))} />
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-action-light" onClick={closeRestModal}>
                Vazgeç
              </button>
              <button type="button" className="btn-action-primary" onClick={saveRestaurant}>
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ USER VIEW MODAL */}
      {userViewOpen && (
        <div className="modal-overlay" onMouseDown={closeUserView}>
          <div className="modal-card" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Kullanıcı Bilgileri</h3>
              <button className="modal-close" type="button" onClick={closeUserView}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              {userViewData ? (
                <div className="info-grid">
                  <div className="info-item">
                    <div className="info-label">Ad</div>
                    <div className="info-value">{userViewData?.name || "-"}</div>
                  </div>

                  <div className="info-item">
                    <div className="info-label">Soyad</div>
                    <div className="info-value">{userViewData?.surname || "-"}</div>
                  </div>

                  <div className="info-item">
                    <div className="info-label">E-posta</div>
                    <div className="info-value">{userViewData?.email || "-"}</div>
                  </div>

                  <div className="info-item">
                    <div className="info-label">Telefon</div>
                    <div className="info-value">{userViewData?.phoneNumber || userViewData?.phone || "-"}</div>
                  </div>

                  <div className="info-item">
                    <div className="info-label">Rol</div>
                    <div className="info-value">{roleKeyOf(userViewData)}</div>
                  </div>

                  <div className="info-item">
                    <div className="info-label">Durum</div>
                    <div className="info-value">{userStatusLabelTR(userStatusKey(userViewData))}</div>
                  </div>
                </div>
              ) : (
                <div className="muted">Kullanıcı seçilmedi.</div>
              )}
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-action-primary" onClick={closeUserView}>
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
