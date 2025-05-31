import { useRef } from "react";

type CodeInputProps = {
    code: string[];
    setCode: (value: string[]) => void;
};

export default function CodeInput({ code, setCode }: CodeInputProps) {
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (i: number, value: string) => {
        if (!/^\d?$/.test(value)) return;

        const newCode = [...code];
        newCode[i] = value;
        setCode(newCode);

        if (value && i < 5) inputsRef.current[i + 1]?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent, i: number) => {
        if (e.key === "Backspace" && !code[i] && i > 0) {
            inputsRef.current[i - 1]?.focus();
        }
    };

    return (
        <div className="flex justify-between gap-2">
            {code.map((digit, i) => (
                <input
                    key={i}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    ref={(el) => (inputsRef.current[i] = el)}
                    className="w-12 h-12 text-center rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
            ))}
        </div>
    );
}
