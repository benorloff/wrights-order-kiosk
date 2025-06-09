"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { checkPassword } from "@/lib/auth";

interface PasswordProtectionProps {
  onAuthenticated: () => void;
}

export function PasswordProtection({ onAuthenticated }: PasswordProtectionProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);
    
    try {
      const isValid = await checkPassword(password);
      if (isValid) {
        onAuthenticated();
      } else {
        setError(true);
        setPassword("");
      }
    } catch (error) {
      setError(true);
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Wright's Order Kiosk
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please enter the password to continue
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <Input
              type="password"
              value={password}
              onChange={(e) => {
                setError(false);
                setPassword(e.target.value);
              }}
              placeholder="Enter password"
              className={error ? "border-red-500" : ""}
              disabled={isLoading}
            />
            {error && (
              <p className="mt-2 text-sm text-red-500">
                Incorrect password. Please try again.
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Checking..." : "Continue"}
          </Button>
        </form>
      </div>
    </div>
  );
} 