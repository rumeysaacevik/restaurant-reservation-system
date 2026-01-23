import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Contact.css";

const Contact = () => {
  return (
    <>
      <Navbar />

      {/* HERO ARKA PLAN */}
      <div className="contact-hero-bg"></div>

      {/* ANA KAPSAYICI */}
      <div className="contact-container">

        {/* SOL TARAF - FORM */}
        <div className="contact-form-box">

          <span className="support-tag">7/24 DESTEK</span>
          <h1 className="contact-title">Bize Ulaşın</h1>
          <p className="contact-desc">
            İstanbul’un kalbinde, lezzet dolu bir deneyim için 
            sorularınızı ve rezervasyon taleplerinizi bekliyoruz.
          </p>

          {/* FORM */}
          <form className="contact-form">

            <div className="form-row">
              <div className="form-group">
                <label>Adınız Soyadınız</label>
                <input type="text" placeholder="Adınızı girin" />
              </div>

              <div className="form-group">
                <label>E-posta Adresiniz</label>
                <input type="email" placeholder="ornek@email.com" />
              </div>
            </div>

            <div className="form-group">
              <label>Konu</label>
              <input type="text" placeholder="Mesajınızın konusu (Örn: Rezervasyon)" />
            </div>

            <div className="form-group">
              <label>Mesajınız</label>
              <textarea placeholder="Size nasıl yardımcı olabiliriz?" />
            </div>

            <button className="send-btn">Gönder ➤</button>
          </form>
        </div>

        {/* SAĞ TARAF - İLETİŞİM BİLGİ KARTLARI */}
        <div className="contact-info-box">

          <div className="info-card">
            <div className="info-icon">📍</div>
            <div>
              <h4>Adresimiz</h4>
              <p>Mogultay Mahallesi, Munzur Caddesi No: 12<br />İstanbul / Türkiye</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">📞</div>
            <div>
              <h4>Telefon</h4>
              <p>Rezervasyon ve bilgi için bizi arayın.<br />+90 (428) 123 45 67</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">✉️</div>
            <div>
              <h4>E-posta</h4>
              <p>Her türlü sorunuz için bize yazın.<br />info@r-venue.com</p>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default Contact;
