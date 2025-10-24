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
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full border border-amber-200">
        <div className="flex items-center justify-center mb-6">
          <img
            src="/src/__create/favicon.png"
            alt="Veltrain Logo"
            className="h-20 w-20 mr-3"
          />
          <h2 className="text-2xl font-bold text-amber-900">Veltrain</h2>
        </div>
        <p className="text-amber-700 mb-6">
          Enter a strong passphrase to encrypt your files
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="passphrase"
              className="block text-sm font-medium text-amber-800 mb-2"
            >
              Encryption Passphrase
            </label>
            <input
              id="passphrase"
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Enter a strong passphrase"
              className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              disabled={isLoading}
            />
            {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-amber-900 font-medium py-2 rounded-lg transition"
          >
            {isLoading ? "Setting up..." : "Continue"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-amber-200 text-center text-xs text-amber-600">
          <p>🔒 Your passphrase is never stored or sent anywhere</p>
        </div>
      </div>
    </div>
  );
}
