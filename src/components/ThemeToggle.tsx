import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("theme");
            if (stored) return stored === "dark";
            return window.matchMedia("(prefers-color-scheme: dark)").matches;
        }
        return false;
    });

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDark]);

    return (
        <button
            onClick={() => setIsDark(!isDark)}
            className="fixed top-4 right-4 px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-xl text-sm transition-colors"
        >
            {isDark ? "☀️ Light" : "🌙 Dark"}
        </button>
    );
}
