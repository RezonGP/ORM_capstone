"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useState } from "react"
import { AuthLogin } from "@/app/server/auth"

export function FromLogin() {
    const [isLogin, setIsLogin] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const router = useRouter()

    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(null)
        try {
            if (isLogin) {
                const data = await AuthLogin.login({ email, password })
                const accessToken = data.accessToken
                localStorage.setItem("accessToken", accessToken)
                window.dispatchEvent(new Event("auth-changed"))
                router.push("/")
            } else {
                await AuthLogin.register({ email, name, password })
                setIsLogin(true)
                setSuccess("Đăng ký thành công, hãy đăng nhập.")
                router.push("/auth")
            }
        } catch (err) {
            const message =
                err && typeof err === "object" && "message" in err ? String((err as any).message) : "Request failed"
            setError(message)
        } finally {
            setLoading(false)
        }
        if (isLogin) {
            router.push("/")
        }

    }

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>{isLogin ? "Đăng nhập" : "Đăng ký"}</CardTitle>
                <CardDescription>
                    {isLogin ? "Nhập email và mật khẩu để đăng nhập." : "Nhập thông tin để tạo tài khoản."}
                </CardDescription>
                <CardAction>
                    <Button
                        type="button"
                        variant="link"
                        onClick={() => {
                            setError(null)
                            setIsLogin((v) => !v)
                        }}
                    >
                        {isLogin ? "Đăng ký" : "Đăng nhập"}
                    </Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="flex flex-col gap-6">
                    {success ? (
                        <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-700">
                            {success}
                        </div>
                    ) : null}
                    {error ? (
                        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                            {error}
                        </div>
                    ) : null}

                    {!isLogin ? (
                        <div className="grid gap-2">
                            <Label htmlFor="name">Họ tên</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nguyễn Văn A"
                                required
                            />
                        </div>
                    ) : null}

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="m@example.com"
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Mật khẩu</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete={isLogin ? "current-password" : "new-password"}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Đang xử lý..." : isLogin ? "Đăng nhập" : "Đăng ký"}
                        </Button>
                        {isLogin ? (
                            <Button type="button" variant="outline" className="w-full" onClick={() => router.push("/")}>
                                Về trang chủ
                            </Button>
                        ) : null}
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
