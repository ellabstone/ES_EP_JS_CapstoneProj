//Ella
import React from "react";
import {
  Box,
  Text,
  Button,
  VStack,
  HStack,
  Stack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <Box
      minH="100vh"
      bg="white"
      color="black"
      position="relative"
      overflow="hidden"
    >
      {/*Background*/}
      <Box
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
        bgImage="url('/assets/varying-stripes.png')"
        bgSize="cover"
        bgPosition="center"
        opacity={0.5}
        zIndex={0}
      />

      {/*Content in Front */}
      <VStack
        spacing={6}
        zIndex={1}
        position="relative"
        pt={20}
        px={6}
        textAlign="center"
      >
        {/* Title */}
        <Text
          fontSize={{ base: "5xl", md: "7xl" }}
          fontWeight="bold"
          color="teal.600"
        >
          Budget 4 You
        </Text>
        <Text fontSize="xl" color="gray.700" mb={4}>
          Streamline your spending. Master your money.
        </Text>

        {/* REgister and logn */}
        <HStack spacing={6} mb={8}>
          <Button
            as={Link}
            to="/register"
            colorScheme="teal"
            size="lg"
            px={10}
            fontWeight="semibold"
          >
            Get Started
          </Button>
          <Button
            as={Link}
            to="/login"
            variant="outline"
            borderColor="teal.500"
            color="teal.600"
            size="lg"
            px={10}
            fontWeight="semibold"
          >
            Login
          </Button>
        </HStack>

        {/* Description*/}
        <VStack spacing={3} maxW="700px">
          <Text fontSize="lg" fontWeight="bold">
            About Our Budgeting Tool
          </Text>
          <Text fontSize="md" color="gray.700">
              <strong>50/20/30 Budget</strong> – Balance needs, savings, and wants with ease.
          </Text>
          <Text fontSize="md" color="gray.700">
              <strong>Pay Yourself First</strong> – Build security by saving first.
          </Text>
          <Text fontSize="md" color="gray.600">
            Start budgeting smarter today.
          </Text>
        </VStack>
      </VStack>
    </Box>
  );
};

export default HomePage;
