import axios from "axios";

//where it is going to eventually connect to backend w real data

const API_BASE_URL = "http://localhost:5173/api"; //should be backend url

export const loginUser = async (username, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, { username, password });
        return response.data; //expects a token or user data

    } catch (error) {
        throw error.response?.data || "Login failed";
    }
}

//registration code that is not correctly connected to the backend yet 

/*export const registerUser = async (username, password) => { //not correctly connected to backend
    try {
        const response = await axios.post(`${API_BASE_URL}/register`, { username, password });
        return response.data;
    } catch (error) {
        throw error.response?.data || "Registration failed";
    }
}*/

//mock registration code
export const registerUser = async (username, password) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Mock registration successful:", { username, password });
            resolve({ message: "Registration successful (mock)" });
        }, 1000); //Simulate a short delay
    });
};
