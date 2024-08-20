import { ErrorResponse } from "@/app/actions"
import { CSSProperties, HTMLAttributes } from "react"

type Response<T> = T | ErrorResponse

export type ErrorMessageProps<T extends object> = {
    responseState: Response<T>
} & HTMLAttributes<HTMLParagraphElement>

export function ErrorMessage<T extends object>({
    responseState,
    style={},
    ...props
}: Readonly<ErrorMessageProps<T>>) {
    return (
        <p
            style={{
                color: "var(--error-color)",
                textAlign: "center",
                minHeight: "1lh",
                fontSize: "var(--font-size-regular)",
                margin: 0,
                ...style
            }}
            {...props}
        >
            {"error" in responseState ? responseState.error : null}
        </p>
    )
}