//ella
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  Portal,
  Drawer,
  CloseButton,
} from "@chakra-ui/react";
import { Card } from "@chakra-ui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";

// Constants for Pie Chart Color Palette
const COLORS = ["#38A169", "#319795", "#D3D3D3", "#ECC94B", "#ED8936", "#E53E3E"];
const savingsGoal = 1000;

const PayYourselfFirst = () => {
  const [open, setOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [allocationData, setAllocationData] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      const storedId = localStorage.getItem("userId");
      const userId = storedId ? parseInt(storedId, 10) : null;

      if (!userId || isNaN(userId)) return;

      try {
        const res = await axios.get(
          `https://eden-backend-eabf.onrender.com/api/users/${userId}/initial-expenses`
        );
        const fetchedExpenses = res.data;
        setExpenses(fetchedExpenses);

        const categorizedData = categorizeExpenses(fetchedExpenses);
        setPieData(categorizedData.pie);
        setAllocationData(categorizedData.allocation);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, []);

  const categorizeExpenses = (expenses) => {
    const categoryTotals = {};

    expenses.forEach((exp) => {
      const category = exp.category || "Uncategorized";
      const amount = exp.allocatedAmount ?? exp.amount ?? 0;

      if (categoryTotals[category]) {
        categoryTotals[category] += amount;
      } else {
        categoryTotals[category] = amount;
      }
    });

    const pie = Object.entries(categoryTotals).map(([category, value]) => ({
      name: category,
      value,
    }));

    const allocation = expenses.map((exp) => ({
      title: exp.title || "Untitled",
      amount: exp.allocatedAmount ?? exp.amount ?? 0,
      category: exp.category || "Uncategorized",
    }));

    return { pie, allocation };
  };

  return (
    <Flex minH="100vh">
      {/* LEFT SIDE */}
      <Box
        flex="1"
        p={8}
        bg="white"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Heading fontSize="2xl" mb={1}>
          Pay Yourself First
        </Heading>
        <Text fontStyle="italic" mb={6} textAlign="center">
          Instead of saving what's left after spending, save first—then spend
          what's left.
        </Text>

        <Heading size="md" mb={3} textAlign="center">
          Your Allocations
        </Heading>

        <Box w="100%" maxW="400px" mb={6}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        <Text textAlign="center" fontStyle="italic">
          Great job! You've prioritized saving this month. Adjust wants if
          needed.
        </Text>

        <Box mt={10}>
          <Button as={RouterLink} to="/dashboard">
            Back to Dashboard
          </Button>
        </Box>
      </Box>

      {/* RIGHT SIDE */}
      <Box flex="1" bg="gray.50" p={8}>
        <VStack spacing={6}>
          <Card.Root w="100%">
            <Card.Header>
              <Heading size="sm">Track Your Spending</Heading>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={allocationData}>
                  <XAxis dataKey="title" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="amount"
                    shape={({ x, y, width, height, payload }) => (
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        fill={
                          payload.amount >= savingsGoal
                            ? "#38A169"
                            : "#E53E3E"
                        }
                      />
                    )}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card.Root>

          <Card.Root w="100%">
            <Card.Header>
              <Heading size="sm">Not sure what this means?</Heading>
            </Card.Header>
            <Card.Body>
              <Button
                onClick={() => setOpen(true)}
                colorScheme="blackAlpha"
                w="100%"
              >
                Learn About Pay Yourself First
              </Button>
            </Card.Body>
          </Card.Root>
        </VStack>
      </Box>

      {/* Drawer */}
      <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Drawer.Trigger asChild>
          <span></span>
        </Drawer.Trigger>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>How Pay Yourself First Works</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <Text>
                  <strong>1. Save First</strong>
                </Text>
                <Text mb={3}>
                  Automatically move a fixed amount to savings right when you
                  get paid.
                </Text>
                <Text>
                  <strong>2. Cover Needs</strong>
                </Text>
                <Text mb={3}>
                  Use what's left for essentials like rent, groceries, and
                  transportation.
                </Text>
                <Text>
                  <strong>3. Limit Wants</strong>
                </Text>
                <Text>
                  Spend discretionary money wisely—only after saving and
                  covering needs.
                </Text>
              </Drawer.Body>
              <Drawer.Footer>
                <Button onClick={() => setOpen(false)}>Close</Button>
              </Drawer.Footer>
              <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </Flex>
  );
};

export default PayYourselfFirst;
