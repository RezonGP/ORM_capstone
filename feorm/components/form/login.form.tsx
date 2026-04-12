'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { login, register } from '@/app/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function FormLogin() {
  const router = useRouter();
  const redirectTimeoutRef = useRef<number | null>(null);

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        window.clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  const onSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, name, password);
        await login(email, password);
      }
      setSuccess(mode === 'login' ? 'Đăng nhập thành công' : 'Đăng ký thành công');
      redirectTimeoutRef.current = window.setTimeout(() => {
        router.push('/');
      }, 900);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{mode === 'login' ? 'Login to your account' : 'Create an account'}</CardTitle>
        <CardDescription>
          {mode === 'login'
            ? 'Enter your email below to login to your account'
            : 'Enter your information below to create your account'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void onSubmit();
          }}
        >
          <div className="flex flex-col gap-6">
            {mode === 'register' ? (
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            ) : null}

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
            </div>

            {error ? <div className="text-sm text-red-500">{error}</div> : null}
            {success ? <div className="text-sm text-green-500">{success}</div> : null}
          </div>
          <button type="submit" className="hidden" />
        </form>
      </CardContent>

      <CardFooter className="flex-col gap-2">
        <Button type="button" className="w-full" onClick={onSubmit} disabled={loading}>
          {loading ? 'Loading...' : mode === 'login' ? 'Login' : 'Sign Up'}
        </Button>
        <Button
          type="button"
          variant="link"
          className="w-full"
          onClick={() => {
            setMode((m) => (m === 'login' ? 'register' : 'login'));
            setError(null);
          }}
          disabled={loading}
        >
          {mode === 'login' ? 'Sign Up' : 'Back to Login'}
        </Button>
      </CardFooter>
    </Card>
  );
}
