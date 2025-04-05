import axios from 'axios';

const API_BASE_URL = 'http://localhost:9000/v1';


export const fetchWinResult = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/win-result/history`, {
            headers: {
                apikey: "hotdog",
                "Content-Type": "application/json",
                token: localStorage.getItem('token')
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching win result:", error);
        throw error;
    }

};