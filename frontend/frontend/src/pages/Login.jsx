import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import "./Login.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔥 LOGIN FONKSİYONU
  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post("http://localhost:8080/api/users/login", {
      email,
      password,
    });

    const user = res.data;

    // ✅ Kullanıcı bilgisini sakla
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", user.token); // 🔥 önemli

    // 🔥 Role göre yönlendirme
    if (user.role === "ADMIN") {
      navigate("/admin");
    } else {
      navigate("/panel");
    }

  } catch (err) {
    // ✅ BACKEND'DEN GELEN MESAJI GÖSTER
    const message =
      err.response?.data || "Bir hata oluştu, tekrar deneyin.";

    alert(message);
  }
};

  return (
    <>
      <Navbar />

      <div className="login-bg"></div>

      <div className="login-wrapper">
        <div className="login-card">

          {/* TAB BAR */}
          <div className="login-tabs">
            <Link to="/giris" className="tab active">Giriş Yap</Link>
            <Link to="/kayit" className="tab">Kayıt Ol</Link>
          </div>

          <h2 className="login-title">Tekrar Hoş Geldiniz</h2>
          <p className="login-subtitle">
            İstanbul’un lezzet dünyasına giriş yapın.
          </p>

          {/* FORM */}
          <form className="login-form" onSubmit={handleLogin}>

            <label>E-POSTA ADRESİ</label>
            <div className="input-box">
              <span className="input-icon">📧</span>
              <input
                id="emailInput"
                type="email"
                placeholder="ornek@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <label>ŞİFRE</label>
            <div className="input-box">
              <span className="input-icon">🔒</span>
              <input
                id="passwordInput"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-options">
              <label className="remember">
                <input type="checkbox" /> Beni Hatırla
              </label>
              <a href="#" className="forgot-link">Şifremi Unuttum?</a>
            </div>

            {/* GİRİŞ BUTONU */}
            <button className="login-btn" type="submit">
              Giriş Yap <span className="login-btn-icon">➜</span>
            </button>
          </form>

          <div className="divider">VEYA ŞUNUNLA DEVAM ET</div>

          <div className="social-login">
            <button className="social-btn google">Google</button>
            <button className="social-btn facebook">Facebook</button>
          </div>

          <p className="login-footer-text">
            Hesabınız yok mu? <Link to="/kayit" className="signup-link">Hemen Kayıt Olun</Link>
          </p>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default Login;
