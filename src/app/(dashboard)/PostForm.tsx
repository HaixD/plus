"use client"

import styles from "./styles.module.css"
import Image from "next/image";
import { ChangeEventHandler, FormEventHandler, forwardRef, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { submitPost as action } from "@/app/actions";

export type PostFormProps = {
    onExitClick: () => void
    charLimit: number
}

export const PostForm = forwardRef<HTMLDivElement, Readonly<PostFormProps>>(function PostForm({
    onExitClick,
    charLimit
}, ref) {
    const [state, formAction] = useFormState(action, "")
        const [charCount, setCharCount] = useState(0)
        const [previewSrc, setPreviewSrc] = useState<Blob | null>(null)
    
        const textareaRef = useRef<HTMLTextAreaElement>(null)
    
        const removeAttachment = () => {
            setPreviewSrc(null)
        }
    
        const onTextChange: ChangeEventHandler<HTMLTextAreaElement> = (evt) => {
            evt.target.value = evt.target.value.slice(0, charLimit)
            setCharCount(evt.target.value.length)
        }

        const submitPost: FormEventHandler<HTMLFormElement> = (evt) => {
            evt.preventDefault()
            const payload = new FormData()
            payload.append("text", textareaRef.current?.value ?? "")
            console.log(previewSrc?.type)
            if (previewSrc) payload.append("image", previewSrc, )
            formAction(payload)
        }
        
        return (
            <div 
                ref={ref} 
                onClick={onExitClick}
                className={styles["post-form-container"]}
            >
                <form onSubmit={submitPost} className={styles["post-form"]} onClick={(evt) => { evt.stopPropagation() }}>
                    <div id={styles.profile}></div>
                    <p id={styles.name}>username1</p>
                    <Image 
                        id={styles.exit} 
                        onClick={onExitClick}
                        src="/exit.svg" 
                        alt="exit" 
                        width={50} 
                        height={50}
                        style={{
                            cursor: "pointer"
                        }}
                    />
                    <textarea 
                        ref={textareaRef}
                        id={styles.text} 
                        onChange={onTextChange}
                        style={{ 
                            backgroundColor: "transparent", 
                            border: "1px solid black", 
                            outline: "none",
                            resize: "none",
                            fontSize: "1.25rem",
                            padding: "0.75rem 1rem"
                        }}
                    />
                    <div id={styles["attach-button"]}>
                        <label 
                            htmlFor="attach-button"
                            style={{
                                cursor: "pointer",
                                userSelect: "none"
                            }}
                        >
                            <input 
                                id="attach-button"
                                type="file"
                                accept="image/*"
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
                                style={{
                                    width: "max-content"
                                }}
                            >
                                <img 
                                    src={URL.createObjectURL(previewSrc)} 
                                    alt="image preview" 
                                    style={{
                                        cursor: "pointer"
                                    }}
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
                    <p id={styles.count} style={{ margin: 0 }}>{`${charCount}/${charLimit}`}</p>
                    <input
                        type="submit"
                        value="Send"
                        id={styles.send}
                        style={{
                            borderRadius: "9999px",
                            border: "none",
                            fontSize: "24px",
                            padding: "0.5rem 2rem",
                            backgroundColor: "#c2d9d1",
                            cursor: "pointer"
                        }}
                    />
                </form>
            </div>
        );
    }
)