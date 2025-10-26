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
<<<<<<< HEAD
  const [isVisible, setIsVisible] = useState(false);
  const [activeUsers] = useState(12500);

  const stats = [
    { number: "100%", label: "Private" },
    { number: "0", label: "Servers" },
    { number: "∞", label: "Storage" },
    { number: "256-bit", label: "Encryption" }
  ];

  useEffect(() => setIsVisible(true), []);

  const openEmailModal = () => setShowEmailModal(true);
=======

  useEffect(() => {
    if (isLoaded) {
      if (isAuthenticated) {
        navigate("/app", { replace: true });
      }
    }
  }, [isLoaded, isAuthenticated, navigate]);

  const openEmailModal = () => {
    setShowEmailModal(true);
  };

>>>>>>> ef34e2aceec70c9fb72b58810f1b5e7647a4d5ac
  const closeEmailModal = () => {
    setShowEmailModal(false);
    setEmail("");
    setSubmitMessage("");
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
<<<<<<< HEAD
    setTimeout(() => {
      console.log("Email submitted:", email);
      let emailList = JSON.parse(localStorage.getItem("veltrain_emails") || "[]");
=======

    // Simulate form submission
    setTimeout(() => {
      // In a real application, you would send this to your backend
      console.log("Email submitted:", email);

      // Save to localStorage for persistence
      let emailList = JSON.parse(
        localStorage.getItem("veltrain_emails") || "[]"
      );
>>>>>>> ef34e2aceec70c9fb72b58810f1b5e7647a4d5ac
      if (!emailList.includes(email)) {
        emailList.push(email);
        localStorage.setItem("veltrain_emails", JSON.stringify(emailList));
      }
<<<<<<< HEAD
      setIsSubmitting(false);
      setSubmitMessage("Thank you for your interest! We'll keep you updated on Veltrian's progress.");
=======

      setIsSubmitting(false);
      setSubmitMessage(
        "Thank you for your interest! We'll keep you updated on Veltrain's progress."
      );

      // Redirect to thank you page after 2 seconds
>>>>>>> ef34e2aceec70c9fb72b58810f1b5e7647a4d5ac
      setTimeout(() => {
        closeEmailModal();
        navigate("/thank-you");
      }, 2000);
    }, 1000);
  };

  if (!isLoaded) {
    return (
<<<<<<< HEAD
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
=======
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
>>>>>>> ef34e2aceec70c9fb72b58810f1b5e7647a4d5ac
        </div>
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Navigation */}
      <nav className="w-full bg-transparent fixed md:static top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-3 flex justify-between items-center">
          {/* Logo */}
          {/* Logo */}
<div className="flex items-center">
  <img
    src="/Dragon logo1.png"
    alt="Veltrian Logo"
    className="w-14 h-12 md:w-20 md:h-16 object-contain"
  />
  <span className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent ">
    eltrian
  </span>
</div>


          {/* Button */}
          <button
            onClick={() => navigate("/app")}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 md:px-6 py-2 rounded-lg font-medium text-sm md:text-base hover:shadow-lg transition-shadow"
          >
            Start Exploring
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-6 sm:px-10 mt-20 md:mt-10">
        <div
          className={`transition-all duration-1000 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-800 mb-4 sm:mb-6">
            Your Private Cloud, Your
            <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mt-1">
              Intelligence Workspace
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 font-semibold mb-6 sm:mb-10 max-w-2xl mx-auto">
            No cloud. No servers. No data leaks. Just you and your files.
            <br className="hidden sm:block" />
            Upload, Organize, and Store everything 100% privately.
          </p>
        </div>

        {/* Email Input */}
       <div
  className={`w-full max-w-md transition-all duration-1000 delay-300 transform ${
    isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
  }`}
>
  <div className="flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm focus-within:ring-2 focus-within:ring-purple-500">
    <input
      type="email"
      placeholder="Enter your email..."
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="flex-1 px-4 py-3 text-slate-700 focus:outline-none text-sm sm:text-base"
    />
    <button
      onClick={openEmailModal}
      className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-5 py-3 font-semibold hover:shadow-lg transition-shadow rounded-b-2xl sm:rounded-b-none sm:rounded-r-2xl mt-3 sm:mt-0"
    >
      Get Started
    </button>
  </div>
  <p className="text-slate-500 text-xs sm:text-sm mt-3">
    By entering your email, you agree to receive updates from Veltrian.
  </p>
</div>


        {/* Stats Section */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-10 sm:mt-16 w-full max-w-4xl">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200 transition-all duration-500 transform ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
            >
              <div className="text-xl sm:text-2xl font-bold text-slate-800 mb-1 sm:mb-2">
                {stat.number}
              </div>
              <div className="text-slate-600 text-xs sm:text-sm font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-16">
        <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-200">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-8 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: "Upload Files",
                desc: "Securely upload any type of file with client-side encryption.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                )
              },
              {
                title: "Encrypted Storage",
                desc: "All files are encrypted locally before being stored.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                )
              },
              {
                title: "Private Access",
                desc: "Access your files anytime without relying on cloud services.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                )
              }
            ].map((step, i) => (
              <div key={i} className="text-center p-4 sm:p-6 hover:scale-105 transition-transform">
                <div className="bg-blue-100 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600"
=======
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-6">
            Cloudless File Management
          </h1>
          <p className="text-xl text-amber-700 max-w-3xl mx-auto mb-10">
            A privacy-first file manager where your data stays local in your
            browser. No servers. No clouds. No compromises. Every byte remains
            in your domain.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <SignInButton mode="modal">
              <button className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-amber-900 font-medium rounded-lg transition shadow-md hover:shadow-lg">
                Get Started
              </button>
            </SignInButton>
            <button
              onClick={openEmailModal}
              className="px-8 py-3 bg-amber-100 hover:bg-amber-200 text-amber-900 font-medium rounded-lg transition border border-amber-300"
            >
              Stay Updated
            </button>
            <a
              href="https://github.com/salonijoshi1980/Veltrian"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-amber-100 hover:bg-amber-200 text-amber-900 font-medium rounded-lg transition border border-amber-300 flex items-center justify-center"
            >
              Contributing
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-amber-600"
>>>>>>> ef34e2aceec70c9fb72b58810f1b5e7647a4d5ac
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
<<<<<<< HEAD
                    {step.icon}
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-700 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 sm:py-8 text-center text-slate-600 text-sm sm:text-base">
        © {new Date().getFullYear()} Veltrian. Your privacy, our promise.
=======
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-amber-900 mb-2">
                  Upload Files
                </h3>
                <p className="text-amber-700">
                  Securely upload any type of file with client-side encryption
                </p>
              </div>
              <div className="text-center">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-amber-900 mb-2">
                  Encrypted Storage
                </h3>
                <p className="text-amber-700">
                  All files are encrypted locally before being stored in your
                  browser
                </p>
              </div>
              <div className="text-center">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-amber-900 mb-2">
                  Private Access
                </h3>
                <p className="text-amber-700">
                  Access your files anytime, anywhere, without relying on cloud
                  services
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-amber-200 mt-12">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-amber-700">
            <p>© {new Date().getFullYear()} Veltrain. All rights reserved.</p>
            <p className="mt-2 text-sm text-amber-600">
              Privacy-First File Management
            </p>
          </div>
        </div>
>>>>>>> ef34e2aceec70c9fb72b58810f1b5e7647a4d5ac
      </footer>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
<<<<<<< HEAD
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={closeEmailModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            >
              ✖
            </button>

            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 text-center">
              Stay Updated
            </h3>
            <p className="text-gray-700 mb-6 text-center text-sm sm:text-base">
              Join our mailing list to receive updates about Veltrian.
            </p>

            {submitMessage ? (
              <div className="text-center py-4 text-gray-700">{submitMessage}</div>
            ) : (
              <form onSubmit={handleEmailSubmit}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none mb-4 text-sm sm:text-base"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium rounded-lg transition disabled:opacity-50 text-sm sm:text-base"
=======
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={closeEmailModal}
              className="absolute top-4 right-4 text-amber-600 hover:text-amber-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h3 className="text-2xl font-bold text-amber-900 mb-2">
              Stay Updated
            </h3>
            <p className="text-amber-700 mb-6">
              Join our mailing list to receive updates about Veltrain's
              progress.
            </p>

            {submitMessage ? (
              <div className="text-center py-4">
                <p className="text-amber-700">{submitMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit}>
                <div className="mb-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-amber-900 font-medium rounded-lg transition disabled:opacity-50"
>>>>>>> ef34e2aceec70c9fb72b58810f1b5e7647a4d5ac
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
