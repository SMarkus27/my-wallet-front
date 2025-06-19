import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const VITE_WALLET_URL = import.meta.env.VITE_WALLET_URL;
    const VITE_LOGOUT_URL = import.meta.env.VITE_LOGOUT_URL;

    useEffect(() => {
        // Check if user is authenticated by hitting a protected API endpoint
        fetch(VITE_WALLET_URL, {
            credentials: "include", // send session cookie
        })
            .then(async (res) => {
                if (res.ok) {
                    const data = await res.json();
                    setUserEmail(data.email);
                } else {
                    navigate("/login"); // redirect if not logged in
                }
            })
            .catch(() => navigate("/login"))
            .finally(() => setLoading(false));
    }, [navigate]);

    const handleLogout = async () => {
        await fetch(VITE_LOGOUT_URL, {
            method: "POST",
            credentials: "include",
        });
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <p className="text-gray-700 dark:text-gray-300">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                    Welcome{userEmail ? `, ${userEmail}` : ""}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    You are logged in successfully.
                </p>
                <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-md transition-colors"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
