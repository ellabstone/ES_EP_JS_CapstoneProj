//Ella UI James API
import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  Heading,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post("https://eden-backend-eabf.onrender.com/api/users", {
        name,
        username,
        password,
      });

      const userId = response.data.new_user.id;
      localStorage.setItem("userId", userId);
      
      navigate("/financialQuestions");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Registration failed. Please try again.");
    }
  };

  return (
    <Box maxW="400px" mx="auto" mt={20} p={6} boxShadow="md" borderRadius="md" bg="white">
      <VStack spacing={5}>
        <Heading size="lg">Register</Heading>
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <Button colorScheme="blue" width="100%" onClick={handleRegister}>
          Register
        </Button>
      </VStack>
    </Box>
  );
};

export default Register;