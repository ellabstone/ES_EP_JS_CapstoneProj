import React, { useState } from "react";
// import { loginUser } from "../api/auth";
import { Button, Input, VStack, Text } from "@chakra-ui/react";
//New Code Added to help transition to dashboard
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    
    //New Code Added to help transition to dashboard

    const navigate = useNavigate();
    
    const handleLogin = async () => {
        try {
            //Temporarily commenting the authentication out for testing purposes
            //const data = await loginUser(username, password);
            //localStorage.setItem("token", data.token); //Store auth token
            // const data = await loginUser(username, password);
            // localStorage.setItem("token", data.token); //Store auth token
            alert("Login successful!");
            navigate("/dashboard/")
            
        }catch (err) {
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
