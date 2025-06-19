import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Verify() {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
    const navigate = useNavigate();

    const VITE_SIGNUP_CONFIRM_URL = import.meta.env.VITE_SIGNUP_CONFIRM_URL;
    const VITE_SIGNUP_RESEND_CODE_URL = import.meta.env.VITE_SIGNUP_RESEND_CODE_URL;

    const handleCodeChange = (index: number, value: string) => {
        const newCode = [...code];
        newCode[index] = value.slice(-1); // only take last char

        setCode(newCode);

        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        const fullCode = code.join("");
        try {
            const res = await fetch(VITE_SIGNUP_CONFIRM_URL, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, verification_code: fullCode }),
            });

            if (res.ok) {
                setStatus("success");
                setTimeout(() => navigate("/home"), 1000);
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        }
    };

    const handleResendCode = async () => {
        setResendStatus("sending");
        try {
            const res = await fetch(VITE_SIGNUP_RESEND_CODE_URL, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                setResendStatus("sent");
                setTimeout(() => setResendStatus("idle"), 5000);
            } else {
                setResendStatus("error");
            }
        } catch {
            setResendStatus("error");
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-bold mb-6 text-center text-gray-900 dark:text-white">
                    Verify Your Email
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <div className="flex justify-between gap-2">
                        {code.map((digit, i) => (
                            <input
                                key={i}
                                ref={(el) => (inputsRef.current[i] = el)}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                className="w-12 h-12 text-center text-lg rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                value={digit}
                                onChange={(e) => handleCodeChange(i, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, i)}
                                required
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                        disabled={status === "loading"}
                    >
                        {status === "loading" ? "Verifying..." : "Verify Code"}
                    </button>

                    {status === "error" && (
                        <p className="text-sm text-red-500 text-center">Invalid code or error. Try again.</p>
                    )}
                </form>

                <div className="text-center mt-4">
                    <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={resendStatus === "sending" || resendStatus === "sent"}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50"
                    >
                        {resendStatus === "sent" ? "Code resent!" : "Resend Code"}
                    </button>
                    {resendStatus === "error" && (
                        <p className="text-xs text-red-500 mt-1">Failed to resend. Try again.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
