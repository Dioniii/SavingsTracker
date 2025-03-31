
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useToast } from "../components/ui/use-toast";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

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

  const createAccount = async (name: string, balance: number) => {
    const token = localStorage.getItem('jwt_token');

    const response = await fetch('http://localhost:4000/create-account', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,  // Send JWT token in header
        },
        body: JSON.stringify({ name, balance }),
    });

    const data = await response.json();
    
    // Handle response accordingly
};


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) return;

  setIsLoading(true);

  try {
      // Send login request to the backend
      const response = await fetch('http://localhost:4000/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              email: email,
              password: password,
          }),
      });

      const data = await response.json();

      // If login is successful, save the JWT token
      if (response.ok) {
          // Save JWT token to localStorage (or cookies)
          localStorage.setItem('jwt_token', data.token);

          toast({
              title: "Success!",
              description: "You have successfully logged in.",
          });

          // Redirect to dashboard after successful login
          navigate("/dashboard");
      } else {
          // Show error if login fails
          toast({
              title: "Error",
              description: data.message || "Failed to login. Please try again.",
              variant: "destructive",
          });
      }
  } catch (error) {
      toast({
          title: "Error",
          description: "Something went wrong. Please try again later.",
          variant: "destructive",
      });
  } finally {
      setIsLoading(false);
  }
};


  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6 text-center">Log In</h1>
      
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
            Create an account
          </Link>
        </p>
      </form>
    </Layout>
  );
};

export default Login;
