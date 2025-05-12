// James
import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Image,
  Button,
  Flex,
  VStack,
  Progress,
  Table,
} from "@chakra-ui/react";
import { Tabs } from "@chakra-ui/react";
import { LuFolder, LuUser } from "react-icons/lu";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [userName, setUserName] = useState("User");
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();


  //Makes All Numbers equivialant to a month
  const getMonthlyEquivalent = (amount, frequency) => {
    switch (frequency.toLowerCase()) {
      case "weekly":
        return amount * 4;
      case "biweekly":
        return amount * 2;
      case "monthly":
        return amount;
      case "yearly":
        return amount / 12;
      default:
        return amount;
    }
  };

  const totalIncome = incomes.reduce((sum, inc) => sum + getMonthlyEquivalent(inc.amount, inc.frequency), 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + getMonthlyEquivalent(exp.amount, exp.frequency), 0);
  const totalSavings = Math.max(0, totalIncome - totalExpenses);
  const savingsPercentage = totalIncome > 0 ? Math.round((totalSavings / totalIncome) * 100) : 0;

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    axios
      .get(`https://eden-backend-eabf.onrender.com/api/users/${userId}`)
      .then((res) => {
        setUserName(res.data.name);
        setIncomes(res.data.initial_incomes);
        setExpenses(res.data.initial_expenses);
      })
      .catch((err) => {
        console.error("Failed to fetch user data:", err);
      });
  }, []);

  const handleCreateBudgetAndNavigate = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      await axios.post(`https://eden-backend-eabf.onrender.com/api/users/${userId}/budget`, {
        title: "My New 50/30/20 Budget",
        method: "50-30-20",
      });
      navigate("/IntermedFTT");
    } catch (err) {
      console.error("Failed to create 50/30/20 budget:", err);
    }
  };

  return (
    <Box p={8}>
      <Flex justify="flex-end" gap={4} mb={4}>
        <Button onClick={() => navigate("/settings")} size="sm">Settings</Button>
        <Button
          size="sm"
          onClick={() => {
            localStorage.removeItem("userId");
            navigate("/");
          }}
        >
          Log Out
        </Button>
      </Flex>
      <Heading textAlign="center">Dashboard</Heading>
      <Text textAlign="center" fontStyle="italic" mb={10}>
        This is your central hub. You can explore different budgeting methods or
        manage your personal finances. Start by selecting a plan below or
        updating your numbers.
      </Text>

      <Flex direction={{ base: "column", lg: "row" }} gap={6} align="flex-start">
        <VStack spacing={6} flex="1" minW="250px">
          <Flex justify="space-between" align="center" w="100%">
            <Text fontWeight="bold" fontSize="lg">
              Welcome to your Dashboard, {userName}
            </Text>
          </Flex>

          <Box bg="white" p={5} shadow="md" borderRadius="md" w="100%">
            <Heading size="md" mb={3}>Monthly Income Statement</Heading>
            <Text>Income: ${totalIncome}</Text>
            <Text>Expenses: ${totalExpenses}</Text>
            <Text>Savings: ${totalSavings}</Text>
          </Box>

          <Box bg="white" p={5} shadow="md" borderRadius="md" w="100%">
            <Heading size="md" mb={3}>Budget Health</Heading>
            <Text mb={2}>You’re earning {savingsPercentage}% more than you spend.</Text>
            <Progress.Root height="10px" bg="gray.200" borderRadius="md">
              <Progress.Track>
                <Progress.Range
                  style={{
                    width: `${savingsPercentage}%`,
                    backgroundColor:
                      savingsPercentage >= 20
                        ? "#38A169"
                        : savingsPercentage >= 10
                        ? "#D69E2E"
                        : "#E53E3E",
                  }}
                />
              </Progress.Track>
            </Progress.Root>
          </Box>
        </VStack>

        <Box flex="2" minW="350px">
          <Box bg="white" p={6} borderRadius="md" shadow="md">
            <Tabs.Root variant="enclosed" fitted defaultValue="income" width="100%">
              <Tabs.List>
                <Tabs.Trigger value="income">
                  <LuUser />
                  Income
                </Tabs.Trigger>
                <Tabs.Trigger value="expenses">
                  <LuFolder />
                  Expenses
                </Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="income">
                <Table.Root size="sm">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader>Title</Table.ColumnHeader>
                      <Table.ColumnHeader>Amount</Table.ColumnHeader>
                      <Table.ColumnHeader>Frequency</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {incomes.map((item, index) => (
                      <Table.Row key={index} bg="green.50">
                        <Table.Cell>{item.title}</Table.Cell>
                        <Table.Cell color="green.600">${item.amount}</Table.Cell>
                        <Table.Cell>{item.frequency}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Tabs.Content>

              <Tabs.Content value="expenses">
                <Table.Root size="sm">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader>Title</Table.ColumnHeader>
                      <Table.ColumnHeader>Amount</Table.ColumnHeader>
                      <Table.ColumnHeader>Frequency</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {expenses.map((item, index) => (
                      <Table.Row key={index} bg="red.50">
                        <Table.Cell>{item.title}</Table.Cell>
                        <Table.Cell color="red.600">${item.amount}</Table.Cell>
                        <Table.Cell>{item.frequency}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Tabs.Content>
            </Tabs.Root>

            <Button
              colorScheme="red"
              mt={4}
              onClick={async () => {
                const userId = localStorage.getItem("userId");
                if (!userId) return;

                try {
                  const incomeRes = await axios.get(`https://eden-backend-eabf.onrender.com/api/users/${userId}/initial-incomes`);
                  for (let income of incomeRes.data) {
                    await axios.delete(`https://eden-backend-eabf.onrender.com/api/users/${userId}/initial-incomes/${income.id}`);
                  }

                  const expenseRes = await axios.get(`https://eden-backend-eabf.onrender.com/api/users/${userId}/initial-expenses`);
                  for (let expense of expenseRes.data) {
                    await axios.delete(`https://eden-backend-eabf.onrender.com/api/users/${userId}/initial-expenses/${expense.id}`);
                  }

                  setIncomes([]);
                  setExpenses([]);
                  navigate("/financialQuestions");
                } catch (err) {
                  console.error("Reset failed:", err);
                }
              }}
            >
              Reset Finances
            </Button>
          </Box>
        </Box>

        <VStack spacing={3} flex="1" minW="280px">
          <Text fontWeight="bold" fontSize="lg">
            Create and Explore Budgets
          </Text>

          <Flex
            gap={4}
            align="center"
            bg="white"
            p={4}
            borderRadius="md"
            shadow="sm"
            w="100%"
          >
            <Image src="/assets/money-bag.gif" boxSize="80px" objectFit="cover" />
            <Box>
              <Button
                colorScheme="teal"
                mb={2}
                onClick={async () => {
                  const userId = localStorage.getItem("userId");
                  if (!userId) return;

                  await axios.post(`https://eden-backend-eabf.onrender.com/api/users/${userId}/budget`, {
                    title: "My 50/30/20 Budget",
                    method: "50-30-20",
                  });

                  window.location.href = "/IntermedFTT"; // EXACTLY how the PYF one works
                }}
              >
                Create New Budget
              </Button>
              <Button
                as={RouterLink}
                to="/budget-503020"
                size="sm"
                colorScheme="gray"
                mb={2}
              >
                View My Budget
              </Button>
              <Text fontSize="sm">
                Spend 50% on needs, 30% on wants, and 20% on savings.
              </Text>
            </Box>
          </Flex>

          <Flex
            gap={4}
            align="center"
            bg="white"
            p={4}
            borderRadius="md"
            shadow="sm"
            w="100%"
          >
            <Image src="/assets/save-money.gif" boxSize="80px" objectFit="cover" />
            <Box>
            <Button
                colorScheme="teal"
                mb={2}
                onClick={async () => {
                  const userId = localStorage.getItem("userId");
                  if (!userId) return;

                  await axios.post(`https://eden-backend-eabf.onrender.com/api/users/${userId}/budget`, {
                    title: "My PYF Budget",
                    method: "pay-yourself-first",
                  });

                  window.location.href = "/IntermedPYF";
                }}
              >
                Create New Budget
              </Button>
              <Button
                as={RouterLink}
                to="/budget-pay-yourself"
                size="sm"
                colorScheme="gray"
                mb={2}
              >
                View My Budget
              </Button>
              <Text fontSize="sm">
                Save before spending - Prioritize long term financial health.
              </Text>
            </Box>
          </Flex>
        </VStack>
      </Flex>
    </Box>
  );
};

export default Dashboard;


