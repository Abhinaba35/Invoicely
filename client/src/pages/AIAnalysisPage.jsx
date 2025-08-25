
import React, { useState } from "react";
import { Navbar } from "../components/navbar";
import ClipLoader from "../components/ClipLoader";
import { axiosInstance } from "../axios/axiosInstance";

const AIAnalysisPage = () => {
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalysis = async () => {
    setLoading(true);
    setError("");
    setAnalysis("");
    try {
      const response = await axiosInstance.post("/analysis/rag");
      if (response.data && response.data.analysis) {
        setAnalysis(response.data.analysis);
      } else {
        setError("No analysis result returned.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Error fetching analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[90vh] w-full">
        <div className="flex flex-col items-center justify-center bg-white/80 rounded-2xl shadow-lg border border-blue-100 max-w-4xl w-full p-12">
          <h1 className="text-3xl font-bold text-blue-600 mb-6">AI Financial Analysis</h1>
          <button
            onClick={handleAnalysis}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out disabled:bg-blue-300"
          >
            {loading ? <ClipLoader size={20} color="#fff" /> : "Analyze My Finances"}
          </button>
          {error && (
            <div className="mt-6 text-red-600 font-semibold">{error}</div>
          )}
          {analysis && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-inner">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Analysis Result:</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{analysis}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { AIAnalysisPage };
