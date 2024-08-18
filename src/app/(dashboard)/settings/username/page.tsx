"use client"

import { useFormState } from "react-dom"
import styles from "../styles.module.css"
import { changeUsername, SuccessfulLoginResponse } from "@/app/actions"
import { useEffect } from "react"
import { useLocalStorage } from "usehooks-ts"

export default function Page() {
    const [account, setAccount] = useLocalStorage<SuccessfulLoginResponse>("account", { token: "", username: "" })
    const [changeUsernameResponse, formAction] = useFormState(changeUsername, { error: "" })
    
    useEffect(() => {
        if (!("error" in changeUsernameResponse)) {
            setAccount({ ...account, username: changeUsernameResponse.username })
        } else if (changeUsernameResponse.error) {
            console.log(changeUsernameResponse.error)
        }
    }, [changeUsernameResponse])
    
    const submitForm = (payload: FormData) => {
        payload.append("token", account.token)

        formAction(payload)
    }
    
    return (
        <>
            <h1>Change Username</h1>
            <form action={submitForm}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" required/>
                </div>
                <input className={`button ${styles.button}`} type="submit" value="Update"/>
            </form>
        </>

    )
}