import { Navbar } from "../components/navbar";
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Navbar />
      <section className="flex flex-col-reverse lg:flex-row items-center justify-center px-6 py-20 bg-gradient-to-r from-blue-50 to-blue-100 text-center lg:text-left">
        <div className="lg:w-1/2">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Smarter Invoicing, Effortless Expense Tracking
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 mb-8">
            Manage your business finances with AI-powered automation, smart receipt scanning, and intuitive dashboards — all in one place.
          </p>
          <button
            onClick={handleLogin}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-lg hover:bg-blue-700 transition shadow-md"
          >
            Get Started
          </button>
        </div>

        <div className="lg:w-1/2 mb-10 lg:mb-0">
          <img
            src="/undraw_printing-invoices_osgs.svg"
            alt="Finance Illustration"
            className="w-full max-w-md mx-auto drop-shadow-xl"
          />
        </div>
      </section>

     
      <section id="features" className="py-16 px-8 bg-white">
        <h3 className="text-3xl font-bold text-center mb-12">Features</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto text-center">
          <div className="p-6 border rounded-xl shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-2 text-blue-600">Smart Invoicing</h4>
            <p>Create, send, and track invoices in just a few clicks with custom branding support.</p>
          </div>
          <div className="p-6 border rounded-xl shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-2 text-blue-600">AI Expense Categorization</h4>
            <p>Upload receipts and let AI extract and categorize the expenses for you.</p>
          </div>
          <div className="p-6 border rounded-xl shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-2 text-blue-600">Real-Time Dashboard</h4>
            <p>Visualize your income, expenses, and due invoices on an intuitive dashboard.</p>
          </div>
          <div className="p-6 border rounded-xl shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-2 text-blue-600">GST & Tax Support</h4>
            <p>Automatically calculate GST or other regional taxes in your invoices.</p>
          </div>
          <div className="p-6 border rounded-xl shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-2 text-blue-600">Secure Authentication</h4>
            <p>Login using email/password or Google OAuth with JWT-protected sessions.</p>
          </div>
          <div className="p-6 border rounded-xl shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-2 text-blue-600">Cloud Storage</h4>
            <p>Store and manage your invoices and receipts with secure cloud integration.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center bg-blue-50">
        <h3 className="text-2xl sm:text-3xl font-bold mb-4">
          Ready to take control of your business finances?
        </h3>
        <p className="text-gray-700 mb-6">
          Sign up now and experience the future of invoicing.
        </p>
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-lg hover:bg-blue-700 transition shadow-md"
        >
          Login to Get Started
        </button>
      </section>

      
      <footer id="contact" className="bg-blue-600 text-white py-6 text-center">
        <p>© {new Date().getFullYear()} InvoicelyAI. All rights reserved.</p>
        <p className="mt-2 text-sm">Contact: support@invoicely.com</p>
      </footer>
    </div>
  );
};

export { HomePage };
