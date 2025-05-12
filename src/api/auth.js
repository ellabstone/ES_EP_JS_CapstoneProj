//ella
import axios from "axios";


/*export const loginUser = async (username, password) => {
    try {
        const response = await axios.post(`${APIurl}/login`, { username, password });
        return response.data; //expects a token or user data

    } catch (error) {
        throw error.response?.data || "Login failed";
    }
}
*/

export const registerUser = async (name, username, password) => {
    const response = await fetch("https://eden-backend-eabf.onrender.com/api/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, username, password })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.msg || "Registration failed");
    }

    return data;
};
