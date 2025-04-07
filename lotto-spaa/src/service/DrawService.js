import axios from 'axios';

const API_BASE_URL = "http://localhost:9000/v1";

export const generateNewDraw = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/draw/`, {}, {
      headers: {
        apikey: "hotdog",
        "Content-Type": "application/json",
        token: localStorage.getItem('token')
      },
      // withCredentials: true
    });

    if (!response.data?.success) {
      throw new Error(response.data?.message || "Draw generation failed");
    }

    return response.data;
  } catch (error) {
    console.error("Draw error:", error);
    throw error;
  }
};

export const fetchLastWinningNumber = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/draw/last`, {
      headers: {
        apikey: "hotdog",
        "Content-Type": "application/json",
        token: `${token}`,
      },
      // withCredentials: true
    });
    console.log("last draw", response.data);
    if (!response.data?.success) {
      throw new Error(response.data?.message || "Failed to fetch draw");
    }


    return response.data;
  } catch (error) {
    console.error("Fetch draw error:", error);
    throw error;
  }
};