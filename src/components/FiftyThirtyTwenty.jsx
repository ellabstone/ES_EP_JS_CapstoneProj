import React, { useState } from "react";
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

const savingsData = [
  { month: "Jan", savings: 1800 },
  { month: "Feb", savings: 2100 },
  { month: "Mar", savings: 550 },
  { month: "Apr", savings: 2300 },
  { month: "May", savings: 1750 },
  { month: "Jun", savings: 2000 },
];

const pieData = [
  { name: "Needs", value: 5000 },
  { name: "Wants", value: 4000 },
  { name: "Savings", value: 1000 },
];

const COLORS = ["#319795", "#D3D3D3", "#4A5568"];
const savingsGoal = 2000;

const FiftyThirtyTwenty = () => {
  const [open, setOpen] = useState(false);

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

        <Text textAlign="center" fontStyle="italic">
          You are currently expending $1000 over your "wants" limit. <br />
          Next month your savings budget is $3000 to get back on track.
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
              <Heading size="sm">Track Your Savings</Heading>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={savingsData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="savings"
                    shape={({ x, y, width, height, payload }) => (
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        fill={payload.savings >= savingsGoal ? "#38A169" : "#E53E3E"}
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
              <Button onClick={() => setOpen(true)} colorScheme="blackAlpha" w="100%">
                Learn About the 50/30/20 Rule
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