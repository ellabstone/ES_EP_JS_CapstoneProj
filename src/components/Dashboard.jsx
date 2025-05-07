import React from "react";
import {
  Box,
  Heading,
  Text,
  Image,
  Button,
  Flex,
  VStack,
  Progress,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const Dashboard = () => {
  return (
    <Box p={8}>
      {/* Page Heading */}
      <Heading textAlign="center">Dashboard</Heading>
      <Text textAlign="center" fontStyle="italic" mb={10}>
        This is your central hub. You can explore different budgeting methods or manage your personal finances. Start by selecting a plan below or updating your numbers.
      </Text>

      {/* Split screen layout */}
      <Flex direction={{ base: "column", md: "row" }} gap={10}>
        {/* LEFT SIDE */}
        <VStack spacing={8} flex={1} align="stretch">
          {/* Goals Box */}
          <Box bg="white" p={5} shadow="md" borderRadius="md">
            <Heading size="md" mb={2}>Goals</Heading>
            <Text mb={2}>Summer Vacation</Text>
            <Text fontWeight="bold">39% reached</Text>
            <Progress.Root maxW="100%" height="10px" bg="gray.200" borderRadius="md" mb={2}>
              <Progress.Track>
                <Progress.Range style={{ width: "39%", backgroundColor: "#319795" }} />
              </Progress.Track>
            </Progress.Root>
            <Text>$1,485 out of $2,835</Text>
          </Box>

          {/* Spending Overview */}
          <Box bg="white" p={5} shadow="md" borderRadius="md">
            <Heading size="md" mb={4}>Spending Overview</Heading>

            <Flex justify="space-between"><Text>Groceries</Text><Text>39%</Text></Flex>
            <Progress.Root maxW="100%" height="10px" bg="gray.200" borderRadius="md">
              <Progress.Track>
                <Progress.Range style={{ width: "39%", backgroundColor: "#319795" }} />
              </Progress.Track>
            </Progress.Root>

            <Flex justify="space-between"><Text>Withdraw</Text><Text>20%</Text></Flex>
            <Progress.Root maxW="100%" height="10px" bg="gray.200" borderRadius="md" mb={3}>
              <Progress.Track>
                <Progress.Range style={{ width: "20%", backgroundColor: "#805AD5" }} />
              </Progress.Track>
            </Progress.Root>

            <Flex justify="space-between"><Text>Retail</Text><Text>10%</Text></Flex>
            <Progress.Root maxW="100%" height="10px" bg="gray.200" borderRadius="md" mb={3}>
              <Progress.Track>
                <Progress.Range style={{ width: "10%", backgroundColor: "#F6AD55" }} />
              </Progress.Track>
            </Progress.Root>

            <Flex justify="space-between"><Text>Leisure</Text><Text>2%</Text></Flex>
            <Progress.Root maxW="100%" height="10px" bg="gray.200" borderRadius="md">
              <Progress.Track>
                <Progress.Range style={{ width: "2%", backgroundColor: "#63B3ED" }} />
              </Progress.Track>
            </Progress.Root>
          </Box>
        </VStack>

        {/* RIGHT SIDE */}
        <VStack spacing={10} flex={2} align="stretch">
          {/* Budget Plan 1 */}
          <Flex gap={6} align="center" bg="white" p={4} borderRadius="md" shadow="sm">
            <Image src="/assets/money-bag.gif" boxSize="120px" objectFit="cover" />
            <Box>
              <Button as={RouterLink} to="/budget-503020" colorScheme="teal" mb={2}>
                50/30/20 Budget
              </Button>
              <Text>Spend 50% on needs, 30% on wants, and 20% on savings.</Text>
            </Box>
          </Flex>

          {/* Budget Plan 2 */}
          <Flex gap={6} align="center" bg="white" p={4} borderRadius="md" shadow="sm">
            <Image src="/assets/save-money.gif" boxSize="120px" objectFit="cover" />
            <Box>
              <Button as={RouterLink} to="/budget-pay-yourself" colorScheme="purple" mb={2}>
                Pay Yourself First
              </Button>
              <Text>Save before spending — prioritize long-term financial health.</Text>
            </Box>
          </Flex>

          {/* Budget Plan 3 */}
          <Flex gap={6} align="center" bg="white" p={4} borderRadius="md" shadow="sm">
            <Image src="/assets/presentation.gif" boxSize="120px" objectFit="cover" />
            <Box>
              <Button as={RouterLink} to="/budget-zero" colorScheme="orange" mb={2}>
                Zero-Based Budget
              </Button>
              <Text>Assign every dollar a role so your income equals expenses.</Text>
            </Box>
          </Flex>
        </VStack>
      </Flex>
    </Box>
  );
};

export default Dashboard;

