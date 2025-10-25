import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/utils/clerkAuth";
import { SignInButton } from "@clerk/clerk-react";
import Header from "@/app/components/Header";

export default function HomePage() {
  const { isLoaded, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const openEmailModal = () => {
    setShowEmailModal(true);
  };

  const closeEmailModal = () => {
    setShowEmailModal(false);
    setEmail("");
    setSubmitMessage("");
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    setTimeout(() => {
      console.log("Email submitted:", email);
      let emailList = JSON.parse(localStorage.getItem("veltrain_emails") || "[]");
      if (!emailList.includes(email)) {
        emailList.push(email);
        localStorage.setItem("veltrain_emails", JSON.stringify(emailList));
      }
      setIsSubmitting(false);
      setSubmitMessage("Thank you for your interest! We'll keep you updated on Veltrian's progress.");

      setTimeout(() => {
        closeEmailModal();
        navigate("/thank-you");
      }, 2000);
    }, 1000);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            Your private file intelligence workspace
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-10 leading-relaxed px-2">
            Organize, visualize, and share your files with cloud-like intelligence while keeping everything 100% private on your device.
          </p>

          {/* Email Input Section */}
          <div className="max-w-md mx-auto mb-16 w-full">
            <div className="flex flex-col sm:flex-row shadow-lg rounded-lg overflow-hidden">
              <input
                type="email"
                placeholder="Enter your email..."
                className="flex-1 px-6 py-4 text-gray-700 focus:outline-none w-full sm:w-auto"
                onClick={openEmailModal}
              />
              <button
                onClick={openEmailModal}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors w-full sm:w-auto"
              >
                Get started now
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              By entering your email, you agree to receive updates from Veltrian.
            </p>
          </div>

          {/* How It Works Section */}
          <div className="bg-white rounded-xl shadow-md p-8 sm:p-10 md:p-12 max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {/* Upload Files */}
              <div className="text-center p-4 hover:scale-105 transition-transform duration-200">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Upload Files
                </h3>
                <p className="text-gray-700 text-sm sm:text-base">
                  Securely upload any type of file with client-side encryption
                </p>
              </div>

              {/* Encrypted Storage */}
              <div className="text-center p-4 hover:scale-105 transition-transform duration-200">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Encrypted Storage
                </h3>
                <p className="text-gray-700 text-sm sm:text-base">
                  All files are encrypted locally before being stored in your browser
                </p>
              </div>

              {/* Private Access */}
              <div className="text-center p-4 hover:scale-105 transition-transform duration-200">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Private Access
                </h3>
                <p className="text-gray-700 text-sm sm:text-base">
                  Access your files anytime, anywhere, without relying on cloud services
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-gray-700">
          <p>© {new Date().getFullYear()} Veltrian. All rights reserved.</p>
          <p className="mt-2 text-sm text-gray-600">
            Privacy-First File Management
          </p>
        </div>
      </footer>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={closeEmailModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              Stay Updated
            </h3>
            <p className="text-gray-700 mb-6 text-center">
              Join our mailing list to receive updates about Veltrian's progress.
            </p>

            {submitMessage ? (
              <div className="text-center py-4">
                <p className="text-gray-700">{submitMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit}>
                <div className="mb-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Subscribe"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
