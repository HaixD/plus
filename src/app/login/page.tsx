"use client"

import Image from "next/image"
import styles from "./styles.module.css"
import Link from "next/link"
import { useEffect } from "react"
import { login } from "@/app/actions"
import { useFormState } from "react-dom"
import { useRouter } from "next/navigation"

export default function Page() {
    const [state, formAction] = useFormState(login, "")
    const router = useRouter()

    useEffect(() => {
        if (state === "success") router.push("/page-not-implemented")
    }, [state])
    
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
                        <p className={styles["error-message"]}>{state === "success" ? "" : state}</p>
                    </div>
                    <input 
                        type="submit" 
                        className={styles["page-button"]} 
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
                    <Link href="/page-not-implemented" className={styles["page-button"]}>Create Account</Link>
                </div>
            </div>
        </main>
    )
}