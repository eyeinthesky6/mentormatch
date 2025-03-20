
import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentPage = () => {
    const navigate = useNavigate();

    const handleFakePayment = () => {
        setTimeout(() => {
            navigate("/payment-success");
        }, 1000); // Simulate processing delay
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Confirm Your Booking</h1>
            <p className="mb-4">Click below to confirm your mentor session.</p>
            <button 
                onClick={handleFakePayment} 
                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md"
            >
                Confirm Booking
            </button>
        </div>
    );
};

export default PaymentPage;
