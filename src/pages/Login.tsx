import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { LogIn } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, isInternal, isClient } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Signed in successfully");
      // Brief delay to let roles load
      setTimeout(() => {
        navigate("/auth-redirect");
      }, 500);
    }
  };

  return (
    <div className="min-h-screen gradient-navy flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="font-heading text-2xl font-extrabold tracking-tight text-primary-foreground">
            IKAMBA<span className="text-accent">.</span>
          </Link>
          <p className="text-primary-foreground/50 text-sm mt-2">Sign in to your workspace</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl p-8 space-y-5">
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/40 mb-1.5 block">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              className="bg-primary-foreground/5 border-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/30"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/40 mb-1.5 block">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-primary-foreground/5 border-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/30"
            />
          </div>
          <Button type="submit" variant="hero" className="w-full" disabled={loading}>
            <LogIn size={16} className="mr-1" />
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-primary-foreground/40 text-sm mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-accent hover:underline font-medium">
            Request Access
          </Link>
        </p>
        <p className="text-center mt-4">
          <Link to="/" className="text-primary-foreground/30 text-xs hover:text-primary-foreground/60">
            ← Back to Website
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
