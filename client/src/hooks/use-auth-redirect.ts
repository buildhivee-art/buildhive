
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function useAuthRedirect() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      router.replace("/") // Redirect to home if logged in
    } else {
        setIsLoading(false)
    }
  }, [router])
  
  return { isLoading }
}
