import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";


export default function HomePage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [contributors, setContributors] = useState([]);
  const submitTimeoutRef = useRef(null);

  const stats = [
    { number: "100%", label: "Private" },
    { number: "0", label: "Servers" },
    { number: "∞", label: "Storage" },
    { number: "256-bit", label: "Encryption" }
  ];

  const features = [
    {
      title: "Limitless Data Storage",
      desc: "Store unlimited files without worrying about storage limits or quotas.",
      icon: "🗄️"
    },
    {
      title: "User Friendly Interface",
      desc: "No setup needed, no tokens, no complexity. Just upload and go.",
      icon: "✨"
    },
    {
      title: "100% Privacy First",
      desc: "Your files never leave your device. Everything stays local and encrypted.",
      icon: "🔒"
    },
    {
      title: "Zero Cloud Dependency",
      desc: "No servers, no third parties, no data breaches. Complete independence.",
      icon: "☁️"
    }
  ];

  const surveyInsights = [
    { percentage: "80%", text: "Want private, secure file storage without cloud dependency" },
    { percentage: "65%", text: "Prefer no login or minimal setup experience" },
    { percentage: "70%", text: "Would share if it's fast and accessible" }
  ];

  useEffect(() => {
    setIsVisible(true);
    fetchContributors();
  }, []);

  const fetchContributors = async () => {
    try {
      const response = await fetch('https://api.github.com/repos/salonijoshi1980/Veltrian/contributors');
      const data = await response.json();
      setContributors(data.slice(0, 12));
    } catch (error) {
      console.error('Error fetching contributors:', error);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    const formData = new FormData(e.target);
    
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      });
      
      setSubmitMessage("Thank you! We'll keep you updated on Veltrian's progress.");
      setEmail("");

      submitTimeoutRef.current = setTimeout(() => {
        setSubmitMessage("");
        setIsSubmitting(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting email:', error);
      setSubmitMessage("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-blue-50">
      <nav className="w-full bg-white/80 backdrop-blur-md fixed top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-1">
            <img src="/Dragon logo1.png" alt="Veltrian Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
            <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Veltrian</span>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <a href="https://forms.gle/your-survey-link" target="_blank" rel="noopener noreferrer" className="text-sm md:text-base text-slate-600 hover:text-purple-600 font-medium transition">Survey</a>
            <a href="https://github.com/salonijoshi1980/Veltrian" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-sm md:text-base text-slate-600 hover:text-purple-600 font-medium transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              <span className="hidden md:inline">GitHub</span>
            </a>
            <img src="https://img.shields.io/github/contributors/salonijoshi1980/Veltrian?style=flat-square&color=purple" alt="Contributors" className="h-5" />
            <button onClick={() => navigate("/login")} className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 md:px-6 py-2 rounded-lg font-medium text-sm md:text-base hover:shadow-lg transition-all hover:scale-105">Login</button>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6 sm:px-10">
        <div className="max-w-6xl mx-auto text-center">
          <div className={`transition-all duration-1000 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6">
              Your Private Cloud, Your
              <span className="block bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent mt-2">Intelligence Workspace</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              No cloud. No servers. No data leaks. Just you and your files.<br />Upload, Organize, and Store everything 100% privately.
            </p>
          </div>

          <form onSubmit={handleEmailSubmit} name="newsletter" method="POST" data-netlify="true" className={`max-w-md mx-auto mb-16 transition-all duration-1000 delay-300 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
            <input type="hidden" name="form-name" value="newsletter" />
            <div className="flex flex-col sm:flex-row rounded-2xl border-2 border-purple-200 bg-white shadow-lg overflow-hidden">
              <input type="email" name="email" placeholder="Enter your email..." value={email} onChange={(e) => setEmail(e.target.value)} required className="flex-1 px-6 py-4 text-slate-700 focus:outline-none" />
              <button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 font-semibold hover:shadow-xl transition-all disabled:opacity-50">
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </button>
            </div>
            {submitMessage && <p className="mt-3 text-sm text-green-600 font-medium">{submitMessage}</p>}
            <p className="text-slate-500 text-sm mt-3">By entering your email, you agree to receive updates from Veltrian.</p>
          </form>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">{stat.number}</div>
                <div className="text-slate-600 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works section*/}
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
                ),
                clickable: true,
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
                ),
                clickable: false,
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
                ),
                clickable: false,
              },
            ].map((step, i) => (
              <div
                key={i}
                onClick={() => step.clickable && navigate("/app")}
                className={`text-center p-4 sm:p-6 transition-all duration-300 ${
                  step.clickable
                    ? "cursor-pointer hover:scale-105 hover:shadow-lg hover:bg-purple-50 rounded-xl"
                    : "hover:scale-105"
                }`}
              >
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  step.clickable ? "bg-purple-100" : "bg-blue-100"
                }`}>
                  <svg
                    className={`w-6 h-6 sm:w-8 sm:h-8 ${
                      step.clickable ? "text-purple-600" : "text-blue-600"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {step.icon}
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                  {step.clickable && (
                    <span className="ml-2 text-purple-600 animate-pulse">
                      →
                    </span>
                  )}
                </h3>
                <p className="text-gray-700 text-sm mb-2">{step.desc}</p>
                {step.clickable && (
                  <p className="text-xs text-purple-600 font-medium mt-2">
                    Click to start uploading
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-900 mb-4">See It In Action</h2>
          <p className="text-center text-slate-600 text-lg mb-12">Watch how Veltrian transforms your file management experience</p>
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full"
              poster="/demo-thumbnail.jpg"
            >
              <source src="/demo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-900 mb-4">Why Choose Veltrian?</h2>
          <p className="text-center text-slate-600 text-lg mb-16">Everything you need for secure, private file management</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-8 border border-purple-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-900 mb-4">Built by the Community</h2>
          <p className="text-center text-slate-600 text-lg mb-12">Meet the amazing developers making Veltrian possible</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
            {contributors.map((contributor, index) => (
              <a key={index} href={contributor.html_url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center group">
                <img src={contributor.avatar_url} alt={contributor.login} className="w-20 h-20 rounded-full border-4 border-purple-200 group-hover:border-purple-500 transition-all group-hover:scale-110" />
                <p className="mt-2 text-sm text-slate-700 font-medium text-center">{contributor.login}</p>
              </a>
            ))}
          </div>
          <div className="text-center mt-12">
            <a href="https://github.com/salonijoshi1980/Veltrian" target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-xl transition-all hover:scale-105">
              <span>View All Contributors</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-900 mb-4">What Users Want</h2>
          <p className="text-center text-slate-600 text-lg mb-16">Insights from our community survey</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {surveyInsights.map((insight, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 border border-purple-200 shadow-lg hover:shadow-xl transition-all">
                <div className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">{insight.percentage}</div>
                <p className="text-slate-700 leading-relaxed">{insight.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src="/Dragon logo1.png" alt="Veltrian Logo" className="w-10 h-10 object-contain" />
                <span className="text-2xl font-bold">Veltrian</span>
              </div>
              <p className="text-slate-400">Your privacy, our promise. Built with ❤️ by the Veltrian community.</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="https://github.com/salonijoshi1980/Veltrian" className="hover:text-white transition">GitHub</a></li>
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition">Survey</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="https://github.com/salonijoshi1980/Veltrian" className="hover:text-purple-400 transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="hover:text-purple-400 transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="hover:text-purple-400 transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>© {new Date().getFullYear()} Veltrian. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

