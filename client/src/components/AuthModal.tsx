import { memo, useState, useEffect } from 'react';

interface AuthModalProps {
  initialEmail: string;
  onEmailChange: (email: string) => void;
  authError: string | null;
  isSubmitting: boolean;
  handleSignIn: (e: React.FormEvent) => Promise<void>;
}

const AuthModal = memo(({
  initialEmail,
  onEmailChange,
  authError,
  isSubmitting,
  handleSignIn
}: AuthModalProps) => {
  // Use local state to manage the input value
  const [email, setEmail] = useState(initialEmail);

  // Sync with parent state when initialEmail changes
  useEffect(() => {
    setEmail(initialEmail);
  }, [initialEmail]);

  // Handle local input changes
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update parent state only when submitting
    onEmailChange(email);
    handleSignIn(e);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred backdrop */}
      <div className="absolute inset-0 bg-opacity-70 backdrop-blur-sm"></div>

      <div className="relative z-10 bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-4">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-emerald-600 text-2xl">🌱</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Save Your Progress</h2>
          <p className="text-gray-600 mb-4">
            Sign in to save your quiz results and track your progress over time.
          </p>
        </div>

        {authError && (
          <div className="mb-4 p-3 bg-red-50 rounded-lg">
            <p className="text-red-700 text-sm">{authError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              placeholder="Enter your email"
              required
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-6 rounded-full text-white font-medium transition-all duration-200 ${
              isSubmitting
                ? 'bg-emerald-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:shadow-emerald-200'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></span>
                Signing in...
              </span>
            ) : (
              'Sign In to Save Results'
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account? We&apos;ll create one automatically with your email.
        </p>
      </div>
    </div>
  );
});

AuthModal.displayName = 'AuthModal';

export default AuthModal;