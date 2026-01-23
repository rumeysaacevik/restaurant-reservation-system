import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* LOGO */}
        <Link to="/" className="navbar-logo">
          <img src="/images/logo.png" alt="Logo" className="logo-img" />
        </Link>

        {/* SEARCH BAR */}
        <div className="navbar-search">
          <input type="text" placeholder="Restoran veya mutfak ara..." />
        </div>

        {/* LEFT NAV LINKS */}
        <div className="navbar-links">
          <Link to="/">Ana Sayfa</Link>
          <Link to="/restoranlar">Restoranlar</Link>
          <Link to="/hakkimizda">Hakkımızda</Link>
          <Link to="/iletisim">İletişim</Link>
        </div>

        {/* AUTH AREA — BURASI DOĞRU OLAN */}
        <div className="navbar-auth">
          {user ? (
            /* PROFİL GÖSTER */
            <div className="nav-profile-wrapper" onClick={() => navigate("/panel")}>
              <div className="notification-bell">🔔</div>

              <div className="user-text-info">
                <span className="user-name">{user.name}</span>
                <span className="user-tier">Gurme Üye</span>
              </div>

              <div className="nav-avatar">
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}&backgroundColor=e11d48&fontSize=40`}
                  alt="Profil"
                />
              </div>
            </div>
          ) : (
            /* GİRİŞ – KAYIT BUTONLARI */
            <>
              <button className="btn-login" onClick={() => navigate("/giris")}>
                Giriş Yap
              </button>
              <button className="btn-register" onClick={() => navigate("/kayit")}>
                Kayıt Ol
              </button>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
