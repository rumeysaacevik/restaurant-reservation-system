import React from "react";
import "./InfoSection.css";

const InfoSection = () => {
    return (
        <div className="info-section">

            {/* SOL GÖRSEL */}
            <div className="info-image-box">
                <img
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=60"
                    alt="Restaurant"
                />
            </div>

            {/* SAĞ METİN ALANI */}
            <div className="info-text-box">
                <span className="info-eyebrow">SAMİMİ & DAVETKAR</span>

                <h2 className="info-title">İstanbul'un Sıcak Atmosferini Keşfedin</h2>

                <p className="info-description">
                    Sadece bir yemek değil; İstanbul’un benzersiz ambiyansını, tarihi dokusunu
                    ve zengin mutfak kültürünü bir araya getiren bir deneyim sunuyoruz.
                    Boğaz manzarasında, şehrin eşsiz lezzet duraklarında unutulmaz anlar
                    biriktirmeniz için buradayız.
                </p>

                <ul className="info-list">
                    <li>✔ Kolay ve hızlı online rezervasyon</li>
                    <li>✔ İstanbul’un en popüler restoranlarında geniş seçenek</li>
                    <li>✔ Gerçek kullanıcı yorumları ve puanlamalar</li>
                </ul>


                <button className="info-button">Daha Fazla Bilgi</button>
            </div>

        </div>
    );
};

export default InfoSection;
