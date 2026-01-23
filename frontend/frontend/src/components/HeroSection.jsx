import React from "react";
import "./HeroSection.css";

const HeroSection = () => {
    return (
        <section className="hero">
            <div className="hero-overlay">
                <div className="hero-content">

                    <span className="hero-badge">
                        İSTANBUL'UN KALBİ BURADA ATIYOR
                    </span>

                    <h1>
                        En Lezzetli Sofralarda <br />
                        <span>Yerinizi Ayırtın</span>
                    </h1>

                    <p className="hero-text">
                        Tarihi dokusu ve zengin mutfağıyla İstanbul’un en seçkin restoranlarında yerinizi hemen ayırtın.
                    </p>

                    <div className="hero-search-box">
                        <input type="text" placeholder="Restoran adı ara..." />
                        <input type="dat e" />
                        <button>Masa Bul</button>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default HeroSection;
