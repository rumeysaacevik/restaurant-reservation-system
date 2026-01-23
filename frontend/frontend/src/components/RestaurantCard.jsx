// RestaurantCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./RestaurantCard.css";

const RestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate();

  const isLoggedIn =
    !!localStorage.getItem("token") || !!localStorage.getItem("user");

  // 🔥 KARTA TIKLAYINCA → DETAY SAYFASI
  const handleCardClick = () => {
    navigate(`/restoranlar/${restaurant.id}`);
  };

  const handleMenuClick = (e) => {
    e.stopPropagation(); // ⛔ kart click’i tetiklemesin
    navigate(`/restoranlar/${restaurant.id}/menu`);
  };

  const handleReservationClick = (e) => {
    e.stopPropagation(); // ⛔ kart click’i tetiklemesin

    if (!isLoggedIn) {
      alert("Rezervasyon oluşturmak için lütfen giriş yapın.");
      navigate("/giris");
      return;
    }

    navigate(`/rezervasyon/${restaurant.id}`);
  };

  return (
    <div className="restaurant-card" onClick={handleCardClick}>
      <div className="card-image">
        <img src={restaurant.imageUrl} alt={restaurant.name} />
        <span className="badge">{restaurant.category || "Popüler"}</span>
        <span className="rating">⭐ {restaurant.rating || "4.5"}</span>
      </div>

      <h3 className="card-title">{restaurant.name}</h3>

      <p className="card-location">📍 {restaurant.location}</p>

      <p className="card-desc">
        {restaurant.description?.slice(0, 90)}...
      </p>

      <div className="card-buttons">
        <button className="menu-btn" type="button" onClick={handleMenuClick}>
          Menü
        </button>

        <button
          className="rez-btn"
          type="button"
          onClick={handleReservationClick}
        >
          Rezervasyon
        </button>
      </div>
    </div>
  );
};

export default RestaurantCard;
