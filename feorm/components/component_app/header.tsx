"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MeUser } from "@/app/types"
import { UserService } from "@/app/server/user"

function NavLink({ href, label }: { href: string; label: string }) {
    return (
        <Link
            href={href}
            className="rounded-full px-3 py-2 text-sm font-semibold text-[#f5efe6] hover:bg-white/10 hover:text-white transition"
        >
            {label}
        </Link>
    )
}



export default function Header() {
    const router = useRouter()
    const [user, setUser] = useState<MeUser | null>(null)
    const [loadingMe, setLoadingMe] = useState(false)

    const loadMe = async () => {
        if (typeof window === "undefined") return
        const token = localStorage.getItem("accessToken")
        if (!token) {
            setUser(null)
            return
        }

        setLoadingMe(true)
        try {
            const me = await UserService.me()
            setUser(me)
        } catch {
            localStorage.removeItem("accessToken")
            setUser(null)
        } finally {
            setLoadingMe(false)
        }
    }

    useEffect(() => {
        void loadMe()

        const onAuthChanged = () => {
            void loadMe()
        }

        window.addEventListener("auth-changed", onAuthChanged)
        return () => window.removeEventListener("auth-changed", onAuthChanged)
    }, [])

    const onLogout = () => {
        if (typeof window === "undefined") return
        localStorage.removeItem("accessToken")
        window.dispatchEvent(new Event("auth-changed"))
        router.push("/auth")
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#2b1d14]/95 backdrop-blur-md text-[#f5efe6] shadow-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
                <Link href="/" className="flex items-center gap-2 font-bold tracking-tight hover:opacity-90 transition-opacity">
                    <span className="inline-flex size-8 items-center justify-center rounded-lg bg-[#8b5a2b] text-white">
                        OR
                    </span>
                    <span className="hidden sm:block">ORM</span>
                </Link>

                <nav className="hidden items-center gap-1 md:flex">
                    <NavLink href="/" label="Trang chủ" />
                    <NavLink href="/images" label="Trang chi tiết" />
                    <span className="mx-2 h-5 w-px bg-white/15" />
                    <span className="text-sm font-semibold text-[#f5efe6]/80">Quản lý ảnh:</span>
                    <NavLink href="/users/me" label="Thông tin user" />
                    <NavLink href="/saved" label="Ảnh đã lưu" />
                    <NavLink href="/images/created" label="Ảnh đã tạo" />
                </nav>

                <div className="ml-auto flex items-center gap-2">
                    {loadingMe ? (
                        <span className="text-sm text-[#f5efe6]/80">Đang kiểm tra...</span>
                    ) : user ? (
                        <>
                            <span className="hidden sm:inline text-sm text-[#f5efe6]/90">
                                Xin chào, {user.name || user.email}
                            </span>
                            <Button
                                type="button"
                                variant="outline"
                                className="border-white/20 bg-transparent text-[#f5efe6] hover:bg-white/10 hover:text-white"
                                onClick={onLogout}
                            >
                                Đăng xuất
                            </Button>
                        </>
                    ) : (
                        <Link href="/auth">
                            <Button className="bg-[#f5efe6] hover:bg-white text-[#2b1d14] shadow-md transition-all font-semibold">
                                Đăng nhập
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}
