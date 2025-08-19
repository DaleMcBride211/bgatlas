'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

// Import Shadcn UI components. Ensure these paths are correct for your project setup.
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/header'
import { useRouter } from 'next/navigation';

function AuthPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const { user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut } = useAuth();

    const router = useRouter();
    // Handles user registration with email and password
    const handleEmailSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await signUpWithEmail(email, password);
            console.log('User registered successfully!');
            router.push('/');
        } catch (err: any) {
            console.error('Registration failed:', err.message);
            setError(err.message);
        }
    };

    // Handles user login with email and password
    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await signInWithEmail(email, password);
            console.log('User logged in successfully!');
            router.push('/');
        } catch (err: any) {
            console.error('Login failed:', err.message);
            setError(err.message);
        }
    };

    // Handles Google social login using a popup
    const handleGoogleLogin = async () => {
        setError(null);
        try {
            await signInWithGoogle();
            console.log('User signed in with Google successfully!');
            router.push('/');
        } catch (err: any) {
            console.error('Google login failed:', err.message);
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-800 to-green-950 p-4 font-['Inter'] text-white text-xl">
                <p>Loading authentication...</p>
            </div>
        );
    }

    if (user) {
        return (
          
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-800 to-green-950 p-4 font-['Inter']">
              <Header />
                <Card className="w-full max-w-md mx-auto bg-green-50 text-gray-800 shadow-lg rounded-xl overflow-hidden">
                    <CardHeader className="text-center p-6">
                        <CardTitle className="text-3xl font-bold mb-2">Welcome Back!</CardTitle>
                        <CardDescription className="text-green-700">
                            You are currently logged in as {user.email || user.displayName || 'a user'}.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center p-6">
                        <p className="mb-4 text-green-800">Enjoy your time on Big Game Atlas!</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-800 to-green-950 p-4 font-['Inter']">
          <Header />
            <Card className="w-full max-w-md mx-auto bg-green-50 text-gray-800 shadow-lg rounded-xl overflow-hidden">
                <Tabs defaultValue="login" className="w-full">
                    {/* Tab navigation for Login and Sign Up */}
                    <TabsList className="grid w-full grid-cols-2 bg-green-200 text-gray-800 rounded-t-xl">
                        <TabsTrigger value="login" className="data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=inactive]:text-green-700 hover:text-white transition-colors duration-200">
                            Login
                        </TabsTrigger>
                        <TabsTrigger value="signup" className="data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=inactive]:text-green-700 hover:text-white transition-colors duration-200">
                            Sign Up
                        </TabsTrigger>
                    </TabsList>

                    {/* Login Form Content */}
                    <TabsContent value="login">
                        <CardHeader className="text-center p-6">
                            <CardTitle className="text-3xl font-bold mb-2">Login to Big Game Atlas</CardTitle>
                            <CardDescription className="text-green-700">
                                Enter your credentials to access your account.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                            <form onSubmit={handleEmailLogin} className="space-y-4">
                                <div>
                                    <Label htmlFor="email-login" className="text-green-800">Email</Label>
                                    <Input
                                        id="email-login"
                                        type="email"
                                        placeholder="email@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="mt-1 bg-white border-green-300 text-gray-800 placeholder-gray-500 focus:border-green-400 focus:ring-green-400 rounded-md"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="password-login" className="text-green-800">Password</Label>
                                    <Input
                                        id="password-login"
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="mt-1 bg-white border-green-300 text-gray-800 placeholder-gray-500 focus:border-green-400 focus:ring-green-400 rounded-md"
                                        required
                                    />
                                </div>
                                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                                <Button
                                    type="submit"
                                    className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
                                >
                                    Sign In
                                </Button>
                            </form>
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-green-300"></span>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-green-50 px-2 text-green-600">Or continue with</span>
                                </div>
                            </div>
                            <Button
                                onClick={handleGoogleLogin}
                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md flex items-center justify-center space-x-2 border border-gray-300"
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12.24 10.27c-.24 0-.47-.02-.7-.06C11.39 9.38 11 8.76 11 8c0-1.66 1.34-3 3-3 1.22 0 2.27.73 2.76 1.77l-1.35.91c-.26-.51-.78-.88-1.41-.88-.83 0-1.5.67-1.5 1.5 0 .74.54 1.36 1.25 1.48L12.24 10.27z" />
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                                    <path d="M12 11.23c-1.63 0-2.96 1.33-2.96 2.96s1.33 2.96 2.96 2.96c1.63 0 2.96-1.33 2.96-2.96s-1.33-2.96-2.96-2.96zm0 4.41c-1.13 0-2.05-.92-2.05-2.05S10.87 12.04 12 12.04s2.05.92 2.05 2.05-.92 2.05-2.05 2.05z" />
                                    <path d="M12 4c-3.23 0-5.91 2.23-6.66 5.25L4 10.75V12h16v-1.25l-1.34-1.5C17.91 6.23 15.23 4 12 4z" fill="#EA4335" />
                                    <path d="M12 4c3.23 0 5.91 2.23 6.66 5.25l-1.34 1.5V12h-3.32l-1.58-1.58c-.59-.59-1.38-.92-2.26-.92s-1.67.33-2.26.92L6 12H4V10.75L5.34 9.25C6.09 6.23 8.77 4 12 4z" fill="#4285F4" />
                                    <path d="M12 12c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="#FBBC04" />
                                    <path d="M20 12h-2v2h2v-2zM4 12H2v2h2v-2z" fill="#34A853" />
                                </svg>
                                <span>Sign In with Google</span>
                            </Button>
                        </CardContent>
                    </TabsContent>

                    {/* Sign Up Form Content */}
                    <TabsContent value="signup">
                        <CardHeader className="text-center p-6">
                            <CardTitle className="text-3xl font-bold mb-2">Create an Account</CardTitle>
                            <CardDescription className="text-green-700">
                                Enter your details below to create a new account.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                            <form onSubmit={handleEmailSignup} className="space-y-4">
                                <div>
                                    <Label htmlFor="email-signup" className="text-green-800">Email</Label>
                                    <Input
                                        id="email-signup"
                                        type="email"
                                        placeholder="email@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="mt-1 bg-white border-green-300 text-gray-800 placeholder-gray-500 focus:border-green-400 focus:ring-green-400 rounded-md"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="password-signup" className="text-green-800">Password</Label>
                                    <Input
                                        id="password-signup"
                                        type="password"
                                        placeholder="Password (min 6 characters)"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="mt-1 bg-white border-green-300 text-gray-800 placeholder-gray-500 focus:border-green-400 focus:ring-green-400 rounded-md"
                                        required
                                    />
                                </div>
                                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                                <Button
                                    type="submit"
                                    className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
                                >
                                    Create Account
                                </Button>
                            </form>
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-green-300"></span>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-green-50 px-2 text-green-600">Or continue with</span>
                                </div>
                            </div>
                            <Button
                                onClick={handleGoogleLogin}
                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md flex items-center justify-center space-x-2 border border-gray-300"
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12.24 10.27c-.24 0-.47-.02-.7-.06C11.39 9.38 11 8.76 11 8c0-1.66 1.34-3 3-3 1.22 0 2.27.73 2.76 1.77l-1.35.91c-.26-.51-.78-.88-1.41-.88-.83 0-1.5.67-1.5 1.5 0 .74.54 1.36 1.25 1.48L12.24 10.27z" />
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                                    <path d="M12 11.23c-1.63 0-2.96 1.33-2.96 2.96s1.33 2.96 2.96 2.96c1.63 0 2.96-1.33 2.96-2.96s-1.33-2.96-2.96-2.96zm0 4.41c-1.13 0-2.05-.92-2.05-2.05S10.87 12.04 12 12.04s2.05.92 2.05 2.05-.92 2.05-2.05 2.05z" />
                                    <path d="M12 4c-3.23 0-5.91 2.23-6.66 5.25L4 10.75V12h16v-1.25l-1.34-1.5C17.91 6.23 15.23 4 12 4z" fill="#EA4335" />
                                    <path d="M12 4c3.23 0 5.91 2.23 6.66 5.25l-1.34 1.5V12h-3.32l-1.58-1.58c-.59-.59-1.38-.92-2.26-.92s-1.67.33-2.26.92L6 12H4V10.75L5.34 9.25C6.09 6.23 8.77 4 12 4z" fill="#4285F4" />
                                    <path d="M12 12c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="#FBBC04" />
                                    <path d="M20 12h-2v2h2v-2zM4 12H2v2h2v-2z" fill="#34A853" />
                                </svg>
                                <span>Sign Up with Google</span>
                            </Button>
                        </CardContent>
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
    );
}

export default AuthPage;