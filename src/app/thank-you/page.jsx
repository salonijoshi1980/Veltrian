import { useNavigate } from "react-router-dom";
import Header from "@/app/components/Header";

export default function ThankYouPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="text-center bg-white rounded-xl shadow-md p-8 max-w-md w-full">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-amber-900 mb-4">Thank You!</h1>
          <p className="text-lg text-amber-700 mb-8">
            We'll keep you updated on Veltrain's progress.
          </p>

          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-amber-900 font-medium rounded-lg transition"
          >
            Back to Home
          </button>
        </div>
      </main>
    </div>
  );
}
