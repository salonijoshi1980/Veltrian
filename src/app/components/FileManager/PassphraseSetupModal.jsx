import { useState } from "react";

export default function PassphraseSetupModal({
  onSetupComplete,
  isLoading,
  error,
}) {
  const [passphrase, setPassphrase] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (onSetupComplete) {
      await onSetupComplete(passphrase);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full border border-slate-200">
        <div className="flex items-center justify-center mb-6">
          <img
            src="/Dragon logo1.png"
            alt="Veltrian Logo"
            className="w-10 h-9 object-contain -mr-2"
          />
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent pt-0.5">
            eltrian
          </span>
        </div>
        <p className="text-slate-700 mb-6">
          Enter a strong passphrase to encrypt your files
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="passphrase"
              className="block text-sm font-medium text-slate-800 mb-2"
            >
              Encryption Passphrase
            </label>
            <input
              id="passphrase"
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Enter a strong passphrase"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              disabled={isLoading}
            />
            {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:shadow-lg text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
          >
            {isLoading ? "Setting up..." : "Continue"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-200 text-center text-xs text-slate-600">
          <p>🔒 Your passphrase is never stored or sent anywhere</p>
        </div>
      </div>
    </div>
  );
}