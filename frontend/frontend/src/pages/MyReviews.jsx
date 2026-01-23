import React, { useEffect, useState } from "react";
import axios from "../services/axiosConfig";

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`/api/reviews/user/${user.id}`);
        setReviews(res.data || []);
      } catch (err) {
        console.error("Yorumlar alınamadı", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchReviews();
  }, [user]);

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div>
      <h2>Değerlendirmelerim</h2>

      {reviews.length === 0 && (
        <p>Henüz hiç değerlendirme yapmadınız.</p>
      )}

      {reviews.map((r) => (
        <div
          key={r.id}
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: 16,
            marginBottom: 12,
          }}
        >
          <strong>{r.restaurant?.name}</strong>
          <div>⭐ {r.rating} / 5</div>
          <p>{r.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default MyReviews;
