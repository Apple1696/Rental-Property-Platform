"use client"

import { useState } from "react"
import type React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authService } from "@/services/authentication"

interface SignupFormProps extends React.ComponentPropsWithoutRef<"form"> {
  onSwitchToLogin?: () => void
}

export function SignupForm({ className, onSwitchToLogin, ...props }: SignupFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showEmailSentMessage, setShowEmailSentMessage] = useState(false);

  const validateForm = () => {
    if (!firstName.trim()) {
      setError("First name is required");
      return false;
    }
    if (!lastName.trim()) {
      setError("Last name is required");
      return false;
    }
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!password) {
      setError("Password is required");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");
    setShowEmailSentMessage(false);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.signup({
        firstName,
        lastName,
        email,
        password
      });

      // Set success message from response if available
      setSuccessMessage(response.message || "Account created successfully!");
      
      // Show email sent message if the request was successful
      setShowEmailSentMessage(true);
      
      // Clear the form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      
    } catch (err: any) {
      console.error("Error:", err);
      const errorMessage = err.response?.data?.message || err.message || "An error occurred during sign up.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (showEmailSentMessage) {
    return (
      <div className="flex flex-col items-center gap-6 p-8 text-center">
        <h2 className="text-2xl font-bold">Check Your Email</h2>
        <div className="text-muted-foreground">
          <p>We have sent a confirmation email to:</p>
          <p className="font-medium mt-2">{email}</p>
        </div>
        <div className="text-sm text-muted-foreground mt-4">
          <p>Please check your email and click on the verification link to complete your registration.</p>
          <p className="mt-2">Once verified, you will be able to log in to your account.</p>
        </div>
        {/* {error && (
          <div className="text-sm text-red-500">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="text-sm text-green-500">
            {successMessage}
          </div>
        )} */}
        <Button onClick={onSwitchToLogin} className="mt-4">
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Please fill in all fields to create your account
        </p>
      </div>
      {error && (
        <div className="text-sm text-red-500 text-center">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="text-sm text-green-500 text-center">
          {successMessage}
        </div>
      )}
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input 
            id="firstName" 
            type="text" 
            required 
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input 
            id="lastName" 
            type="text" 
            required 
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="abc@gmail.com" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input 
            id="confirmPassword" 
            type="password" 
            required 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <button type="button" onClick={onSwitchToLogin} className="underline underline-offset-4 hover:text-primary">
          Sign in
        </button>
      </div>
    </form>
  )
}
