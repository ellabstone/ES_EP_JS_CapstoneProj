//James
import React, { useState, useEffect } from "react";
import { Table } from "@chakra-ui/react";
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
  Input,
  HStack,
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

const COLORS = ["#319795", "#D3D3D3", "#4A5568"];

const FiftyThirtyTwenty = () => {
  const [open, setOpen] = useState(false);
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    axios
      .get(`https://eden-backend-eabf.onrender.com/api/users/${userId}/budgets`)
      .then((res) => {
        const latest = res.data[res.data.length - 1];
        const categoryTotals = { Needs: 0, Wants: 0, Savings: 0 };

        latest.expenses.forEach((exp) => {
          const cat = exp.category_name;
          if (categoryTotals.hasOwnProperty(cat)) {
            categoryTotals[cat] += exp.amount;
          }
        });

        const pieDataFormatted = Object.entries(categoryTotals).map(
          ([name, value]) => ({ name, value })
        );
        setPieData(pieDataFormatted);

        const actuals = { Needs: 0, Wants: 0, Savings: 0 };
        latest.expenses.forEach((expense) => {
          const cat = expense.category_name;
          if (actuals.hasOwnProperty(cat)) {
            actuals[cat] += expense.amount;
          }
        });

        const barDataFormatted = latest.all_categories.map((cat) => ({
          category: cat.title,
          budgeted: cat.allocated_amount,
          actual: actuals[cat.title] || 0,
        }));
        setBarData(barDataFormatted);
      })
      .catch((err) => {
        console.error("Failed to fetch latest budget:", err);
      });
  }, []);

  return (
    <Flex minH="100vh">
      {/* LEFT SIDE */}
      <Box flex="1" p={8} bg="white" display="flex" flexDirection="column" alignItems="center">
        <Heading fontSize="2xl" mb={1}>50/30/20</Heading>
        <Text fontStyle="italic" mb={6}>
          Description that explains how 50/30/20 works
        </Text>

        <Heading size="md" mb={3} textAlign="center">
          How you're spending your money
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
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {(() => {
          const savingsData = barData.find((item) => item.category === "Savings");

          if (!savingsData) return null;

          const { actual, budgeted } = savingsData;
          const difference = actual - budgeted;
          const isAbove = difference >= 0;

          return (
            <Text textAlign="center" fontStyle="italic" mt={2}>
              You are currently spending ${Math.abs(difference)} {isAbove ? "above" : "below"} your current savings goal.{" "}
              {isAbove ? "Keep up the good work!" : "Prioritize your savings to get back on track!"}
            </Text>
          );
        })()}


        <Card.Root w="100%" maxW="470px" mb={6}>
          <Card.Header>
            <Heading size="sm">Not sure what this means?</Heading>
          </Card.Header>
          <Card.Body>
            <Button onClick={() => setOpen(true)} colorScheme="blackAlpha" w="100%">
              Learn About the 50/30/20 Rule
            </Button>
          </Card.Body>
        </Card.Root>

        <Box mt={2}>
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
              <Heading size="sm">Compare Budgeted vs Actual Spending</Heading>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="budgeted" fill="#A0AEC0" name="Budgeted" />
                  <Bar
                    dataKey="actual"
                    name="Actual"
                    shape={({ x, y, width, height, payload }) => {
                      let color = "#E53E3E";
                      if (
                        payload.category === "Needs" ||
                        payload.category === "Wants"
                      ) {
                        if (payload.actual < payload.budgeted) {
                          color = "#38A169";
                        }
                      } else if (payload.category === "Savings") {
                        if (payload.actual >= payload.budgeted) {
                          color = "#38A169";
                        }
                      }
                      return (
                        <rect x={x} y={y} width={width} height={height} fill={color} />
                      );
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
              <Text mt={2} fontSize="sm" fontStyle="italic" textAlign="center">
                Budgeted amounts are shown in grey. Actual spending is shown in color.
              </Text>
            </Card.Body>
          </Card.Root>
          <Card.Root w="100%">
            <Card.Header>
              <Heading size="sm">Add One-Time Purchase</Heading>
            </Card.Header>
            <Card.Body>
              <VStack spacing={4} align="stretch">
                <HStack>
                  <Input placeholder="Title" />
                  <Input placeholder="Amount" type="number" />
                  <select style={{ padding: "8px", borderRadius: "4px" }}>
                    <option value="">Category</option>
                    <option value="Needs">Needs</option>
                    <option value="Wants">Wants</option>
                    <option value="Savings">Savings</option>
                  </select>
                  <Button colorScheme="blue">Add Purchase</Button>
                </HStack>
                <Text fontSize="sm" color="gray.500">
                  These purchases are added on top of your recurring expenses.
                </Text>
              </VStack>
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
                <Drawer.Title>How the 50/30/20 Rule Works</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <Text><strong>50% — Needs</strong></Text>
                <Text mb={3}>
                  Spend no more than half your after-tax income on necessities like rent, groceries, utilities, transportation, and insurance.
                </Text>
                <Text><strong>30% — Wants</strong></Text>
                <Text mb={3}>
                  Use up to 30% on discretionary items — things that enhance your lifestyle but aren’t essential, like dining out, hobbies, or subscriptions.
                </Text>
                <Text><strong>20% — Savings & Debt</strong></Text>
                <Text>
                  Allocate at least 20% to savings and debt repayment — including building your emergency fund, investing, or paying off loans.
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

export default FiftyThirtyTwenty;


