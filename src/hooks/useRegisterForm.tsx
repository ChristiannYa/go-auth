import { useState } from "react";
import { RegisterFormData, AuthResponse } from "@/app/definitions";
import { useAuthActions } from "@/hooks/useAuthActions";

export function useRegisterForm() {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthActions();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
          credentials: "include",
        }
      );

      const data: AuthResponse = await response.json();

      if (data.success && data.accessToken) {
        // Store the access token in the context
        login(data.accessToken);

        window.location.href = "/";
      } else if (data.errors) {
        setErrors(data.errors);
      } else {
        setErrors({
          form: "Registration failed. Please try again.",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({
        form: "An connection error occurred during registration. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    isLoading,
    handleInputChange,
    handleSubmit,
  };
}
