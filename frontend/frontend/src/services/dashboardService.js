import axios from "./axiosConfig";

/**
 * Kullanıcı panel verilerini (profil, istatistikler ve rezervasyonlar) çeker.
 * @param {string} userId - localStorage'dan gelen kullanıcı ID'si
 */
export const getUserDashboard = async (userId) => {
  try {
    // ID kontrolü
    if (!userId) {
      console.error("Servis Hatası: userId parametresi eksik.");
      return null;
    }

    // Backend isteği
    const response = await axios.get(`/api/users/${userId}/dashboard`);

    // HATA TESPİTİ İÇİN: Gelen veriyi konsola yazdırıyoruz.
    // Eğer burada 'upcoming' veya 'past' boş geliyorsa sorun backend/veritabanındadır.
    console.log("Backend'den Gelen Dashboard Verisi:", response.data);

    return response.data;
  } catch (error) {
    // İstek başarısız olursa hatayı detaylıca yazdır
    console.error("Dashboard verileri çekilirken bir hata oluştu:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    
    throw error;
  }
};