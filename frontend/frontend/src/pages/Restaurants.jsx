import React from "react";
import Navbar from "../components/Navbar";
import RestaurantsHeader from "../components/RestaurantsHeader";
import RestaurantList from "../components/RestaurantList";
import Footer from "../components/Footer";
import "./restaurants.css";

const Restaurants = () => {
  return (
    <>
      <Navbar />

      <div className="restaurants-page">
        <RestaurantsHeader />
        <RestaurantList />
      </div>

      <Footer />
    </>
  );
};

export default Restaurants;
