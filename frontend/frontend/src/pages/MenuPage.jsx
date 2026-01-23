import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../services/axiosConfig";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./MenuPage.css";

const TAB_DEFS = [
  { key: "baslangic", label: "Başlangıçlar", icon: "🍽️" },
  { key: "corba", label: "Çorbalar & Salatalar", icon: "🥗" },
  { key: "ana", label: "Ana Yemekler", icon: "🍖" },
  { key: "tatli", label: "Tatlılar", icon: "🍰" },
  { key: "icecek", label: "İçecekler", icon: "🥤" },
];

// DB category değerlerin farklı yazımları olabiliyor → normalize ediyoruz
function normalizeCategory(cat = "") {
  const c = String(cat).toLowerCase().trim();

  if (c.includes("başlang")) return "baslangic";
  if (c.includes("corba") || c.includes("çorba") || c.includes("salata")) return "corba";
  if (c.includes("ana")) return "ana";
  if (c.includes("tatl")) return "tatli";
  if (c.includes("içecek") || c.includes("icecek")) return "icecek";

  // Yan ürün/atıştırmalık vs. gelirse "başlangıç" altında gösterelim
  if (c.includes("yan") || c.includes("atıştır") || c.includes("snack")) return "baslangic";

  return "baslangic";
}

const MenuPage = () => {
  const { id } = useParams(); // /restoranlar/:id/menu
  const restaurantId = Number(id);
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState("baslangic");
  const [loading, setLoading] = useState(true);

  const isLoggedIn =
    !!localStorage.getItem("token") || !!localStorage.getItem("user");

  useEffect(() => {
    async function loadMenu() {
      try {
        const res = await axios.get(`/api/menuitems/restaurant/${restaurantId}`);
        setItems(res.data || []);
      } catch (err) {
        console.error("Menü çekilemedi:", err?.response?.data || err.message);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    if (!Number.isNaN(restaurantId)) loadMenu();
  }, [restaurantId]);

  const grouped = useMemo(() => {
    const g = { baslangic: [], corba: [], ana: [], tatli: [], icecek: [] };
    (items || []).forEach((it) => {
      const key = normalizeCategory(it.category);
      g[key] = g[key] || [];
      g[key].push(it);
    });
    return g;
  }, [items]);

  const visibleItems = grouped[activeTab] || [];

  const handleReservation = () => {
    if (!isLoggedIn) {
      alert("Rezervasyon oluşturmak için lütfen kayıt olun ya da giriş yapın.");
      navigate("/giris");
      return;
    }
    navigate(`/rezervasyon/${restaurantId}`);
  };

  return (
    <div className="menu-page-root">
      {/* İstersen Navbar’ı kaldırıp tamamen tasarımdaki header’ı kullanabilirsin */}
      <Navbar />

      {/* HERO */}
      <header className="menu-hero">
        <div className="menu-hero-overlay" />
        <div className="menu-hero-content">
          <h1>Mevsimsel Lezzetler</h1>
          <p>
            Şefimizin özenle seçtiği doğal malzemelerle hazırlanan,
            eşsiz doğasından ilham alan menümüzü keşfedin.
          </p>

          <div className="menu-tabs-card">
            <div className="menu-tabs">
              {TAB_DEFS.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  className={`menu-tab ${activeTab === t.key ? "active" : ""}`}
                  onClick={() => setActiveTab(t.key)}
                >
                  <span className="tab-ico">{t.icon}</span>
                  <span className="tab-txt">{t.label}</span>
                </button>
              ))}
            </div>

            <div className="menu-content">
              <div className="menu-section-head">
                <h2>{TAB_DEFS.find((x) => x.key === activeTab)?.label}</h2>
                <div className="menu-section-line" />
              </div>

              {loading ? (
                <div className="menu-loading">Yükleniyor...</div>
              ) : visibleItems.length === 0 ? (
                <div className="menu-empty">
                  Bu kategori için menü öğesi bulunamadı.
                </div>
              ) : (
                <div className="menu-grid">
                  {visibleItems.map((it) => (
                    <div className="menu-item-card" key={it.id}>
                      <div className="menu-item-img">
                        <img
                          src={it.imageUrl || "/images/default.jpg"}
                          alt={it.name}
                          onError={(e) => {
                            e.currentTarget.src = "/images/default.jpg";
                          }}
                        />
                      </div>

                      <div className="menu-item-body">
                        <div className="menu-item-top">
                          <h3 className="menu-item-title">{it.name}</h3>
                          <div className="menu-item-price">
                            {Number(it.price || 0).toLocaleString("tr-TR")} ₺
                          </div>
                        </div>

                        <p className="menu-item-desc">
                          {it.description || "—"}
                        </p>

                        <div className="menu-item-tags">
                          {/* DB’de vegan/glutensiz alanın yoksa şimdilik kategori etiketi */}
                          <span className="tag tag-soft">
                            {it.category || "Menü"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA */}
              <div className="menu-cta">
                <div className="menu-cta-overlay" />
                <div className="menu-cta-content">
                  <div>
                    <h3>Özel Günleriniz İçin</h3>
                    <p>Doğum günü ve kutlamalarınızda %10 indirim fırsatı.</p>
                  </div>
                  <button type="button" className="cta-btn" onClick={handleReservation}>
                    Rezervasyon Yap
                  </button>
                </div>
              </div>

              {/* Allergens */}
              <div className="menu-footnote">
                <div className="footnote-left">
                  <h4>Alerjen Uyarısı</h4>
                  <p>
                    Lütfen siparişinizi vermeden önce garsonunuza alerjileriniz
                    hakkında bilgi veriniz.
                  </p>
                </div>
                <div className="footnote-right">
                  <span className="chip">🌿 VEGAN</span>
                  <span className="chip">🚫 GLUTENSİZ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <Footer />
    </div>
  );
};

export default MenuPage;
