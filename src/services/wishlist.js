// src/services/wishlist.js
import api from "./api";

/**
 * If /wishlist/ returns a paginated response:
 * {
 *   "count": number,
 *   "next": "...",
 *   "previous": "...",
 *   "results": [...]
 * }
 * We'll extract .results so we always return an array.
 */
export const getWishlist = async () => {
  const response = await api.get("/menu/wishlist/");
  if (response.data && Array.isArray(response.data.results)) {
    return response.data.results;
  }
  return []; // fallback
};

export const addWishlistItem = async (courseId) => {
  const response = await api.post("/menu/wishlist/", { course_id: courseId });
  // If create also returns a paginated structure (rare), handle similarly
  return response.data;
};

export const removeWishlistItem = async (wishlistItemId) => {
  await api.delete(`/menu/wishlist/${wishlistItemId}/`);
};
