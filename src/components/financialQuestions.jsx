//ella UI James API

import React, { useState } from "react";
import {
  VStack,
  Text,
  Input,
  Button,
  HStack,
  Box,
  Menu,
  Portal
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

//Prepare Primary Income for API
const FinancialQuestions = () => {
  const [primaryIncome, setPrimaryIncome] = useState({
    title: "Primary Income",
    amount: "",
    frequency: ""
  });
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const navigate = useNavigate();

  const handlePrimaryChange = (e) => {
    setPrimaryIncome({
      ...primaryIncome,
      [e.target.name]: e.target.value,
      title: "Primary Income" // re-hardcode
    });
  };

  const handleFrequencyChange = (frequency) => {
    setPrimaryIncome({ ...primaryIncome, frequency });
  };

  const addIncomeInput = () => {
    setIncomes([
      ...incomes,
      { title: "", amount: "", frequency: "" }
    ]);
  };

  const addExpenseInput = () => {
    setExpenses([
      ...expenses,
      { title: "", amount: "", frequency: "" }
    ]);
  };

  const deleteLastIncome = () => {
    setIncomes(incomes.slice(0, -1));
  };

  const deleteLastExpense = () => {
    setExpenses(expenses.slice(0, -1));
  };

  const handleNavigate = async () => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    console.error("No user ID found in localStorage");
    return;
  }

  try {
    // Primary income
    const primaryPayload = {
      title: primaryIncome.title,
      amount: parseFloat(primaryIncome.amount),
      frequency: primaryIncome.frequency.toLowerCase(),
    };
    await axios.post(`https://eden-backend-eabf.onrender.com/api/users/${userId}/initial-incomes`, primaryPayload);
    console.log("Primary income submitted");

    // Additional incomes
    for (let income of incomes) {
      const incomePayload = {
        title: income.title,
        amount: parseFloat(income.amount),
        frequency: income.frequency.toLowerCase(),
      };
      await axios.post(`https://eden-backend-eabf.onrender.com/api/users/${userId}/initial-incomes`, incomePayload);
      console.log("Income submitted:", incomePayload);
    }

    // Expenses
    for (let expense of expenses) {
      const expensePayload = {
        title: expense.title,
        amount: parseFloat(expense.amount),
        frequency: expense.frequency.toLowerCase(),
      };
      await axios.post(`https://eden-backend-eabf.onrender.com/api/users/${userId}/initial-expenses`, expensePayload);
      console.log("Expense submitted:", expensePayload);
    }
    
    navigate("/dashboard/");
  } catch (error) {
    console.error("Error submitting incomes:", error.response?.data || error.message);
  }
};

  return (
    <VStack spacing={4} p={5} align="stretch">
      <Text fontSize="xl">Tell us about your finances</Text>

      <Text>Primary Salary:</Text>
      <HStack spacing={4}>
        <Input
          placeholder="What is your income?"
          name="amount"
          type="number"
          value={primaryIncome.amount}
          onChange={handlePrimaryChange}
        />

        <Menu.Root>
          <Menu.Trigger asChild>
            <Button variant="outline" size="sm">
              {primaryIncome.frequency || "Select Frequency"}
            </Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                {["Weekly", "Biweekly", "Monthly", "Yearly"].map((option) => (
                  <Menu.Item key={option} onClick={() => handleFrequencyChange(option)}>
                    {option}
                  </Menu.Item>
                ))}
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </HStack>

      <HStack align="start" spacing={10}>
        <Box flex={1}>
          <Text fontSize="lg">Incomes</Text>
          {incomes.map((income, index) => (
            <HStack key={index} mt={2} spacing={4}>
              <Input
                placeholder={`Income ${index + 1}`}
                value={income.title}
                onChange={(e) => {
                  const updated = [...incomes];
                  updated[index].title = e.target.value;
                  setIncomes(updated);
                }}
              />
              <Input
                placeholder="Amount"
                type="number"
                value={income.amount}
                onChange={(e) => {
                  const updated = [...incomes];
                  updated[index].amount = e.target.value;
                  setIncomes(updated);
                }}
              />
              <Menu.Root>
                <Menu.Trigger asChild>
                  <Button variant="outline" size="sm">
                    {income.frequency || "Select Frequency"}
                  </Button>
                </Menu.Trigger>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content>
                      {["Weekly", "Biweekly", "Monthly", "Yearly"].map((option) => (
                        <Menu.Item
                          key={option}
                          onClick={() => {
                            const updated = [...incomes];
                            updated[index].frequency = option;
                            setIncomes(updated);
                          }}
                        >
                          {option}
                        </Menu.Item>
                      ))}
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
            </HStack>
          ))}

          <HStack mt={2}>
            <Button colorScheme="blue" onClick={addIncomeInput}>
              Add Income
            </Button>
            <Button colorScheme="red" onClick={deleteLastIncome}>
              Delete
            </Button>
          </HStack>
        </Box>

        <Box flex={1}>
          <Text fontSize="lg">Expenses</Text>
          {expenses.map((expense, index) => (
            <HStack key={index} mt={2} spacing={4}>
              <Input
                placeholder={`Expense ${index + 1}`}
                value={expense.title}
                onChange={(e) => {
                  const updated = [...expenses];
                  updated[index].title = e.target.value;
                  setExpenses(updated);
                }}
              />
              <Input
                placeholder="Amount"
                type="number"
                value={expense.amount}
                onChange={(e) => {
                  const updated = [...expenses];
                  updated[index].amount = e.target.value;
                  setExpenses(updated);
                }}
              />
              <Menu.Root>
                <Menu.Trigger asChild>
                  <Button variant="outline" size="sm">
                    {expense.frequency || "Select Frequency"}
                  </Button>
                </Menu.Trigger>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content>
                      {["Weekly", "Biweekly", "Monthly", "Yearly"].map((option) => (
                        <Menu.Item
                          key={option}
                          onClick={() => {
                            const updated = [...expenses];
                            updated[index].frequency = option;
                            setExpenses(updated);
                          }}
                        >
                          {option}
                        </Menu.Item>
                      ))}
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
            </HStack>
          ))}

          <HStack mt={2}>
            <Button colorScheme="blue" onClick={addExpenseInput}>
              Add Expense
            </Button>
            <Button colorScheme="red" onClick={deleteLastExpense}>
              Delete
            </Button>
          </HStack>
        </Box>
      </HStack>

      <Button colorScheme="green" onClick={handleNavigate} mt={4}>
        Submit
      </Button>
    </VStack>
  );
};

export default FinancialQuestions;