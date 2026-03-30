import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import DictionaryPage from "@/pages/DictionaryPage";
import WritingPage from "@/pages/WritingPage";
import ChatbotPage from "@/pages/ChatbotPage";
import AssignmentPage from "@/pages/AssignmentPage";
import MatchingPage from "@/pages/MatchingPage";
import Layout from "@/components/common/Layout";

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
          <Route path="/matching" element={<MatchingPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
