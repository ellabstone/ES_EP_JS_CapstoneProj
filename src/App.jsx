import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container, Stack } from "@chakra-ui/react";
import Title from "./components/Title";
import Button from "./components/Button";
import Photos from "./components/Photos";
import About from "./components/About";
import Login from "./components/Login";
import Register from "./components/Register";

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
              </Routes>
          </Router>
  );
}

export default App;

