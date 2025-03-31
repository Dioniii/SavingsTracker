
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useToast } from "../components/ui/use-toast";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; password?: string } = {};
    
    if (!name) {
      newErrors.name = "Name is required";
    }
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // This is where you would connect to your backend
      // For now, we'll simulate a successful registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Account created!",
        description: "You have successfully created an account.",
      });
      
      // Redirect to login after successful registration
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6 text-center">Create an Account</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="finance-form-label">Full Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="finance-form-input"
            disabled={isLoading}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name}</p>
          )}
        </div>
        
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
          <Label htmlFor="password" className="finance-form-label">Password</Label>
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
          <p className="text-xs text-gray-500 mt-1">
            Password must be at least 8 characters long
          </p>
        </div>
        
        <Button 
          type="submit" 
          className="finance-button"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
        
        <div className="finance-divider">
          <span className="finance-divider-text">OR</span>
        </div>
        
        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/" className="finance-link font-medium">
            Log in
          </Link>
        </p>
      </form>
    </Layout>
  );
};

export default Register;
