"use client"

import { LabeledInput } from "@/components/labeled-input/LabeledInput"
import { ResponseMessage } from "@/components/response-message/ResponseMessage"
import { login } from "@/actions/users"
import { useFormState } from "react-dom"

export function LoginForm() {
    const [loginResponse, formAction] = useFormState(login, { error: "" })
    return (
        <form action={formAction} className="vertical-form">
            <LabeledInput text="Username" type="text" />
            <LabeledInput text="Password" type="password" />
            <ResponseMessage responseState={loginResponse} />
            <input type="submit" className="row-button" value="Log In" />
        </form>
    )
}
