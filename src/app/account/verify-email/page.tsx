"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@/contexts/UserContext";
import { useEmailVerification } from "@/hooks/useEmailVerification";
import HomeButton from "@/components/HomeButton";
import EmailVerificationForm from "./EmailVerificationForm";
import CodeVerificationForm from "./CodeVerificationForm";
import EmailVerificationSuccess from "./EmailVerificationSuccess";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [isEmailEditable, setIsEmailEditable] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState<null | boolean>(null);

  const { user, userIsLoading, userError, refreshUser } = useUser();

  // Pre-populate email when user data loads
  useEffect(() => {
    if (user?.email && !email) {
      setEmail(user.email);
    }
  }, [user, email]);

  const { sendVerificationCode, verifyEmail, isLoading, error } =
    useEmailVerification();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const sent = await sendVerificationCode(email);
    if (sent) {
      setStep("code");
      setIsEmailVerified(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim()) return;

    const verified = await verifyEmail(email, verificationCode);
    if (verified) {
      setIsEmailVerified(true);

      // Refresh user data
      try {
        await refreshUser();
      } catch (error) {
        console.error("Failed to refresh user data:", error);
      }
    }
  };

  if (userIsLoading) {
    /* We could add a user loading state element here if 
    needed but for now it is left empty for cleaner purposes */
    return;
  }

  if (userError) {
    return (
      <div className="page">
        <div className="bg-gray-800 p-5 rounded-lg shadow-lg w-full max-w-md text-center">
          <div className="text-red-500 mb-4">
            Unable to load user data. Please try logging in again.
          </div>
          <HomeButton />
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-[400px]">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Email Verification
        </h1>
        {user?.email_verified === true && isEmailVerified === null ? (
          <div className="text-center opacity-95">
            Your email address is already verified
          </div>
        ) : step === "email" ? (
          <EmailVerificationForm
            email={email}
            setEmail={setEmail}
            isEmailEditable={isEmailEditable}
            setIsEmailEditable={setIsEmailEditable}
            onSubmit={handleSendCode}
            isLoading={isLoading}
            error={error}
            user={user}
          />
        ) : (
          <>
            {!isEmailVerified ? (
              <CodeVerificationForm
                verificationCode={verificationCode}
                setVerificationCode={setVerificationCode}
                email={email}
                onSubmit={handleVerifyEmail}
                isLoading={isLoading}
                error={error}
              />
            ) : (
              <EmailVerificationSuccess />
            )}
          </>
        )}
        <div className="flex flex-col justify-center items-center mt-2">
          <Link href="/account">
            <p className="link-slate-500">Account</p>
          </Link>
        </div>
        <HomeButton />
      </div>
    </div>
  );
}
