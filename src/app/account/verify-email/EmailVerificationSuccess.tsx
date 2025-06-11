export default function EmailVerificationSuccess() {
  return (
    <div className="text-center space-y-4">
      <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <div className="text-green-500 space-y-2">
        <h2 className="text-xl font-semibold">Email Verified</h2>
        <p className="text-sm text-gray-300">
          You may now go to your account page.
        </p>
      </div>
    </div>
  );
}
