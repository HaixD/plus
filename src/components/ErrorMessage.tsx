import { ErrorResponse } from "@/app/actions"
import { CSSProperties } from "react"

type Response<T> = T | ErrorResponse

export type ErrorMessageProps<T extends object> = {
    responseState: Response<T>
    style?: CSSProperties
}

export function ErrorMessage<T extends object>({
    responseState,
    style={}
}: Readonly<ErrorMessageProps<T>>) {
    return (
        <p
            style={{
                color: "var(--error-color)",
                textAlign: "center",
                minHeight: "1lh",
                fontSize: "var(--font-size-regular)",
                ...style
            }}
        >
            {"error" in responseState ? responseState.error : null}
        </p>
    )
}