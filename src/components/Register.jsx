import React, { useState } from "react";
import { registerUser } from "../api/auth";
import { Button, Input, VStack, Text } from "@chakra-ui/react";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async () => {
        try {
            const data = await registerUser(username, password);
            alert("Registration successful! You can now log in.");
            window.location.href = "/login";
        } catch (err) {
            setError(err);
        }
    };

    return (
        <VStack spacing={4} p={5}>
            <Text fontSize="xl">Register</Text>
            <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <Text color="red.500">{error}</Text>}
            <Button colorScheme="green" onClick={handleRegister}>Register</Button>
        </VStack>
    );
};

export default Register;