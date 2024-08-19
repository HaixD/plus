"use client"

import { useEffect } from "react"
import { createAccount } from "@/app/actions"
import { useFormState } from "react-dom"
import { useRouter } from "next/navigation"
import { LabeledInput } from "@/components/LabeledInput"
import { ErrorMessage } from "@/components/ErrorMessage"

export default function Page() {
    const [signupResponse, formAction] = useFormState(createAccount, { error: "" })
    const router = useRouter()

    useEffect(() => {
        if (!("error" in signupResponse)) {
            localStorage.clear()
            localStorage.setItem("account", JSON.stringify(signupResponse))
            router.push("/home")
        }
    }, [signupResponse])
    
    return (
        <>
            <h1>Create an Account</h1>
            <form action={formAction}>
                <LabeledInput text="Username" type="text" style={{ width: "100%" }}/>
                <LabeledInput text="Password" type="password" style={{ width: "100%" }}/>
                <LabeledInput text="Verify password" type="password" style={{ width: "100%" }}/>
                <ErrorMessage responseState={signupResponse}/>
                <input type="submit" className="button" value="Sign Up"/>
            </form>
        </>
    )
}