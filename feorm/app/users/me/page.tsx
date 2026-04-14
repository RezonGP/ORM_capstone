"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { MeUser } from "@/app/types"
import { UserService } from "@/app/server/user"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function UserMePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<MeUser | null>(null)

  const loadMe = async () => {
    if (typeof window === "undefined") return
    const token = localStorage.getItem("accessToken")
    if (!token) {
      router.push("/auth")
      return
    }

    setLoading(true)
    setError(null)
    try {
      const me = await UserService.me()
      setUser(me)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadMe()
  }, [])

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Thông tin cá nhân</h1>
        <Button type="button" variant="outline" onClick={() => router.push("/")}>
          Về trang chủ
        </Button>
      </div>

      {error ? <div className="mt-6 text-sm text-destructive">{error}</div> : null}
      {loading ? <div className="mt-6 text-sm text-muted-foreground">Đang tải...</div> : null}

      {user ? (
        <div className="mt-6">
          <Card className="max-w-xl">
            <CardHeader>
              <CardTitle>Tài khoản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">ID: </span>
                <span className="font-medium">{user.id}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Họ tên: </span>
                <span className="font-medium">{user.name || "(chưa đặt)"}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Email: </span>
                <span className="font-medium">{user.email}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </main>
  )
}
