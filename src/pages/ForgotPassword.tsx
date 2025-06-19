import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);

        const VITE_PASSWORD_RECOVERY_REQUEST_URL = import.meta.env.VITE_PASSWORD_RECOVERY_REQUEST_URL;
        try {
            const res = await fetch(VITE_PASSWORD_RECOVERY_REQUEST_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: email }),
            });

            if (res.ok) {
                setMessage("If your email is registered, you will receive a reset link.");
            } else {
                const data = await res.json();
                setError(data.message || "Failed to send reset link.");
            }
        } catch {
            setError("Network error");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full flex flex-col gap-4">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Forgot Password</h1>
                {message && <p className="text-green-600">{message}</p>}
                {error && <p className="text-red-600">{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="p-3 rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white"
                    required
                />
                <button
                    type="submit"
                    className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-md transition-colors"
                >
                    Send Reset Link
                </button>
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    Remembered? <Link to="/login" className="hover:underline">Login</Link>
                </div>
            </form>
        </div>
    );
}
