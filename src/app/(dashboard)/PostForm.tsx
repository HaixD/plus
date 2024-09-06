"use client"

import { submitPost as action, SubmitPostResponse, SuccessfulLoginResponse } from "@/app/actions";
import { ResponseMessage } from "@/components/response-message/ResponseMessage";
import { PopupContainer } from "@/components/popup/popup-container/PopupContainer";
import Image from "next/image";
import { TextareaHTMLAttributes, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useLocalStorage } from "usehooks-ts";
import styles from "./styles.module.css";

export type PostFormProps = {
    isVisible?: boolean
    onExitClick: () => void
    charLimit: number
}

export function PostForm({
    isVisible=false,
    onExitClick,
    charLimit
}: PostFormProps) {
    const [account, _] = useLocalStorage<SuccessfulLoginResponse>("account", { token: "", username: "" })
    const [username, setUsername] = useState("")
    const [text, setText] = useState("")
    const [previewSrc, setPreviewSrc] = useState<Blob | null>(null)
    const [serverResponse, formAction] = useFormState(action, { error: "" })
    const [submitResponse, setSubmitResponse] = useState<SubmitPostResponse>({ error: "" })

    const close = () => {
        setText("")
        setPreviewSrc(null)
        onExitClick()
    }

    useEffect(() => {
        setSubmitResponse(serverResponse)

        if (!("error" in serverResponse)) {
            close()
            setSubmitResponse({ error: "" })
        }
    }, [serverResponse])
    
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
        <PopupContainer isVisible={isVisible} onClick={close}>
            <form 
                action={submitPost} 
                id={styles["post-form"]} 
                onClick={evt => { evt.stopPropagation() }}
            >
                <ProfilePicture src="/background.jpg"/>
                <p id={styles.name}>@{username}</p>
                <Image 
                    onClick={close}
                    src="/exit.svg" 
                    alt="exit" 
                    width={50} 
                    height={50}
                    id={styles.exit}
                />
                <CappedTextArea 
                    cap={charLimit}
                    value={text}
                    onChange={evt => setText(evt.target.value)}
                    name="text"
                />
                <div id={styles["attach-button"]}>
                    <label htmlFor="attach-button">
                        <input 
                            id="attach-button"
                            type="file"
                            accept="image/*"
                            name="image"
                            onChange={(evt) => {
                                if (!evt.target.files || !evt.target.files[0]) return
                                setPreviewSrc(evt.target.files[0])
                            }}
                        />
                        <Image 
                            src="/placeholderimage.svg" 
                            alt="add image" 
                            width={50} 
                            height={50}
                        />
                    </label>
                </div>
                {
                    previewSrc ? 
                        <div id={styles.preview}>
                            <img src={URL.createObjectURL(previewSrc)} alt="image preview"/>
                            <div onClick={removeAttachment} >
                                <Image 
                                    src="/exit.svg" 
                                    alt="remove attachment" 
                                    width={40} 
                                    height={40}
                                    id={styles.exit}
                                />
                            </div>
                        </div>
                        : null
                }
                <div id={styles.error}>
                    <ResponseMessage responseState={submitResponse}/>
                </div>
                <p id={styles.count}>{`${text.length}/${charLimit}`}</p>
                <input type="submit" value="Send" className="button" id={styles.send}/>
            </form>
        </PopupContainer>
    );
}

function ProfilePicture({
    src
}: Readonly<{
    src: string
}>) {
    return (
        <Image src={src} alt="Profile picture" width={64} height={64} id={styles.profile}/>
    )
}

function CappedTextArea({
    cap,
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
            id={styles.text}
            {...props}
        />
    )
}