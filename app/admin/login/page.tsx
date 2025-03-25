"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Grid2X2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Attempting to sign in with:", formData.email);
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      console.log("Sign in result:", result);

      if (result?.error) {
        console.error("Sign in error:", result.error);
        toast({
          variant: "error",
          title: "Error",
          description: result.error,
        });
      } else if (result?.ok) {
        console.log("Sign in successful, redirecting to dashboard");
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        console.error("Sign in failed without error");
        toast({
          variant: "error",
          title: "Error",
          description: "Failed to sign in. Please try again.",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "error",
        title: "Error",
        description: "An error occurred during login",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
      <div className="w-full max-w-md mx-4">
        <Card className="border-2 border-[#317B22]/20 shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <Grid2X2 className="h-12 w-12 text-[#317B22]" />
            </div>
            <CardTitle className="text-2xl text-center" style={{ color: "#2A4D14" }}>
              Gridshare Admin
            </CardTitle>
            <CardDescription className="text-center">
              Sign in to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  className="w-full focus:ring-2 focus:ring-[#317B22] focus:border-[#317B22]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="w-full focus:ring-2 focus:ring-[#317B22] focus:border-[#317B22]"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#317B22] hover:bg-[#2A4D14] text-white transition-colors duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 