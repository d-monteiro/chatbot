import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

import Index from "./pages/Index";
import ChatPage from "./pages/ChatPage";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import SomethingWentWrong from "./pages/SomethingWentWrong";
import Login from "./pages/Login";
import Register from "./pages/Register";

const AppRouter: React.FC = () => (
    <Router>
        <AuthProvider>
            <Routes>
                <Route element={<ProtectedRoute />}>
                    
                </Route>
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/error" element={<SomethingWentWrong />} />
                    <Route path="*" element={<NotFound />} />
            </Routes>
        </AuthProvider>
    </Router>
);

export default AppRouter;