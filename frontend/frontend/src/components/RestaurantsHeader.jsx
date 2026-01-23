import React from "react";
import "./RestaurantsHeader.css";

const RestaurantsHeader = () => {
  return (
    <div className="restaurants-header">

      <p className="eyebrow">DİNAMİK MANZARALAR</p>

      <h1 className="title">Lezzet Noktaları</h1>

      <p className="subtext">
        İstanbul’un kıyısından dağların zirvesine, en seçkin restoranlarını
        şeffaf ve detaylı bir şekilde inceleyin.
      </p>

      <div className="stats">
        <span className="listed">42 Restoran Listelendi</span>
        <span className="open-now">• Şu an açık: 28</span>
      </div>

    </div>
  );
};

export default RestaurantsHeader;
