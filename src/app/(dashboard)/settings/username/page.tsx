"use client"

import { useFormState } from "react-dom"
import styles from "../styles.module.css"
import { changeUsername } from "@/actions/users"
import { LabeledInput } from "@/components/labeled-input/LabeledInput"
import { ResponseMessage } from "@/components/response-message/ResponseMessage"

export default function Page() {
    const [changeUsernameResponse, formAction] = useFormState(changeUsername, {
        error: "",
    })

    return (
        <>
            <h1 id={styles.title}>Change Username</h1>
            <form id={styles.form} action={formAction}>
                <LabeledInput text="Username" type="text" />
                <ResponseMessage responseState={changeUsernameResponse} />
                <input
                    className={`row-button ${styles.button}`}
                    type="submit"
                    value="Update"
                />
            </form>
        </>
    )
}
