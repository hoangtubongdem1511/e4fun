import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DictionaryPage from "./pages/DictionaryPage";
import WritingPage from "./pages/WritingPage";
import ChatbotPage from "./pages/ChatbotPage";
import AssignmentPage from "./pages/AssignmentPage";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dictionary" element={<DictionaryPage />} />
          <Route path="/writing" element={<WritingPage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/assignment" element={<AssignmentPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;