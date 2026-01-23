import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../services/axiosConfig";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const RestaurantDetail = () => {
  const { id } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⭐ review state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  // ✅ DOĞRU GİRİŞ OKUMA
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const isLoggedIn = !!user?.token;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const r1 = await axios.get(`/api/restaurants/${id}`);
        setRestaurant(r1.data);

        const r2 = await axios.get(`/api/reviews/restaurant/${id}`);
        setReviews(r2.data || []);
      } catch (err) {
        console.error("Restaurant detail hatası:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const submitReview = async () => {
    if (!isLoggedIn) {
      setError("Yorum yapmak için giriş yapmalısınız.");
      return;
    }

    if (rating === 0 || comment.trim() === "") {
      setError("Puan ve yorum zorunludur.");
      return;
    }

    try {
      await axios.post("/api/reviews", {
        userId,
        restaurantId: Number(id),
        rating,
        comment,
      });

      setRating(0);
      setComment("");
      setError("");

      // yorumları yenile
      const res = await axios.get(`/api/reviews/restaurant/${id}`);
      setReviews(res.data || []);
    } catch (err) {
      setError(err.response?.data || "Yorum eklenemedi");
    }
  };

  if (loading) return <div style={{ padding: 40 }}>Yükleniyor...</div>;
  if (!restaurant) return <div style={{ padding: 40 }}>Restoran bulunamadı.</div>;

  return (
    <>
      <Navbar />

      <div style={{ padding: 40, maxWidth: 900, margin: "0 auto" }}>
        <h1>{restaurant.name}</h1>
        <p>{restaurant.location}</p>
        <p>{restaurant.description}</p>

        <div style={{ marginTop: 10 }}>
          ⭐ {restaurant.rating || "0.0"} / 5
        </div>

        <Link to={`/rezervasyon/${restaurant.id}`}>
          🟢 Rezervasyon Yap
        </Link>

        <hr style={{ margin: "40px 0" }} />

        {/* ⭐ YORUM EKLE */}
        <h2>Değerlendir</h2>

        <div style={{ marginBottom: 10 }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              onClick={() => setRating(n)}
              style={{
                fontSize: 26,
                cursor: "pointer",
                color: n <= rating ? "#f59e0b" : "#d1d5db",
              }}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          placeholder="Yorumunuzu yazın..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={{ width: "100%", height: 90, padding: 10 }}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button
          onClick={submitReview}
          style={{
            marginTop: 10,
            padding: "10px 20px",
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Yorumu Gönder
        </button>

        <hr style={{ margin: "40px 0" }} />

        {/* 📋 YORUMLAR */}
        <h2>Değerlendirmeler</h2>

        {reviews.length === 0 && <p>Henüz değerlendirme yok.</p>}

        {reviews.map((r) => (
          <div
            key={r.id}
            style={{
              padding: 16,
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              marginBottom: 12,
            }}
          >
            <strong>{r.user?.name}</strong>
            <div>⭐ {r.rating} / 5</div>
            <p>{r.comment}</p>
          </div>
        ))}
      </div>

      <Footer />
    </>
  );
};

export default RestaurantDetail;
