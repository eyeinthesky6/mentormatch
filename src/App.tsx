
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import BrowseMentorsPage from "./pages/BrowseMentorsPage";
import BookingPage from "./pages/BookingPage"; // ✅ Ensure correct import
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import Footer from "./components/Footer";

const App = () => {
    return (
        <Router>
            <div className="min-h-screen flex flex-col justify-between">
                <div className="flex-1">
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/mentors" element={<BrowseMentorsPage />} />
                        <Route path="/booking" element={<BookingPage />} />
                        <Route path="/payment" element={<PaymentPage />} />
                        <Route path="/payment-success" element={<PaymentSuccessPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
