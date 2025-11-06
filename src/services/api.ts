/**
 * API Client for City Explorer Backend
 * Handles all HTTP requests to the FastAPI backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface Landmark {
  id: string;
  city_id: string;
  name: string;
  description?: string;
  category: string;
  year_established?: number;
  latitude: number;
  longitude: number;
  discovery_radius_meters: number;
  image_url?: string;
  ai_summary?: string;
  created_at: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  created_at: string;
  total_xp: number;
  level: number;
}

export interface Discovery {
  id: string;
  user_id: string;
  landmark_id: string;
  discovered_at: string;
  xp_earned: number;
  discovery_method: string;
  latitude?: number;
  longitude?: number;
}

export interface Progress {
  id: string;
  user_id: string;
  city_id: string;
  landmarks_discovered: number;
  total_landmarks: number;
  unlocked_regions: string[];
  last_visited?: string;
  updated_at: string;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: response.statusText }));
      throw new ApiError(response.status, errorData.detail || 'Request failed');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export const api = {
  // Landmarks
  async getLandmarks(cityId?: string, category?: string): Promise<Landmark[]> {
    const params = new URLSearchParams();
    if (cityId) params.append('city_id', cityId);
    if (category) params.append('category', category);
    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchApi<Landmark[]>(`/api/v1/landmarks${query}`);
  },

  async getLandmark(landmarkId: string): Promise<Landmark> {
    return fetchApi<Landmark>(`/api/v1/landmarks/${landmarkId}`);
  },

  async getNearbyLandmarks(
    latitude: number,
    longitude: number,
    radiusMeters: number = 100,
    cityId?: string
  ): Promise<Landmark[]> {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      radius_meters: radiusMeters.toString(),
    });
    if (cityId) params.append('city_id', cityId);
    return fetchApi<Landmark[]>(`/api/v1/landmarks/nearby?${params.toString()}`);
  },

  async discoverLandmark(
    landmarkId: string,
    userId: string,
    discoveryMethod: 'gps' | 'ar_scan' | 'manual' = 'ar_scan',
    latitude?: number,
    longitude?: number
  ): Promise<{ message: string; discovery_id: string; xp_earned: number }> {
    const params = new URLSearchParams({
      user_id: userId,
      discovery_method: discoveryMethod,
    });
    if (latitude !== undefined) params.append('latitude', latitude.toString());
    if (longitude !== undefined) params.append('longitude', longitude.toString());
    
    return fetchApi<{ message: string; discovery_id: string; xp_earned: number }>(
      `/api/v1/landmarks/${landmarkId}/discover?${params.toString()}`,
      { method: 'POST' }
    );
  },

  // Discoveries
  async getUserDiscoveries(userId: string, cityId?: string): Promise<Discovery[]> {
    const params = cityId ? `?city_id=${cityId}` : '';
    return fetchApi<Discovery[]>(`/api/v1/users/${userId}/discoveries${params}`);
  },

  async getDiscoveryStats(userId: string): Promise<{
    user_id: string;
    total_discoveries: number;
    total_xp: number;
    level: number;
  }> {
    return fetchApi(`/api/v1/discoveries/stats?user_id=${userId}`);
  },

  // Progress
  async getUserProgress(userId: string): Promise<Progress[]> {
    return fetchApi<Progress[]>(`/api/v1/users/${userId}/progress`);
  },

  async getCityProgress(userId: string, cityId: string): Promise<Progress> {
    return fetchApi<Progress>(`/api/v1/users/${userId}/progress/${cityId}`);
  },

  async getUnlockedRegions(userId: string, cityId: string): Promise<{
    unlocked_regions: Array<{ id: string; name: string; unlock_threshold: number }>;
  }> {
    return fetchApi(`/api/v1/users/${userId}/progress/${cityId}/regions`);
  },

  // Users
  async createUser(username: string, email: string): Promise<User> {
    return fetchApi<User>('/api/v1/users', {
      method: 'POST',
      body: JSON.stringify({ username, email }),
    });
  },

  async getUser(userId: string): Promise<User> {
    return fetchApi<User>(`/api/v1/users/${userId}`);
  },
};

export default api;
