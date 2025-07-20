import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router";
import { useAppContext } from "./contexts/appContext";
import { BounceLoader } from "react-spinners";
import { SignupPage } from "./pages/SignupPage";
import { LoginPage } from "./pages/LoginPage";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProfilePage } from "./pages/ProfilePage";
import { DashboardPage } from "./pages/DashboardPage";
import { ExpensePage } from "./pages/ExpensePage";
import { AIAnalysisPage } from "./pages/AIAnalysisPage";
import InvoicePage from "./pages/InvoicePage";

const App = () => {
  const { appLoading, user } = useAppContext();

  const { isAuthenticated } = user;
  console.log("🟡 : App : isAuthenticated:", isAuthenticated);
  console.log("🟡 : App : isAuthenticated: final", !isAuthenticated);

  if (appLoading) {
    return (
      <div className="min-h-[100vh] flex flex-col items-center justify-center gap-10 bg-gradient-to-br from-blue-200 via-white to-blue-400 animate-fade-in">
        <div className="flex flex-col items-center justify-center gap-6">
          <BounceLoader size={175} color="#2020ff" />
          <div className="bg-white/90 border-2 border-emerald-400 shadow-lg p-8 rounded-2xl flex flex-col items-center max-w-md animate-pulse">
            <p className="text-lg font-bold text-emerald-700 mb-2 flex items-center gap-2">
              <svg className="w-6 h-6 text-emerald-500 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
              Please note:
            </p>
            <p className="text-base text-blue-800 font-medium">Backend is hosted on a free server</p>
            <p className="text-base text-gray-700">It may take up to <span className="font-semibold text-emerald-600">2 minutes</span> to warm up (for the first time)!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Only show Home, Login, Signup for unauthenticated users */}
        {!isAuthenticated ? (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="*" element={<HomePage />} />
          </>
        ) : (
          <>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/invoices" element={<InvoicePage />} />
            <Route path="/expenses" element={<ExpensePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/ai-analysis" element={<AIAnalysisPage />} />
            <Route path="*" element={<DashboardPage />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
