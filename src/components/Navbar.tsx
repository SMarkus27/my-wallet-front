import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface NavbarProps {
    userEmail: string | null
}

export function Navbar({ userEmail }: NavbarProps) {
    return (
        <header className="flex items-center justify-between p-4 border-b border-border">
            <h1 className="text-xl font-bold">My Wallet</h1>
            <div className="flex items-center gap-4">
                <span className="text-sm">{userEmail}</span>
                <Avatar><AvatarFallback>{userEmail?.[0]?.toUpperCase()}</AvatarFallback></Avatar>
            </div>
        </header>
    )
}
