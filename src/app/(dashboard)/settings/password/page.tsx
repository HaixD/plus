"use client"

import styles from "../styles.module.css"
import { LabeledInput } from "@/components/LabeledInput"
import { ErrorMessage } from "@/components/ErrorMessage"
import { changePassword, SuccessfulLoginResponse } from "@/app/actions"
import { useLocalStorage } from "usehooks-ts"
import { useFormState } from "react-dom"
import { useEffect } from "react"

export default function Page() {
    const [account, setAccount] = useLocalStorage<SuccessfulLoginResponse>("account", { token: "", username: "" })
    const [changePasswordResponse, formAction] = useFormState(changePassword, { error: "" })
    
    useEffect(() => {
        if (!("error" in changePasswordResponse)) {
            setAccount({ ...account, token: changePasswordResponse.token })
        }
    }, [changePasswordResponse])
    
    const submitForm = (payload: FormData) => {
        payload.append("token", account.token)

        formAction(payload)
    }
    
    return (
        <>
            <h1 id={styles.title}>Change Password</h1>
            <form id={styles.form} action={submitForm}>
                <LabeledInput text="Password" type="password"/>
                <LabeledInput text="Verify Password" type="password"/>
                <ErrorMessage responseState={changePasswordResponse}/>
                <input className={`button ${styles.button}`} type="submit" value="Update"/>
            </form>
        </>

    )
}