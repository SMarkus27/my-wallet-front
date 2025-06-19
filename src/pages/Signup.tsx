import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password_confirm, setConfirm] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const VITE_SIGNUP_REQUEST_URL = import.meta.env.VITE_SIGNUP_REQUEST_URL;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== password_confirm) {
            setError("Passwords do not match");
            return;
        }

        try {
            const res = await fetch(VITE_SIGNUP_REQUEST_URL, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, password_confirm }),
            });

            if (res.ok) {
                navigate("/verify"); // after signup go to login
            } else {
                const data = await res.json();
                console.log(data)
                setError(data.message || "Signup failed");
            }
        } catch {
            setError("Network error");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full flex flex-col gap-4">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Sign Up</h1>
                {error && <p className="text-red-600">{error}</p>}
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="p-3 rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white"
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
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
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={password_confirm}
                    onChange={e => setConfirm(e.target.value)}
                    className="p-3 rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white"
                    required
                />
                <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition-colors"
                >
                    Create Account
                </button>
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    Already have an account?{" "}
                    <Link to="/login" className="hover:underline">Login</Link>
                </div>
            </form>
        </div>
    );
}
