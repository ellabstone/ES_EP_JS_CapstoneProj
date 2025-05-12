//Ella UI James API
import React, { useEffect, useState } from "react";
import {
  VStack,
  Text,
  Box,
  Input,
  Button,
  HStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const IntermedFTT = () => {
  const [expenses, setExpenses] = useState([]);
  const [customTitle, setCustomTitle] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [customFrequency, setCustomFrequency] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [budgetId, setBudgetId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    axios
      .get(`https://eden-backend-eabf.onrender.com/api/users/${userId}/budgets`)
      .then((res) => {
        const latestBudget = res.data[res.data.length - 1];
        setBudgetId(latestBudget.id);
        setExpenses(
          latestBudget.expenses.map((item) => ({
            ...item,
            category: item.category_name || "",
            isCustom: false,
          }))
        );
      })
      .catch((err) => {
        console.error("Failed to fetch budget:", err);
      });
  }, []);

  const updateExpense = (index, key, value) => {
    const updated = [...expenses];
    updated[index][key] = value;
    setExpenses(updated);
  };

  const deleteExpense = async (id, isCustom) => {
    if (!isCustom && budgetId) {
      try {
        await axios.delete(
          `https://eden-backend-eabf.onrender.com/api/budgets/${budgetId}/budget-expenses/${id}`
        );
      } catch (error) {
        console.error("Failed to delete expense from backend:", error);
        return;
      }
    }
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const addCustomExpense = () => {
    if (!customTitle || !customAmount || !customFrequency || !customCategory) return;
    const newItem = {
      id: Date.now(),
      title: customTitle,
      amount: parseFloat(customAmount),
      frequency: customFrequency,
      category: customCategory,
      isCustom: true,
    };
    setExpenses([...expenses, newItem]);
    setCustomTitle("");
    setCustomAmount("");
    setCustomFrequency("");
    setCustomCategory("");
  };

  const handleCreateBudget = async () => {
    if (!budgetId) return;

    const promises = expenses.map((item) => {
      const payload = {
        title: item.title,
        amount: item.amount,
        frequency: item.frequency.toLowerCase(),
        category_type: item.category,
      };

      if (item.isCustom) {
        return axios.post(
          `https://eden-backend-eabf.onrender.com/api/budgets/${budgetId}/budget-expenses`,
          payload
        );
      } else {
        return axios.patch(
          `https://eden-backend-eabf.onrender.com/api/budgets/${budgetId}/budget-expenses/${item.id}`,
          payload
        );
      }
    });

    try {
      await Promise.all(promises);
      navigate("/budget-503020");
    } catch (err) {
      console.error("❌ Failed to submit budget:", err);
    }
  };

  return (
    <VStack spacing={6} align="stretch" p={6}>
      <Text fontSize="4xl" fontWeight="bold">
        50/30/20 Budget
      </Text>
      <Button colorScheme="teal" onClick={handleCreateBudget}>
        Create Budget
      </Button>

      <Text fontSize="xl">Review and Categorize Your Expenses:</Text>
      <Box borderWidth="1px" borderRadius="md" p={4} bg="white">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "8px" }}>Title</th>
              <th style={{ textAlign: "left", padding: "8px" }}>Amount</th>
              <th style={{ textAlign: "left", padding: "8px" }}>Frequency</th>
              <th style={{ textAlign: "left", padding: "8px" }}>Category</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((item, index) => (
              <tr key={item.id}>
                <td style={{ padding: "8px" }}>{item.title}</td>
                <td style={{ padding: "8px" }}>${item.amount}</td>
                <td style={{ padding: "8px" }}>{item.frequency}</td>
                <td style={{ padding: "8px" }}>
                  <select
                    value={item.category}
                    onChange={(e) => updateExpense(index, "category", e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="Needs">Needs</option>
                    <option value="Wants">Wants</option>
                    <option value="Savings">Savings</option>
                  </select>
                </td>
                <td style={{ padding: "8px" }}>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => deleteExpense(item.id, item.isCustom)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>

      <Box mt={6}>
        <Text fontSize="lg" mb={2}>
          Add Custom Expense
        </Text>
        <HStack spacing={3} mb={2}>
          <Input
            placeholder="Title"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
          />
          <Input
            placeholder="Amount"
            type="number"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
          />
          <select value={customFrequency} onChange={(e) => setCustomFrequency(e.target.value)}>
            <option value="">Frequency</option>
            <option value="Weekly">Weekly</option>
            <option value="Biweekly">Biweekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
          <select value={customCategory} onChange={(e) => setCustomCategory(e.target.value)}>
            <option value="">Category</option>
            <option value="Needs">Needs</option>
            <option value="Wants">Wants</option>
            <option value="Savings">Savings</option>
          </select>
          <Button colorScheme="blue" onClick={addCustomExpense}>
            Add
          </Button>
        </HStack>
      </Box>
    </VStack>
  );
};

export default IntermedFTT;










