import { useState } from "react";

type Props = {
    // You can pass props if needed, e.g., user ID
};

export default function TwoFactorAuth() {
    const [code, setCode] = useState("");
    const [enabled, setEnabled] = useState<boolean | null>(null); // null = unknown
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Fetch current 2FA status on mount (optional)
    // You can add useEffect here if needed

    const toggle2FA = async () => {
        setError(null);
        setMessage(null);
        try {
            const res = await fetch("http://localhost:5000/api/2fa/toggle", {
                method: "POST",
                credentials: "include",
            });
            if (res.ok) {
                const data = await res.json();
                setEnabled(data.enabled);
                setMessage(`Two-factor authentication ${data.enabled ? "enabled" : "disabled"}.`);
            } else {
                const data = await res.json();
                setError(data.message || "Failed to toggle 2FA");
            }
        } catch {
            setError("Network error");
        }
    };

    const verifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);

        try {
            const res = await fetch("http://localhost:5000/api/2fa/verify", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
            });

            if (res.ok) {
                setMessage("2FA code verified successfully.");
                setCode("");
            } else {
                const data = await res.json();
                setError(data.message || "Invalid code");
            }
        } catch {
            setError("Network error");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full flex flex-col gap-4">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Two-Factor Authentication</h1>

                {message && <p className="text-green-600">{message}</p>}
                {error && <p className="text-red-600">{error}</p>}

                <button
                    onClick={toggle2FA}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md transition-colors"
                >
                    {enabled ? "Disable 2FA" : "Enable 2FA"}
                </button>

                <form onSubmit={verifyCode} className="flex flex-col gap-2">
                    <input
                        type="text"
                        placeholder="Enter 2FA code"
                        value={code}
                        onChange={e => setCode(e.target.value)}
                        className="p-3 rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition-colors"
                    >
                        Verify Code
                    </button>
                </form>
            </div>
        </div>
    );
}
