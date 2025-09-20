import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import Homepage from "./Homepage";
import Loginpage from "./pages/Loginpage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/login" element={<Loginpage />} />
      </Routes>
    </Router>
  );
}

export default App;
