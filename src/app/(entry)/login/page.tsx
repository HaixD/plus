import Link from "next/link"
import styles from "./styles.module.css"
import { LoginForm } from "./LoginForm"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default function Page() {
    const cookieStore = cookies()
    if (cookieStore.has("token")) redirect("/home")

    return (
        <>
            <h1>Welcome to plus</h1>
            <LoginForm />

            <div id={styles.formalt}>
                <p>Don't have an account?</p>
                <Link href="/create_account" className="row-button">
                    Create Account
                </Link>
            </div>
        </>
    )
}
