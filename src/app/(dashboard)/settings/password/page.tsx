"use client"

import styles from "../styles.module.css"
import { LabeledInput } from "@/components/labeled-input/LabeledInput"
import { ResponseMessage } from "@/components/response-message/ResponseMessage"
import { changePassword } from "@/actions/users"
import { useLocalStorage } from "usehooks-ts"
import { useFormState } from "react-dom"
import { useEffect } from "react"

export default function Page() {
    const [changePasswordResponse, formAction] = useFormState(changePassword, {
        error: "",
    })

    return (
        <>
            <h1 id={styles.title}>Change Password</h1>
            <form id={styles.form} action={formAction}>
                <LabeledInput text="Password" type="password" />
                <LabeledInput text="Verify Password" type="password" />
                <ResponseMessage responseState={changePasswordResponse} />
                <input
                    className={`row-button ${styles.button}`}
                    type="submit"
                    value="Update"
                />
            </form>
        </>
    )
}
