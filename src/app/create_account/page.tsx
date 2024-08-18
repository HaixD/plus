"use client"

import Image from "next/image"
import styles from "./styles.module.css"
import { useEffect } from "react"
import { createAccount } from "@/app/actions"
import { useFormState } from "react-dom"
import { useRouter } from "next/navigation"

export default function Page() {
    const [state, formAction] = useFormState(createAccount, { error: "" })
    const router = useRouter()

    useEffect(() => {
        if (!("error" in state)) router.push("/page-not-implemented")
    }, [state])
    
    return (
        <main className={styles.container}>
            <Image className={styles.logo} src="/logo1.png" alt="logo" width={338} height={338}/>
            <div className={styles.login}>
                <h1>Create an Account</h1>
                <form action={formAction}>
                    <div>
                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" required/>
                    </div>

                    <div>
                        <label htmlFor="username">Password</label>
                        <input type="password" name="password" required/>
                    </div>

                    <div>
                        <label htmlFor="password">Verify password</label>
                        <input type="password" name="verify-password" required/>
                    </div>
                    <div>
                        <p className={styles["error-message"]}>{"error" in state ? state.error : ""}</p>
                    </div>
                    <input 
                        type="submit" 
                        className={styles["page-button"]} 
                        value="Sign Up"
                        style={{
                            fontSize: "2rem",
                            padding: "1rem",
                            width: "100%"
                        }}
                    />
                </form>
            
            </div>
        </main>
    )
}