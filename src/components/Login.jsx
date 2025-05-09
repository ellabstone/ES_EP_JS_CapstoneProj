//James
import React, { useState } from "react";
import {
  Button,
  Input,
  VStack,
  Text,
  Heading,
  Box
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("https://eden-backend-eabf.onrender.com/api/login", {
        username,
        password,
      });

      const { user } = response.data;

      // Save user ID to localStorage
      localStorage.setItem("userId", user.id);

      alert("Login successful! Redirecting...");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.msg || "Login failed. Please try again."
      );
    }
  };

  return (
    <Box maxW="400px" mx="auto" mt={20} p={6} boxShadow="md" borderRadius="md" bg="white">
      <VStack spacing={5}>
        <Heading size="lg">Login</Heading>
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <Text color="red.500">{error}</Text>}
        <Button colorScheme="blue" width="100%" onClick={handleLogin}>
          Login
        </Button>
      </VStack>
    </Box>
  );
};

export default Login;


