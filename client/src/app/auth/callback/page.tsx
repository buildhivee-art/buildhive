"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get("token")
    if (token) {
      // Store token in localStorage
      localStorage.setItem("token", token)
      
      // Dispatch event for other components to listen (optional)
      window.dispatchEvent(new Event("storage"))

      toast.success("Successfully logged In.")
      
      // Redirect to home or dashboard
      // Use setTimeout to allow toast to show briefly or state to settle
      setTimeout(() => {
          router.push("/")
      }, 500)
    } else {
      toast.error("Failed to login with GitHub")
      router.push("/login")
    }
  }, [searchParams, router])

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground">Authenticating...</p>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin text-primary" />}>
        <CallbackContent />
      </Suspense>
    </div>
  )
}
