import React, { useEffect, useState } from "react";
import { getAllRestaurants } from "../services/restaurantService";
import RestaurantCard from "./RestaurantCard";
import "./RestaurantList.css";

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    getAllRestaurants().then((data) => setRestaurants(data));
  }, []);

  return (
    <div className="restaurant-list-wrapper">
      {restaurants.map((res) => (
        <RestaurantCard key={res.id} restaurant={res} />
      ))}
    </div>
  );
};

export default RestaurantList;
