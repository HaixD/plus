"use client"

import Image from "next/image"
import styles from "./styles.module.css"
import Link from "next/link"
import { useEffect } from "react"
import { login, LoginResponse } from "@/app/actions"
import { useFormState } from "react-dom"
import { useRouter } from "next/navigation"

export default function Page() {
    const [loginResponse, formAction] = useFormState(login, { error: "" })
    const router = useRouter()
    
    useEffect(() => {
        if (!("error" in loginResponse)) {
            localStorage.clear()
            localStorage.setItem("account", JSON.stringify(loginResponse))
            router.push("/home")
        }
    }, [loginResponse])
    
    return (
        <main className={styles.container}>
            <Image className={styles.logo} src="/logo1.png" alt="logo" width={338} height={338}/>
            <div className={styles.login}>
                <h1>Welcome to plus</h1>
                <form action={formAction}>
                    <div>
                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" required/>
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" required/>
                    </div>
                    <div>
                        <p className={styles["error-message"]}>{"error" in loginResponse ? loginResponse.error : ""}</p>
                    </div>
                    <input 
                        type="submit" 
                        className="button" 
                        value="Log In"
                        style={{
                            fontSize: "2rem",
                            padding: "1rem",
                            width: "100%"
                        }}
                    />
                </form>
                <div className={styles["create-account"]}>
                    <p>Don't have an account?</p>
                    <Link href="/create_account" className="button">Create Account</Link>
                </div>
            </div>
        </main>
    )
}