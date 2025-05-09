import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import Register from "./components/Register";
import FinancialQuestions from "./components/financialQuestions";
import Dashboard from "./components/Dashboard";
import FiftyThirtyTwenty from "./components/FiftyThirtyTwenty";
import SettingsPage from "./components/SettingsPage.jsx";
import PayYourselfFirst from "./components/PayYourselfFirst.jsx";
import IntermedPYF from "./components/IntermedPYF.jsx";
import IntermedFTT from "./components/IntermedFTT.jsx";

//Cleaned Up Homepage
function App() {
  return (
          <Router>
              <Routes>
                  {/* Main Page */}
                  <Route path="/" element={<HomePage />} />
                  
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

                  {/* Pay Yourself First Page */}
                  <Route path="/budget-pay-yourself" element={<PayYourselfFirst />} />

                  {/* Settings Page*/}
                  <Route path="/settings" element={<SettingsPage />} />

                  {/* IntermedPYF Page*/}
                  <Route path="/IntermedPYF" element={<IntermedPYF />} />

                  {/* IntermedFTT Page*/}
                  <Route path="/IntermedFTT" element={<IntermedFTT />} />
              </Routes>
          </Router>
  );
}

export default App;

