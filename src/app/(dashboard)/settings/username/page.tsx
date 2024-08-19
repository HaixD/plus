"use client"

import { useFormState } from "react-dom"
import { changeUsername, SuccessfulLoginResponse } from "@/app/actions"
import { useEffect } from "react"
import { useLocalStorage } from "usehooks-ts"
import { LabeledInput } from "@/components/LabeledInput"
import { ErrorMessage } from "@/components/ErrorMessage"

export default function Page() {
    const [account, setAccount] = useLocalStorage<SuccessfulLoginResponse>("account", { token: "", username: "" })
    const [changeUsernameResponse, formAction] = useFormState(changeUsername, { error: "" })
    
    useEffect(() => {
        if (!("error" in changeUsernameResponse)) {
            setAccount({ ...account, username: changeUsernameResponse.username })
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
                <LabeledInput text="Username" type="text"/>
                <ErrorMessage responseState={changeUsernameResponse}/>
                <input className="button" type="submit" value="Update"/>
            </form>
        </>

    )
}