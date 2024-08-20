"use client"

import styles from "./styles.module.css"
import Image from "next/image";
import { ChangeEventHandler, FormEventHandler, forwardRef, HTMLAttributes, TextareaHTMLAttributes, useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { submitPost as action, SubmitPostResponse, SuccessfulLoginResponse } from "@/app/actions";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "usehooks-ts";
import { ErrorMessage } from "@/components/ErrorMessage";

export type PostFormProps = {
    onExitClick: () => void
    charLimit: number
}

export const PostForm = forwardRef<HTMLDivElement, Readonly<PostFormProps>>(function PostForm({
    onExitClick,
    charLimit
}, ref) {
        const [account, _] = useLocalStorage<SuccessfulLoginResponse>("account", { token: "", username: "" })
        const [username, setUsername] = useState("")
        const [text, setText] = useState("")
        const [previewSrc, setPreviewSrc] = useState<Blob | null>(null)
        const [submitResponse, formAction] = useFormState(action, {})
    
        const close = () => {
            setText("")
            setPreviewSrc(null)
            onExitClick()
        }

        useEffect(() => {
            if (!("error" in submitResponse)) {
                close()
            }
        }, [submitResponse])
        
        useEffect(() => {
            setUsername(account.username)
        }, [account])
        
        const removeAttachment = () => {
            setPreviewSrc(null)
        }

        const submitPost = (payload: FormData) => {
            payload.append("token", account.token)
            if (previewSrc === null) payload.delete("image")
            formAction(payload)
        }
        
        return (
            <div 
                ref={ref} 
                onClick={close}
                className={styles["post-form-container"]}
            >
                <form action={submitPost} className={styles["post-form"]} onClick={(evt) => { evt.stopPropagation() }}>
                    <div id={styles.profile}></div>
                    <p id={styles.name}>{username}</p>
                    <Image 
                        id={styles.exit} 
                        onClick={close}
                        src="/exit.svg" 
                        alt="exit" 
                        width={50} 
                        height={50}
                        style={{
                            cursor: "pointer"
                        }}
                    />
                    <CappedTextArea 
                        id={styles.text}
                        cap={charLimit}
                        value={text}
                        onChange={evt => setText(evt.target.value)}
                        name="text"
                    />
                    <div id={styles["attach-button"]}>
                        <label 
                            htmlFor="attach-button"
                            style={{ cursor: "pointer" }}
                        >
                            <input 
                                id="attach-button"
                                type="file"
                                accept="image/*"
                                name="image"
                                onChange={(evt) => {
                                    if (!evt.target.files || !evt.target.files[0]) return
                                    setPreviewSrc(evt.target.files[0])
                                }}
                                style={{ display: "none" }}
                            />
                            <Image src="/placeholderimage.svg" alt="add image" width={50} height={50}/>
                        </label>
                    </div>
                    {
                        previewSrc ? 
                            <div
                                id={styles.preview} 
                                className={styles.attachment}
                                style={{ width: "max-content" }}
                            >
                                <img 
                                    src={URL.createObjectURL(previewSrc)} 
                                    alt="image preview" 
                                    style={{ cursor: "pointer" }}
                                />
                                <div
                                    onClick={removeAttachment}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                                        display: "grid",
                                        placeItems: "center"
                                    }}
                                >
                                    <Image 
                                        src="/exit.svg" 
                                        alt="remove attachment" 
                                        width={40} 
                                        height={40}
                                        style={{
                                            filter: "brightness(0) invert(1)"
                                        }}
                                    />
                                </div>
                            </div>
                            : null
                    }
                    <ErrorMessage id={styles["error"]} responseState={submitResponse}/>
                    <p id={styles.count} style={{ margin: 0 }}>{`${text.length}/${charLimit}`}</p>
                    <input
                        type="submit"
                        value="Send"
                        id={styles.send}
                        className="button"
                        style={{ fontSize: "var(--font-size-large)" }}
                    />
                </form>
            </div>
        );
    }
)

function CappedTextArea({
    cap,
    style={},
    onChange,
    ...props
}: Readonly<{
    cap: number
} & TextareaHTMLAttributes<HTMLTextAreaElement>>) {
    return (
        <textarea
            onChange={evt => {
                evt.target.value = evt.target.value.slice(0, cap)
                if (onChange) onChange(evt)
            }}
            style={{ 
                backgroundColor: "transparent", 
                border: "1px solid black", 
                outline: "none",
                resize: "none",
                fontSize: "1.25rem",
                padding: "0.75rem 1rem",
                ...style
            }}
            {...props}
        />
    )
}