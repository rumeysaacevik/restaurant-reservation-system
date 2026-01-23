import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import CategoryList from "../components/CategoryList";
import PopularRestaurants from "../components/PopularRestaurants";
import InfoSection from "../components/InfoSection";
import Footer from "../components/Footer";

// home.css importu
import "./home.css";

const Home = () => {
  return (
    <>
      {/* NAVBAR */}
      <Navbar />

      {/* HERO TAM EKRAN */}
      <HeroSection />

      {/* ANA İÇERİK */}
      <main className="home-wrapper">
        <CategoryList />
        <PopularRestaurants />
        <InfoSection />
      </main>

      {/* FOOTER */}
      <Footer />
    </>
  );
};

export default Home;