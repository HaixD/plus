"use client"

import { LabeledInput } from "@/components/labeled-input/LabeledInput"
import { ResponseMessage } from "@/components/response-message/ResponseMessage"
import Link from "next/link"
import { useEffect } from "react"
import { login, SuccessfulLoginResponse } from "@/app/actions"
import { useFormState } from "react-dom"
import { useRouter } from "next/navigation"
import { useLocalStorage } from "usehooks-ts"
import styles from "./styles.module.css";

export default function Page() {
    const [_, setAccount] = useLocalStorage<SuccessfulLoginResponse>("account", { token: "", username: "" })
    const [loginResponse, formAction] = useFormState(login, { error: "" })
    const router = useRouter()
    
    useEffect(() => {
        setAccount({ token: "", username: "" })
    }, [])
    
    useEffect(() => {
        if (!("error" in loginResponse)) {
            setAccount(loginResponse)
            router.push("/home")
        }
    }, [loginResponse])
    
    return (
        <>
            <h1>Welcome to plus</h1>
            <form action={formAction} className="vertical-form">
                <LabeledInput text="Username" type="text"/>
                <LabeledInput text="Password" type="password"/>
                <ResponseMessage responseState={loginResponse}/>
                <input type="submit" className="row-button" value="Log In"/>
            </form>

            <div id={styles.formalt}>
                <p>Don't have an account?</p>
                <Link href="/create_account" className="row-button">Create Account</Link>
            </div>
        </>
    )
}