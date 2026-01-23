import React from "react";
import { useNavigate } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* SOL BLOK */}
        <div className="footer-left">
          <h3 className="footer-logo">🍽 İstanbul Lezzetleri</h3>
          <p className="footer-desc">
            İstanbul'un en seçkin restoranlarını tek bir platformda buluşturan,
            lezzet ve keyif dolu bir yolculuk.
          </p>
        </div>

        {/* HIZLI ERİŞİM */}
        <div className="footer-block">
          <h4>Hızlı Erişim</h4>
          <ul>
            <li><a href="/">Ana Sayfa</a></li>
            <li><a href="/restaurants">Restoranlar</a></li>
            <li><a href="/kampanyalar">Kampanyalar</a></li>
            <li><a href="/blog">Blog</a></li>
          </ul>
        </div>

        {/* KURUMSAL */}
        <div className="footer-block">
          <h4>Kurumsal</h4>
          <ul>
            <li><a href="/hakkimizda">Hakkımızda</a></li>
            <li><a href="/iletisim">İletişim</a></li>
            <li><a href="/kosullar">Kullanım Koşulları</a></li>
            <li><a href="/gizlilik">Gizlilik Politikası</a></li>
          </ul>
        </div>

        {/* YÖNETİCİ BLOKU */}
        <div className="footer-block admin-block">
          <h4>Yönetici</h4>
          <p>Restoran sahibi misiniz? Giriş yaparak mekanınızı yönetin.</p>
          <button
            className="admin-btn"
            type="button"
            onClick={() => navigate("/admin")}
          >
            Yönetici Girişi
          </button>
        </div>
      </div>

      {/* ALT SATIR */}
      <div className="footer-bottom">
        <p>© 2025 R-Venue. Tüm hakları saklıdır.</p>
        <div className="footer-links">
          <a href="/cookies">Cookies</a>
          <a href="/security">Security</a>
          <a href="/terms">Terms</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
