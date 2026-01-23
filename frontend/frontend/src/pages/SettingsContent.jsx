const SettingsContent = ({ user }) => {
  return (
    <div className="settings-wrapper">
      <div className="dashboard-header">
        <div className="header-text">
          <h1>Hesap Ayarları</h1>
          <p>Profil bilgilerinizi, güvenlik ayarlarınızı ve bildirim tercihlerinizi yönetin.</p>
        </div>
        <button className="help-btn">❓ Yardım Al</button>
      </div>

      {/* 1. KİŞİSEL BİLGİLER */}
      <section className="settings-section main-card">
        <div className="section-header-inline">
          <span className="icon-bg red">👤</span>
          <div>
            <h3>Kişisel Bilgiler</h3>
            <p>Hesap ayrıntılarınızı güncelleyin</p>
          </div>
        </div>

        <div className="profile-edit-area">
          <div className="photo-change">
            <div className="current-photo">
                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt="Profil" />
            </div>
            <button className="text-link-btn">Fotoğrafı Değiştir</button>
          </div>

          <div className="settings-form-grid">
            <div className="input-group">
              <label>Ad</label>
              <input type="text" defaultValue={user.name.split(' ')[0]} />
            </div>
            <div className="input-group">
              <label>Soyad</label>
              <input type="text" defaultValue={user.name.split(' ')[1]} />
            </div>
            <div className="input-group">
              <label>E-posta Adresi</label>
              <input type="email" defaultValue={user.email} />
            </div>
            <div className="input-group">
              <label>Telefon Numarası</label>
              <input type="text" placeholder="+90 555 123 45 67" />
            </div>
          </div>
          <button className="btn-save-changes">Değişiklikleri Kaydet</button>
        </div>
      </section>

      {/* 2. GÜVENLİK VE BİLDİRİMLER YAN YANA */}
      <div className="settings-row-grid">
        {/* GÜVENLİK */}
        <section className="settings-section main-card">
          <div className="section-header-inline">
            <span className="icon-bg orange">🔒</span>
            <div>
              <h3>Güvenlik</h3>
              <p>Şifrenizi güncelleyin</p>
            </div>
          </div>
          <div className="settings-form-vertical">
            <div className="input-group">
              <label>Mevcut Şifre</label>
              <input type="password" />
            </div>
            <div className="input-group">
              <label>Yeni Şifre</label>
              <input type="password" />
            </div>
            <div className="input-group">
              <label>Yeni Şifre (Tekrar)</label>
              <input type="password" />
            </div>
            <button className="btn-update-password">Şifreyi Güncelle</button>
          </div>
        </section>

        {/* BİLDİRİMLER */}
        <section className="settings-section main-card">
          <div className="section-header-inline">
            <span className="icon-bg blue">🔔</span>
            <div>
              <h3>Bildirimler</h3>
              <p>İletişim tercihlerinizi yönetin</p>
            </div>
          </div>
          <div className="toggle-list">
            <div className="toggle-item">
              <div>
                <span>Rezervasyon Güncellemeleri</span>
                <small>Onay, iptal ve hatırlatmalar için bildirim al.</small>
              </div>
              <input type="checkbox" defaultChecked />
            </div>
            <div className="toggle-item">
              <div>
                <span>SMS Bildirimleri</span>
                <small>Rezervasyon saatinden 1 saat önce SMS al.</small>
              </div>
              <input type="checkbox" defaultChecked />
            </div>
            <div className="toggle-item">
              <div>
                <span>Kampanyalar ve Fırsatlar</span>
                <small>Özel indirimlerden haberdar ol.</small>
              </div>
              <input type="checkbox" />
            </div>
          </div>
        </section>
      </div>

      {/* 3. DİĞER İŞLEMLER */}
      <div className="other-actions">
          <h4>Diğer İşlemler</h4>
          <div className="delete-account-box main-card">
              <div className="delete-text">
                  <h3>Hesap Silme</h3>
                  <p>Hesabınızı ve tüm verilerinizi kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>
              </div>
              <button className="btn-delete-account">Hesabımı Sil</button>
          </div>
      </div>
    </div>
  );
};