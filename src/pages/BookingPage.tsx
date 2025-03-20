
import React from "react";

const BookingPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Book a Mentor</h1>
            <p className="mb-4">Choose your mentor and confirm your booking.</p>
            <button 
                className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md"
            >
                Proceed to Confirmation
            </button>
        </div>
    );
};

export default BookingPage; // ✅ Ensure default export is properly set
