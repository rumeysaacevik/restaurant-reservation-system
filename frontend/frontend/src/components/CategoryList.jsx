import React from "react";
import "./CategoryList.css";

const categories = [
  { name: "Kahvaltı", icon: "🥐" },
  { name: "Kebap & Izgara", icon: "🍖" },
  { name: "Yöresel Yemekler", icon: "🍲" },
  { name: "Kafe & Tatlı", icon: "🍰" },
  { name: "Nehir Kenarı", icon: "🏞️" },
];

const CategoryList = () => {
  return (
    <div className="category-section">
      <div className="category-header">
        <h2>Kategorilere Göz Atın</h2>
        <a href="#">Tümünü Gör →</a>
      </div>

      <div className="category-container">
        {categories.map((cat, index) => (
          <div className="category-item" key={index}>
            <span className="category-icon">{cat.icon}</span>
            <p>{cat.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
