import styles from "./styles.module.css"
import { HTMLAttributes } from "react"

export type LabeledInputProps = {
    text: string
    type: "text" | "password"
    name?: string
} & HTMLAttributes<HTMLDivElement>

export function LabeledInput({
    text,
    type,
    name=text.toLowerCase().replace(/\s/g, "-"),
    style={},
    ...props
}: Readonly<LabeledInputProps>) {
    return (
        <div
            id={styles["labeled-input"]}
            {...props}
        >
            <label htmlFor={name}>{text}</label>
            <input type={type} name={name} required/>
        </div>
    )
}