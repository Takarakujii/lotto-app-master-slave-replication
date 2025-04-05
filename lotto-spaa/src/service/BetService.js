import axios from 'axios';

const API_BASE_URL = "http://localhost:9000/v1";

export const placeBet = async (betNumber, token) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/bet`, {
      betAmount: "50",
      betNumber: betNumber
    }, {
      headers: {
        apikey: "hotdog",
        "Content-Type": "application/json",
        token: `${token}`,
      },
      withCredentials: true
    });
    console.log("check error", response.data)
    if (!response.data?.success) {
      throw new Error(response.data?.message || "Bet failed");
    }

    return response.data;
  } catch (error) {
    console.error("Bet error:", error);
    throw error;
  }
};