"use client";

interface CodeVerificationFormProps {
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  email: string;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export default function CodeVerificationForm({
  verificationCode,
  setVerificationCode,
  email,
  onSubmit,
  isLoading,
  error,
}: CodeVerificationFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-300 text-sm font-medium mb-2">
          Verification Code
        </label>
        <input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          className="bg-gray-700 text-white placeholder-gray-400 text-center text-lg tracking-wide rounded focus:outline-none focus:ring-1 focus:ring-sky-500 w-full px-3 py-2"
          placeholder="000000"
          maxLength={
            6
          } /* Make sure it mattches the length of the code form the server */
          required
        />
        <div>
          <p className="text-gray-400 text-sm text-center mt-1.5">
            Code sent to:
          </p>
          <p className="text-gray-300 text-center">{email}</p>
        </div>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 text-white py-2 rounded font-medium transition-colors"
      >
        {isLoading ? "Verifying..." : "Verify Email"}
      </button>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
    </form>
  );
}
