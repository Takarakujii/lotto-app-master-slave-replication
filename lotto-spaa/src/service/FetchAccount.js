import { useState } from 'react';
import axios from 'axios';

const useAccountForm = () => {
    const [balance, setBalance] = useState(0);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [error, setError] = useState("");

    const handleAccountForm = async () => {
        try {
            const response = await axios.get("http://localhost:9000/v1/account", {
                headers: {
                    apikey: "hotdog",
                    "Content-Type": "application/json",
                    token: localStorage.getItem('token')
                },
                // withCredentials: true,
            });

            if (response.data.success) {
                setBalance(response.data.data.balance);
                setUsername(response.data.data.username);
                setEmail(response.data.data.email);
                const birthdate = response.data.data.birth_date;
                const formattedBirthdate = birthdate.split('T')[0];
                setBirthdate(formattedBirthdate);

            } else {
                setError(response.data.message || "Failed to fetch balance.");
            }
        } catch (error) {
            console.error("Error fetching balance:", error);
            setError("Failed to fetch balance.");
        }
    };

    return {
        balance,
        username,
        email,
        birthdate,
        error,
        handleAccountForm,
    };
};

export default useAccountForm;