
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useToast } from "../components/ui/use-toast";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Send login request to backend
      const response = await axios.post("http://localhost:4000/login", {
        email,
        password,
      });

      if (response.data.success) {
        // Save token to localStorage
        localStorage.setItem("token", response.data.token);
        
        toast({
          title: "Success",
          description: "You have successfully logged in.",
        });

        // Redirect to dashboard
        navigate("/dashboard");
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Login failed. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: error.response?.data?.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6 text-center">Login to Your Account</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="finance-form-label">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="finance-form-input"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="finance-form-label">Password</Label>
            <Link to="/forgot-password" className="finance-link text-xs">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="finance-form-input"
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password}</p>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="finance-button"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Log in"}
        </Button>
        
        <div className="finance-divider">
          <span className="finance-divider-text">OR</span>
        </div>
        
        <p className="text-center text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="finance-link font-medium">
            Sign up
          </Link>
        </p>
      </form>
    </Layout>
  );
};

export default Login;