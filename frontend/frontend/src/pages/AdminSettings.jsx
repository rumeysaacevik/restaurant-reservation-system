import React, { useState, useEffect } from "react";
import axios from "../services/axiosConfig";
import "./AdminSettings.css";

const AdminSettings = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    siteTitle: "Dersim Lezzet Diyarı",
    supportEmail: "destek@dersimlezzet.com",
    contactPhone: "+90 428 123 4567",
    metaDescription: "Dersim'in eşsiz doğasında en iyi restoranları keşfedin...",
    emailNotifications: true,
    smsNotifications: false,
    weeklyReport: true,
    currentLogo: null
  });

  // Mevcut ayarları çekmek için (opsiyonel)
  useEffect(() => {
    // getSettings();
  }, []);

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // await axios.put("/api/settings", settings);
      alert("Ayarlar başarıyla kaydedildi!");
    } catch (err) {
      alert("Hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-grid">
        
        {/* SOL KOLON: Genel Bilgiler */}
        <div className="settings-card main-info">
          <div className="card-header">
            <span className="icon">ℹ️</span>
            <h3>Genel Bilgiler</h3>
          </div>
          
          <div className="form-group">
            <label>Site Başlığı</label>
            <input 
              name="siteTitle"
              value={settings.siteTitle} 
              onChange={handleInputChange}
              placeholder="Tarayıcı sekmesinde görünecek başlık"
            />
            <small>Tarayıcı sekmesinde ve arama motorlarında görünecek başlık.</small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Destek E-posta</label>
              <div className="input-with-icon">
                <span className="inner-icon">✉️</span>
                <input 
                  name="supportEmail"
                  value={settings.supportEmail} 
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label>İletişim Telefonu</label>
              <div className="input-with-icon">
                <span className="inner-icon">📞</span>
                <input 
                  name="contactPhone"
                  value={settings.contactPhone} 
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Site Açıklaması (Meta Description)</label>
            <textarea 
              name="metaDescription"
              rows="4"
              value={settings.metaDescription} 
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* SAĞ KOLON: Bildirim Ayarları */}
        <div className="settings-card notifications">
          <div className="card-header">
            <span className="icon">🔔</span>
            <h3>Bildirim Ayarları</h3>
          </div>

          <div className="toggle-item">
            <div className="toggle-text">
              <strong>E-posta Bildirimleri</strong>
              <span>Yeni rezervasyonlarda mail al</span>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={settings.emailNotifications} 
                onChange={() => handleToggle('emailNotifications')} 
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="toggle-item">
            <div className="toggle-text">
              <strong>SMS Bildirimleri</strong>
              <span>Acil durumlarda SMS gönder</span>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={settings.smsNotifications} 
                onChange={() => handleToggle('smsNotifications')} 
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="toggle-item">
            <div className="toggle-text">
              <strong>Haftalık Rapor</strong>
              <span>Özet istatistikleri gönder</span>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={settings.weeklyReport} 
                onChange={() => handleToggle('weeklyReport')} 
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        {/* ALT KOLON: Logo ve Marka */}
        <div className="settings-card branding">
          <div className="card-header">
            <span className="icon">🖼️</span>
            <h3>Logo ve Marka</h3>
          </div>
          <div className="logo-section">
            <div className="current-logo">
              <label>Mevcut Logo</label>
              <div className="logo-placeholder">
                <span className="ico">🍴</span>
              </div>
            </div>
            <div className="upload-zone">
              <label>Yeni Logo Yükle</label>
              <div className="drop-area">
                <span className="upload-icon">☁️</span>
                <p>Dosyayı buraya sürükleyin veya <strong>tıklayın</strong></p>
                <span>PNG, JPG veya SVG (Max. 2MB)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="settings-footer">
        <button className="btn-cancel">Değişiklikleri İptal Et</button>
        <button className="btn-save" onClick={handleSave} disabled={loading}>
          {loading ? "Kaydediliyor..." : "Ayarları Kaydet"}
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;