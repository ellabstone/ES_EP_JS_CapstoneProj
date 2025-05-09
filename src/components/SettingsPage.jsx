//James
import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  Heading,
  Dialog,
  Portal,
  CloseButton,
  Flex,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Settings = () => {
  const [newName, setNewName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const updateField = async (field, value) => {
    try {
      await axios.patch(`https://eden-backend-eabf.onrender.com/api/users/${userId}`, {
        [field]: value,
      });
      setMessage(`${field} updated successfully!`);
    } catch (err) {
      setMessage("Update failed.");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`https://eden-backend-eabf.onrender.com/api/users/${userId}`);
      localStorage.removeItem("userId");
      navigate("/");
    } catch (err) {
      setMessage("Account deletion failed.");
    }
  };

  return (
    <Flex justify="center" align="center" mt={10}>
      <Box maxW="400px" width="100%" p={6}>
        <Heading mb={4}>Settings</Heading>
        <Text mb={8}>
          This is where you can change your display name, username, or password.
        </Text>

        <VStack spacing={4} align="stretch">
          <Input
            placeholder="Enter new name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Button onClick={() => updateField("name", newName)} colorPalette="teal">
            Save New Name
          </Button>

          <Input
            placeholder="Enter new username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
          <Button onClick={() => updateField("username", newUsername)} colorPalette="teal">
            Save New Username
          </Button>

          <Input
            placeholder="Enter new password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button onClick={() => updateField("password", newPassword)} colorPalette="teal">
            Save New Password
          </Button>
        </VStack>

        {message && <Text mt={4}>{message}</Text>}

        <VStack spacing={4} mt={10}>
          <Button width="100%" onClick={() => navigate("/dashboard")} colorScheme="blackAlpha">
            Back to Dashboard
          </Button>

          {/* DELETE ACCOUNT DIALOG */}
          <Dialog.Root role="alertdialog"
            placement = "center"
          >
            <Dialog.Trigger asChild>
              <Button width="100%" colorPalette="blackAlpha">
                Delete My Account
              </Button>
            </Dialog.Trigger>
            <Portal>
              <Dialog.Backdrop />
              <Dialog.Positioner>
                <Dialog.Content>
                  <Dialog.Header>
                    <Dialog.Title>Are you sure?</Dialog.Title>
                    <Dialog.CloseTrigger asChild>
                      <CloseButton size="sm" />
                    </Dialog.CloseTrigger>
                  </Dialog.Header>
                  <Dialog.Body>
                    <Text>
                      This action cannot be undone. This will permanently delete your
                      account and remove your data from our systems.
                    </Text>
                  </Dialog.Body>
                  <Dialog.Footer>
                    <Dialog.ActionTrigger asChild>
                      <Button variant="outline">Cancel</Button>
                    </Dialog.ActionTrigger>
                    <Button colorPalette="red" onClick={handleDelete}>
                      Delete
                    </Button>
                  </Dialog.Footer>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Settings;

