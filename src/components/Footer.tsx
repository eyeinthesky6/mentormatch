
import React from "react";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-6 text-center">
            <p className="text-sm">&copy; 2025 MentorMatch. All rights reserved.</p>
            <div className="mt-2 flex justify-center space-x-4">
                <a href="/terms" className="hover:underline">Terms & Conditions</a>
                <a href="/privacy" className="hover:underline">Privacy Policy</a>
                <a href="/contact" className="hover:underline">Contact Us</a>
            </div>
        </footer>
    );
};

export default Footer;
