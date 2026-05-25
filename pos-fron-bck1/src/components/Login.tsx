import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconCoffee, IconEye, IconEyeOff } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { loginUser, clearError } from '../store/slices/authSlice';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector(s => s.auth);

  const [email, setEmail] = useState('admin@bakery.com');
  const [password, setPassword] = useState('password123');
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[hsl(var(--background))] via-[hsl(var(--muted))] to-[hsl(var(--background))] px-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[hsl(var(--primary))]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[hsl(var(--accent))]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--primary))]/70 shadow-glow mb-4">
            <IconCoffee className="w-8 h-8 text-[hsl(var(--primary-foreground))]" />
          </div>
          <h1 className="text-3xl font-bold">BakeryPOS</h1>
          <p className="text-[hsl(var(--muted-foreground))] mt-1">Restaurant & Bakery Management</p>
        </div>

        {/* Login Card */}
        <Card>
          <CardContent className="p-8">
            <h2 className="text-xl font-bold mb-1">Welcome back</h2>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6">Sign in to your account</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@bakery.com"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                  >
                    {showPw ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-[hsl(var(--destructive))]/10 border border-[hsl(var(--destructive))]/20 text-[hsl(var(--destructive))] text-sm rounded-xl px-4 py-3">
                  {error}
                </div>
              )}

              <Button
                id="login-submit"
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 pt-5 border-t border-[hsl(var(--border))]">
              <p className="text-xs text-[hsl(var(--muted-foreground))] text-center">
                Demo: <span className="font-mono">admin@bakery.com</span> / <span className="font-mono">password123</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
