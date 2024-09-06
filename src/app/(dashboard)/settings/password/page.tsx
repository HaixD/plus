"use client"

import styles from "../styles.module.css"
import { LabeledInput } from "@/components/labeled-input/LabeledInput"
import { ResponseMessage } from "@/components/response-message/ResponseMessage"
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
                <ResponseMessage responseState={changePasswordResponse}/>
                <input className={`row-button ${styles.button}`} type="submit" value="Update"/>
            </form>
        </>

    )
}