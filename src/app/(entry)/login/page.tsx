"use client"

import styles from "../styles.module.css"
import { LabeledInput } from "@/components/LabeledInput"
import { ErrorMessage } from "@/components/ErrorMessage"
import Link from "next/link"
import { useEffect } from "react"
import { login, SuccessfulLoginResponse } from "@/app/actions"
import { useFormState } from "react-dom"
import { useRouter } from "next/navigation"
import { useLocalStorage } from "usehooks-ts"

export default function Page() {
    const [_, setAccount] = useLocalStorage<SuccessfulLoginResponse>("account", { token: "", username: "" })
    const [loginResponse, formAction] = useFormState(login, { error: "" })
    const router = useRouter()
    
    useEffect(() => {
        if (!("error" in loginResponse)) {
            setAccount(loginResponse)
            router.push("/home")
        }
    }, [loginResponse])
    
    return (
        <>
            <h1>Welcome to plus</h1>
            <form action={formAction}>
                <LabeledInput text="Username" type="text" style={{ width: "100%" }}/>
                <LabeledInput text="Password" type="password" style={{ width: "100%" }}/>
                <ErrorMessage responseState={loginResponse}/>
                <input type="submit" className="button" value="Log In"/>
            </form>
            <div 
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "1rem",
                    fontSize: "var(--font-size-large)"
                }}
            >
                <p>Don't have an account?</p>
                <Link href="/create_account" className="button">Create Account</Link>
            </div>
        </>
    )
}