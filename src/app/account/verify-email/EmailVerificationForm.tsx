"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { User } from "@/app/definitions";

interface EmailVerificationFormProps {
  email: string;
  setEmail: (email: string) => void;
  isEmailEditable: boolean;
  setIsEmailEditable: (editable: boolean) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  user: User | null;
}

export default function EmailVerificationForm({
  email,
  setEmail,
  isEmailEditable,
  setIsEmailEditable,
  onSubmit,
  isLoading,
  error,
  user,
}: EmailVerificationFormProps) {
  const handleEditEmail = () => {
    setIsEmailEditable(true);
  };

  const handleEmailBlur = () => {
    setIsEmailEditable(false);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-300 text-sm font-medium mb-2">
          Email Address
        </label>
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={handleEmailBlur}
            className={`rounded text-white placeholder-gray-400 focus:outline-none transition-colors w-full px-3 py-2 pr-10 ${
              isEmailEditable
                ? "bg-gray-700 focus:ring-1 focus:ring-blue-500"
                : "bg-transparent border border-gray-700/40 cursor-default"
            }`}
            placeholder="Enter your email"
            required
            readOnly={!isEmailEditable}
          />
          {!isEmailEditable && (
            <button
              type="button"
              onClick={handleEditEmail}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
              title="Edit email"
            >
              <FontAwesomeIcon icon={faPen} className="w-4 h-4" />
            </button>
          )}
        </div>
        {user && email === user.email && !isEmailEditable && (
          <p className="text-gray-400 text-xs mt-1">
            Using your account email address
          </p>
        )}
        {isEmailEditable && (
          <p className="text-blue-400 text-xs mt-1">
            You can now edit the email address
          </p>
        )}
        {error && (
          <p className="text-red-500 text-sm mt-1 text-center">{error}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white py-2 rounded font-medium transition-colors"
      >
        {isLoading ? "Sending..." : "Send Verification Code"}
      </button>
    </form>
  );
}
