import React from "react";
import { VStack, Text, Input, Button } from "@chakra-ui/react";
//import { forwardRef, Icon } from '@chakra-ui/react';
//import { AddIcon, DeleteIcon } from "@chakra-ui/icons";



const FinancialQuestions = () => {
    return (
        <VStack spacing={4} p={5}>
            <Text fontSize="xl">Tell us about your finances</Text>
            <Input placeholder="What is your monthly income?" />
            <Input placeholder="What are your main expenses?" />
            <Input placeholder="How much do you save each month?" />
            <Button >Submit</Button>
        </VStack>
    );
};

export default FinancialQuestions;

