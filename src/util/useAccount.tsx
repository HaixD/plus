"use client"

import { SuccessfulLoginResponse } from "@/app/actions"
import { useLocalStorage } from "./useLocalStorage"

export function useAccount() {
    return useLocalStorage<SuccessfulLoginResponse>("account", {
        token: "",
        username: "",
        bio: "",
    })
}
