import React from "react";
import { Navbar } from "../components/navbar";

const AIAnalysisPage = () => {
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-white to-blue-200">
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-[90vh] w-full">
                <div className="flex flex-col items-center justify-center bg-white/80 rounded-2xl shadow-lg border border-blue-100 max-w-lg w-full p-12">
                    <span className="text-2xl text-blue-500 font-semibold mb-2">Coming soon...</span>
                </div>
            </div>
        </div>
    );
};

export { AIAnalysisPage };
