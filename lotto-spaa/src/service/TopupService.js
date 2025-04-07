import axios from 'axios';

const topUpAccount = async (amount) => {
  if (amount <= 0) {
    throw new Error("Please enter a valid amount.");
  }

  try {
    const response = await axios.post(
      "http://localhost:9000/v1/topup",
      { amount },
      {
        headers: {
          apikey: "hotdog",
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
        // withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error during top-up:", error);
    throw error;
  }
};

export { topUpAccount };