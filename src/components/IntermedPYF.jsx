// Ella
import React, { useState, useEffect } from "react";
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

const IntermedPYF = () => {
  const [expenses, setExpenses] = useState([]);
  const [newExpenseTitle, setNewExpenseTitle] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [tempCategory, setTempCategory] = useState("");
  const [tempPriority, setTempPriority] = useState("");
  const [tempAllocated, setTempAllocated] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    const userId = storedId ? parseInt(storedId, 10) : null;

    if (!userId || isNaN(userId)) {
      navigate("/");
      return;
    }

    axios
      .get(`https://eden-backend-eabf.onrender.com/api/users/${userId}/initial-expenses`)
      .then((res) => {
        console.log("Fetched expenses:", res.data);
        setExpenses(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch expenses:", err);
      });
  }, [navigate]);

  const handleAddExpense = () => {
    if (!newExpenseTitle || isNaN(parseFloat(newExpenseAmount))) return;
    const newExpense = {
      id: Date.now(),
      title: newExpenseTitle,
      amount: parseFloat(newExpenseAmount),
    };
    setExpenses([...expenses, newExpense]);
    setNewExpenseTitle("");
    setNewExpenseAmount("");
    setShowExpenseForm(false);
  };

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
  };

  const handleSaveEdit = async (index) => {
    const updated = [...expenses];
    const exp = updated[index];
    exp.category = tempCategory;
    exp.priority = parseInt(tempPriority) || null;
    exp.allocatedAmount = parseInt(tempAllocated) || null;

    setExpenses(updated);
    setEditIndex(null);
    setTempCategory("");
    setTempPriority("");
    setTempAllocated("");

    // Save changes to backend
    try {
      await axios.patch(
        `https://eden-backend-eabf.onrender.com/api/budget-expenses/${exp.id}`,
        {
          category_name: exp.category,
          priority: exp.priority,
          allocated_amount: exp.allocatedAmount,
        }
      );
    } catch (err) {
      console.error("❌ Failed to update expense:", err);
    }
  };

  return (
    <VStack spacing={6} align="stretch" p={6}>
      <Text fontSize="4xl" fontWeight="bold">Pay Yourself First Budget</Text>
      <Button colorScheme="teal" onClick={() => navigate("/budget-pay-yourself")}>Create Budget</Button>

      <HStack justify="space-between">
        <Text fontSize="xl">Expenses:</Text>
        <Button onClick={() => setShowExpenseForm(true)}>Add New Expense</Button>
      </HStack>

      {showExpenseForm && (
        <Box p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
          <Input
            placeholder="Title"
            value={newExpenseTitle}
            onChange={(e) => setNewExpenseTitle(e.target.value)}
            mb={2}
          />
          <Input
            placeholder="Amount"
            type="number"
            value={newExpenseAmount}
            onChange={(e) => setNewExpenseAmount(e.target.value)}
            mb={2}
          />
          <Button colorScheme="green" size="sm" onClick={handleAddExpense}>Submit</Button>
        </Box>
      )}

      <Box borderWidth="1px" borderRadius="md" p={4} bg="white">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ccc" }}>Title</th>
              <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ccc" }}>Amount</th>
              <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ccc" }}>Category</th>
              <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ccc" }}>Priority</th>
              <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ccc" }}>Allocated Amount</th>
              <th style={{ padding: "8px", borderBottom: "1px solid #ccc" }}></th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((item, index) => (
              <tr key={item.id}>
                <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{item.title}</td>
                <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>${item.amount}</td>
                <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                  {editIndex === index ? (
                    <Input
                      size="sm"
                      value={tempCategory}
                      onChange={(e) => setTempCategory(e.target.value)}
                    />
                  ) : (
                    item.category || "-"
                  )}
                </td>
                <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                  {editIndex === index ? (
                    <Input
                      size="sm"
                      type="number"
                      value={tempPriority}
                      onChange={(e) => setTempPriority(e.target.value)}
                    />
                  ) : (
                    item.priority ?? "-"
                  )}
                </td>
                <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                  {editIndex === index ? (
                    <Input
                      size="sm"
                      type="number"
                      value={tempAllocated}
                      onChange={(e) => setTempAllocated(e.target.value)}
                    />
                  ) : (
                    item.allocatedAmount ?? "-"
                  )}
                </td>
                <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                  {editIndex === index ? (
                    <Button size="sm" colorScheme="green" onClick={() => handleSaveEdit(index)}>Save</Button>
                  ) : (
                    <HStack>
                      <Button
                        size="sm"
                        onClick={() => {
                          setEditIndex(index);
                          setTempCategory(item.category || "");
                          setTempPriority(item.priority || "");
                          setTempAllocated(item.allocatedAmount || "");
                        }}
                      >Edit</Button>
                      <Button size="sm" colorScheme="red" onClick={() => handleDeleteExpense(item.id)}>Delete</Button>
                    </HStack>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </VStack>
  );
};

export default IntermedPYF;