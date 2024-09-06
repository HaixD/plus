import { ErrorResponse } from "@/app/actions"
import styles from "./styles.module.css"
import { HTMLAttributes } from "react"

type Response<T> = T | ErrorResponse

type ResponseMessageProps<T extends object> = {
    responseState?: Response<T>
    successMessage?: string
} & HTMLAttributes<HTMLParagraphElement>

export function ResponseMessage<T extends object>({
    responseState,
    successMessage="Success",
    id="",
    ...props
}: Readonly<ResponseMessageProps<T>>) {
    if (!responseState) return <p className={styles["response-message"]}></p>
    
    const isError = "error" in responseState
    
    return (
        <p id={isError ? styles["error-message"] : styles["success-message"]} className={styles["response-message"]} {...props}>
            {isError ? responseState.error : successMessage}
        </p>
    )
}