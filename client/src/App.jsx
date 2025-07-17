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
import { InvoicePage } from "./pages/InvoicePage";
import { ExpensePage } from "./pages/ExpensePage";
import { AIAnalysisPage } from "./pages/AIAnalysisPage";

const App = () => {
  const { appLoading, user } = useAppContext();

  const { isAuthenticated } = user;
  console.log("🟡 : App : isAuthenticated:", isAuthenticated);
  console.log("🟡 : App : isAuthenticated: final", !isAuthenticated);

  if (appLoading) {
    return (
      <div className="min-h-[100vh] flex flex-col items-center justify-center gap-10 content-center">
        <BounceLoader size="175" color="#2020ff" />
        <div className="border-1 border-lime-800 p-8 rounded-lg">
          <p>Please note:</p>
          <p>Backend is hosted on free server</p>
          <p>It may take upto 2 minutes to warmup (for the first time)!</p>
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
