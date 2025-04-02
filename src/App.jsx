import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container, Stack } from "@chakra-ui/react";
import Title from "./components/Title";
import Button from "./components/Button";
import Photos from "./components/Photos";
import About from "./components/About";
import Login from "./components/Login";
import Register from "./components/Register";
import FinancialQuestions from "./components/financialQuestions";
import Dashboard from "./components/Dashboard";
import FiftyThirtyTwenty from "./components/FiftyThirtyTwenty";

function App() {
  return (
          <Router>
              <Routes>
                  {/* Main Page */}
                  <Route 
                      path="/" 
                      element={
                          <Stack minH={"100vh"} maxH={"1200px"} bg="blue.300">
                              <Title />
                              <Button />
                              <Photos />
                              <About />
                              <Container maxW={"1200px"} my={4}></Container>
                          </Stack>
                      } 
                  />
                  
                  {/* Login Page */}
                  <Route path="/login" element={<Login />} />
                  
                  {/* Register Page */}
                  <Route path="/register" element={<Register />} />

                  {/* Financial Questions Page (after registration) */}
                  <Route path="/financialQuestions" element={<FinancialQuestions />} />

                  {/* Dashboard Page */}
                  <Route path="/dashboard" element={<Dashboard />} />
                  
                  {/* 50/30/20 Page */}
                  <Route path="/budget-503020" element={<FiftyThirtyTwenty />} />
              </Routes>
          </Router>
  );
}

export default App;

