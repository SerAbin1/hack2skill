import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from "firebase/auth";

const AuthPage = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true); // toggle between login & signup
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (isLogin) {
                // LOGIN
                const userCredential = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );
                console.log("Logged in:", userCredential.user);
                alert(`Welcome back, ${userCredential.user.email}`);
                // Navigate to the profile page. The App.jsx router will handle redirection.
                navigate("/profile");
            } else {
                // SIGNUP
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );
                console.log("Account created:", userCredential.user);
                alert("Account created successfully!");
                // Navigate to the onboarding page for new users
                navigate("/onboarding");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white min-h-screen flex items-center justify-center p-4 font-sans">
            <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-sm w-full border border-gray-100 transition-transform duration-300 hover:scale-105">
                <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
                    {isLogin ? "Welcome Back" : "Create Account"}
                </h2>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <form onSubmit={handleAuth} className="space-y-6">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full ${isLogin ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
                            } text-white font-semibold py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all shadow-md`}
                    >
                        {loading ? (isLogin ? "Logging in..." : "Signing up...") : isLogin ? "Log In" : "Sign Up"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    {isLogin ? (
                        <p className="text-sm text-gray-600">
                            Don’t have an account?{" "}
                            <button
                                onClick={() => setIsLogin(false)}
                                className="text-blue-600 font-medium hover:underline"
                            >
                                Sign up
                            </button>
                        </p>
                    ) : (
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <button
                                onClick={() => setIsLogin(true)}
                                className="text-blue-600 font-medium hover:underline"
                            >
                                Log in
                            </button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthPage;