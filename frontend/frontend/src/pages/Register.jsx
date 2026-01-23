import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  // 1. State yapısını name ve surname olarak güncelledik
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 2. Input değişimlerini yakala
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // 3. Kayıt İşlemi (Submit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Şifre eşleşme kontrolü
    if (formData.password !== formData.confirmPassword) {
      setError("Şifreler birbiriyle eşleşmiyor.");
      setLoading(false);
      return;
    }

    // Backend'e gidecek veri paketi
    const payload = {
      name: formData.name,
      surname: formData.surname,
      email: formData.email,
      password: formData.password,
      role: "USER" 
    };

    try {
      const response = await axios.post("http://localhost:8080/api/users/register", payload);

      if (response.status === 200 || response.status === 201) {
        alert("Hesabınız başarıyla oluşturuldu! Şimdi giriş yapabilirsiniz.");
        navigate("/giris"); 
      }
    } catch (err) {
      console.error("Kayıt Hatası:", err.response?.data);
      setError(err.response?.data || "Kayıt sırasında bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="register-bg"></div>

      <div className="register-wrapper">
        <div className="register-card">
          <div className="register-tabs">
            <button className="tab" onClick={() => navigate("/giris")}>Giriş Yap</button>
            <button className="tab active">Kayıt Ol</button>
          </div>

          <h2 className="register-title">Aramıza Katılın</h2>
          <p className="register-subtitle">
            İstanbul’un lezzet durağında size özel bir profil oluşturun.
          </p>

          {error && <div className="error-message" style={{ color: "red", textAlign: "center", marginBottom: "15px" }}>{error}</div>}

          <form className="register-form" onSubmit={handleSubmit}>
            
            {/* AD VE SOYAD ALANLARINI AYIRDIK */}
            <div className="name-row" style={{ display: "flex", gap: "15px" }}>
              <div style={{ flex: 1 }}>
                <label>ADINIZ</label>
                <div className="input-box">
                  <span className="input-icon">👤</span>
                  <input 
                    type="text" 
                    name="name"
                    placeholder="Adınız" 
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <label>SOYADINIZ</label>
                <div className="input-box">
                  <span className="input-icon">👤</span>
                  <input 
                    type="text" 
                    name="surname"
                    placeholder="Soyadınız" 
                    value={formData.surname}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <label>E-POSTA ADRESİ</label>
            <div className="input-box">
              <span className="input-icon">📧</span>
              <input 
                type="email" 
                name="email"
                placeholder="ornek@email.com" 
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <label>ŞİFRE</label>
            <div className="input-box">
              <span className="input-icon">🔒</span>
              <input 
                type="password" 
                name="password"
                placeholder="Şifre oluşturun" 
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <label>ŞİFRE TEKRAR</label>
            <div className="input-box">
              <span className="input-icon">🔒</span>
              <input 
                type="password" 
                name="confirmPassword"
                placeholder="Şifrenizi tekrar girin" 
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="register-btn" disabled={loading}>
              {loading ? "Kaydediliyor..." : "Kayıt Ol"} <span className="register-btn-icon">➜</span>
            </button>
          </form>

          <div className="divider">VEYA ŞUNUNLA DEVAM ET</div>

          <div className="social-login">
            <button className="social-btn google">Google</button>
            <button className="social-btn facebook">Facebook</button>
          </div>

          <p className="register-footer-text">
            Zaten hesabınız var mı?{" "}
            <span onClick={() => navigate("/giris")} className="login-link" style={{ cursor: "pointer" }}>Giriş Yapın</span>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;