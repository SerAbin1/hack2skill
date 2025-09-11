import React, { useState } from 'react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        console.log('Login attempt:', { email, password });
        // In a real application, you would handle authentication logic here,
        // like making an API call to a server.
    };

    return (
        // Main container with a plain white background, centered content
        <div className="bg-white min-h-screen flex items-center justify-center p-4 font-sans">

            {/* Login card container */}
            <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-sm w-full transition-transform duration-300 hover:scale-105 border border-gray-100">
                <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
                    Welcome Back
                </h2>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400 transition-all duration-300"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400 transition-all duration-300"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <a href="#" className="text-sm font-medium text-blue-600 hover:underline">
                            Sign up
                        </a>
                        <a href="#" className="text-sm font-medium text-blue-600 hover:underline">
                            Forgot password?
                        </a>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-md"
                    >
                        Log In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
