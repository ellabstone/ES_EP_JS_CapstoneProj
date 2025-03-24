import React, { useState } from "react";
import { loginUser } from "../api/auth";
import { Button, Input, VStack, Text } from "@chakra-ui/react";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    
    const handleLogin = async () => {
        try {
            const data = await loginUser(username, password);
            localStorage.setItem("token", data.token); //Store auth token
            alert("Login successful!");
            window.location.href = "/dashboard"; //Redirect after login
        } catch (err) {
            setError(err);
        }
    };

    return (
        <VStack spacing={4} p={5}>
            <Text fontSize="xl">Login</Text>
            <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <Text color="red.500">{error}</Text>}
            <Button colorScheme="blue" onClick={handleLogin}>Login</Button>
        </VStack>
    );
};

export default Login;