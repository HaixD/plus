"use client"

import { createAccount } from "@/actions/users"
import { useFormState } from "react-dom"
import { LabeledInput } from "@/components/labeled-input/LabeledInput"
import { ResponseMessage } from "@/components/response-message/ResponseMessage"

export function CreateAccountForm() {
    const [signupResponse, formAction] = useFormState(createAccount, {
        error: "",
    })

    return (
        <form action={formAction}>
            <LabeledInput
                text="Username"
                type="text"
                style={{ width: "100%" }}
            />
            <LabeledInput
                text="Password"
                type="password"
                style={{ width: "100%" }}
            />
            <LabeledInput
                text="Verify Password"
                type="password"
                style={{ width: "100%" }}
            />
            <ResponseMessage responseState={signupResponse} />
            <input type="submit" className="button" value="Sign Up" />
        </form>
    )
}
