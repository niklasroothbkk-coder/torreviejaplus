// Venue Service - API calls for venue data

const API_BASE_URL = 'https://your-main-website.com/api';

export const fetchVenues = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const url = `${API_BASE_URL}/venues${queryParams ? `?${queryParams}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching venues:', error);
    throw error;
  }
};

export const fetchVenueById = async (venueId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/venues/${venueId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching venue details:', error);
    throw error;
  }
};

export const submitVenueReview = async (venueId, reviewData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/venues/${venueId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
};

export const addVenueToFavorites = async (venueId, userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ venueId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

export const removeVenueFromFavorites = async (venueId, userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/favorites/${venueId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};
