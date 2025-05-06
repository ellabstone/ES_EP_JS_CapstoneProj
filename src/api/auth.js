import axios from "axios";

const API_BASE_URL = "http://localhost:5173/api"; //should be backend url

export const loginUser = async (username, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, { username, password });
        return response.data; //expects a token or user data

    } catch (error) {
        throw error.response?.data || "Login failed";
    }
}

export const registerUser = async (username, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/register`, { username, password });
        return response.data;
    } catch (error) {
        throw error.response?.data || "Registration failed";
    }
}