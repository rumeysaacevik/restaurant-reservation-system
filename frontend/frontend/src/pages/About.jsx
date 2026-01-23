import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./About.css";

const About = () => {
  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="tag">DOĞANIN KALBİNDE</span>
          <h1>Lezzetin ve Doğanın<br />Buluşma Noktası</h1>
          <p>
            İstanbul’un eşsiz manzarası eşliğinde, yerel mutfağın en seçkin tatlarını
            keşfetmeniz için tasarlanmış modern bir gastronomi rehberi.
          </p>
        </div>
      </section>

      {/* HİKAYEMİZ */}
      <section className="story-section">
        <div className="story-card">
          <div className="story-text">
            <h2>Hikayemiz</h2>
            <p>
              İstanbul’un zengin kültürel mirasını ve misafirperverliğini dijital dünyaya taşıyoruz.
              Yerel işletmeleri desteklerken ziyaretçilere unutulmaz bir gastronomi deneyimi sunmak
              için yola çıktık.
            </p>
            <p>
              İstanbul’un serin sularından yemyeşil doğasına uzanan bu coğrafyada, her restoranın
              anlatacak bir hikayesi, her yemeğin köklü bir geçmişi var.
            </p>
          </div>

          <div className="story-image">
            <img src="/images/about-1.jpg" alt="about" />
          </div>
        </div>
      </section>

      {/* MİSYON - VİZYON */}
      <section className="mv-section">
        <div className="mv-card">
          <div className="mv-icon">📌</div>
          <h3>Misyonumuz</h3>
          <p>
            Yerel restoranları dijital platformda güçlendirerek misafirlere kaliteli
            gastronomi deneyimlerini kolayca ulaştırmak.
          </p>
        </div>

        <div className="mv-card">
          <div className="mv-icon">👁️</div>
          <h3>Vizyonumuz</h3>
          <p>
            İstanbul gastronomi turizmini sürdürülebilir bir yaklaşımla geleceğe taşıyan
            öncü bir platform olmak.
          </p>
        </div>
      </section>

      {/* DEĞERLERİMİZ */}
      <section className="values-section">
        <h2>Değerlerimiz</h2>

        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">🌿</div>
            <h4>Kültürel Bağlılık</h4>
            <p>Yöresel kültürü ve gelenekleri yaşatıyoruz.</p>
          </div>

          <div className="value-card">
            <div className="value-icon">🛡️</div>
            <h4>Güvenilirlik</h4>
            <p>Şeffaf, güvenilir ve kaliteli hizmet sunmayı taahhüt ediyoruz.</p>
          </div>

          <div className="value-card">
            <div className="value-icon">🌍</div>
            <h4>Doğa Dostu</h4>
            <p>Doğanın korunmasını ve sürdürülebilir işletmeciliği destekliyoruz.</p>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="cta-section">
        <h2>Lezzet Yolculuğuna Başlayın</h2>
        <p>İstanbul’un eşsiz tatlarını keşfetmek için hemen adım atın.</p>

        <div className="cta-buttons">
          <a href="/restoranlar" className="cta-primary">Restoranları Keşfet</a>
          <a href="/iletisim" className="cta-secondary">İletişime Geç</a>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default About;
