import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ChatPage from "./pages/ChatPage";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import SomethingWentWrong from "./pages/SomethingWentWrong";

const AppRouter: React.FC = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/error" element={<SomethingWentWrong />} />
        </Routes>
    </Router>
);

export default AppRouter;