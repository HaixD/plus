import { CSSProperties } from "react"

export type LabeledInputProps = {
    text: string
    type: "text" | "password"
    name?: string
    style?: CSSProperties
}

export function LabeledInput({
    text,
    type,
    name=text.toLowerCase().replace(/\s/g, "-"),
    style={}
}: Readonly<LabeledInputProps>) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--gap-small)",
                ...style
            }}
        >
            <label htmlFor={name}>{text}</label>
            <input type={type} name={name} required/>
        </div>
    )
}