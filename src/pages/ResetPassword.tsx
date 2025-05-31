import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const VITE_PASSWORD_RECOVERY_VERIFY_TOKEN_URL = import.meta.env.VITE_PASSWORD_RECOVERY_VERIFY_TOKEN_URL;
    const VITE_PASSWORD_RECOVERY_RESET_URL = import.meta.env.VITE_PASSWORD_RECOVERY_RESET_URL;

    useEffect(() => {
        const verifyToken = async () => {
            const res = await fetch(VITE_PASSWORD_RECOVERY_VERIFY_TOKEN_URL, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            });
            setIsValid(res.ok);
        };
        verifyToken();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        const res = await fetch(VITE_PASSWORD_RECOVERY_RESET_URL, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, new_password: password, new_password_confirm: confirmPassword }),
        });
        setLoading(false);

        if (res.ok) {
            navigate("/login");
        } else {
            const data = await res.json();
            setError(data.message || "Something went wrong");
        }
    };

    if (isValid === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <p className="text-lg text-gray-700 dark:text-gray-200">Verifying token...</p>
            </div>
        );
    }

    if (!isValid) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <div className="bg-white dark:bg-gray-800 shadow-md rounded p-6 text-center">
                    <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">Invalid or Expired Token</h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">The reset link is no longer valid. Please request a new one.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-6">Reset Your Password</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
                    >
                        {loading ? "Saving..." : "Set New Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}
