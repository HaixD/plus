import { cookies } from "next/headers"
import { CreateAccountForm } from "./CreateAccountForm"
import { redirect } from "next/navigation"

export default function Page() {
    const cookieStore = cookies()
    if (cookieStore.has("token")) redirect("/home")

    return (
        <>
            <h1>Create an Account</h1>
            <CreateAccountForm />
        </>
    )
}
