import React from "react";
import "./PopularRestaurants.css";

const restaurants = [
  {
    id: 1,
    name: "Galata Ocakbaşı & Izgara",
    location: "Ovacık Yolu Üzeri, 5 km",
    tags: ["Yöresel", "Kahvaltı", "$$"],
    rating: 4.9,
    reviews: 120,
    image:
      "https://media.istockphoto.com/id/2024653919/tr/foto%C4%9Fraf/turkish-kebab-b%C3%BCt%C3%BCn-et-food-cuisine-beef.jpg?s=2048x2048&w=is&k=20&c=WefrAANHNvpakIKRoWaM-fLddGN5tZ9Uq_xTopPmn0Q=",
  },
  {
    id: 2,
    name: "Yeldeğirmeni Kahve & Brunch",
    location: "Merkez, Cumhuriyet Cad.",
    tags: ["Kebap", "Izgara", "$$$"],
    rating: 4.7,
    reviews: 95,
    image:
      "https://www.foodiesfeed.com/wp-content/uploads/ff-images/2025/06/colorful-breakfast-spread-with-scrambled-eggs-and-fruits.webp",
  },
  {
    id: 3,
    name: "Bebek Sushi & Noodle",
    location: "Mavi Köprü Yanı",
    tags: ["Kafe", "Manzara", "$$"],
    rating: 4.8,
    reviews: 210,
    image:
      "https://www.foodiesfeed.com/wp-content/uploads/ff-images/2025/06/delicious-sushi-selection-with-fresh-ingredients.webp",
  },
];

const PopularRestaurants = () => {
  return (
    <div className="popular-section">
      <h2>Popüler Mekanlar</h2>
      <p className="subtitle">Misafirlerin en çok tercih ettiği restoranlar</p>

      <div className="popular-grid">
        {restaurants.map((res) => (
          <div className="restaurant-card" key={res.id}>
            <div className="image-box">
              <img src={res.image} alt={res.name} />

              <span className="rating-badge">
                ⭐ {res.rating} <span className="reviews">({res.reviews})</span>
              </span>
            </div>

            <div className="restaurant-info">
              <h3>{res.name}</h3>

              <p className="location">📍 {res.location}</p>

              <div className="tags">
                {res.tags.map((t, i) => (
                  <span key={i}>{t}</span>
                ))}
              </div>

              <button className="reserve-btn">Rezervasyon Yap</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularRestaurants;
