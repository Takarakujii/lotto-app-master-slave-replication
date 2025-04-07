
import axios from 'axios';

const API_BASE_URL = 'http:/lotto-api:9000/v1';

export const fetchPotAmount = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/pot`, {
            headers: {
                apikey: "hotdog"
            },
            // withCredentials: true
        });

        if (!response.data?.success) {
            console.log("lalal", response)
            throw new Error(response.data?.message || "Failed to fetch pot amount");
        }
        return response || 0;
    } catch (error) {
        console.error("Error fetching pot:", error);
        throw error;
    }
};