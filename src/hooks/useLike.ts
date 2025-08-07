import { useState, useEffect } from 'react';
import axios from 'axios';

interface LikeStatus {
  isLiked: boolean;
  likeCount: number;
}

export function useLike(productId: string) {
  const [likeStatus, setLikeStatus] = useState<LikeStatus>({
    isLiked: false,
    likeCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`
  });

  // Fetch initial like status
  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await axios.get(
          `http://143.198.212.38:5000/api/likes/products/${productId}/status`,
          { headers: getAuthHeaders() }
        );
        setLikeStatus(response.data);
      } catch (error) {
        console.error('Error fetching like status:', error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchLikeStatus();
    }
  }, [productId]);

  // Toggle like function
  const toggleLike = async () => {
    if (toggling) return;

    try {
      setToggling(true);
      const response = await axios.post(
        `http://143.198.212.38:5000/api/likes/products/${productId}/toggle`,
        {},
        { headers: getAuthHeaders() }
      );
      
      setLikeStatus({
        isLiked: response.data.isLiked,
        likeCount: response.data.likeCount
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    } finally {
      setToggling(false);
    }
  };

  return {
    isLiked: likeStatus.isLiked,
    likeCount: likeStatus.likeCount,
    loading,
    toggling,
    toggleLike
  };
}