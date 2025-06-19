import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const [username, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const VITE_LOGIN_URL = import.meta.env.VITE_LOGIN_URL;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const res = await fetch(VITE_LOGIN_URL, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            if (res.ok) {
                navigate("/");
            } else {
                const data = await res.json();
                setError(data.message || "Login failed");
            }
        } catch {
            setError("Network error");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full flex flex-col gap-4">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Login</h1>
                {error && <p className="text-red-600">{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={username}
                    onChange={e => setEmail(e.target.value)}
                    className="p-3 rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="p-3 rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white"
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors"
                >
                    Sign In
                </button>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mt-2">
                    <Link to="/forgot-password" className="hover:underline">Forgot Password?</Link>
                    <Link to="/signup" className="hover:underline">Sign Up</Link>
                </div>
            </form>
        </div>
    );
}
