"use client"

import styles from "./profile.module.css"
import Image from "next/image"
import {
    ChangeEventHandler,
    FormEventHandler,
    forwardRef,
    useEffect,
    useRef,
    useState,
} from "react"
import { useFormState } from "react-dom"
import {
    submitPost as action,
    createBioModal,
    changeBioModal,
    SuccessfulLoginResponse,
    ChangeBioResponse,
} from "@/app/actions"
import { useRouter } from "next/navigation"
import { useLocalStorage } from "usehooks-ts"
import { useAccount } from "@/util/useAccount"

export type PostFormProps = {
    onExitClick: () => void
    charLimit: number
    account: SuccessfulLoginResponse
    accountSetter: (value: SuccessfulLoginResponse) => void
}

export const PostForm = forwardRef<HTMLDivElement, Readonly<PostFormProps>>(
    function PostForm({ onExitClick, charLimit, account, accountSetter }, ref) {
        const router = useRouter()
        const [changeBioResponse, formAction] = useFormState(changeBioModal, {
            error: "",
        })
        const [charCount, setCharCount] = useState(0)

        const [previewSrc, setPreviewSrc] = useState<Blob | null>(null)

        const textareaRef = useRef<HTMLTextAreaElement>(null)

        //HELP ME
        const [username, setUsername] = useState("")

        useEffect(() => {
            setUsername(account.username)
        }, [account])

        useEffect(() => {
            if (!("error" in changeBioResponse)) {
                accountSetter({ ...account, bio: changeBioResponse.bio })
                // router.refresh()
            }
        }, [changeBioResponse])

        useEffect(() => {
            const accountStr = localStorage.getItem("account")
            if (!accountStr) {
                router.push("/login")
                return
            }
        }, [])

        const removeAttachment = () => {
            setPreviewSrc(null)
        }

        const changeModal = (payload: FormData) => {
            payload.append("token", account.token)

            formAction(payload)
        }

        return (
            <div
                ref={ref}
                onClick={onExitClick}
                className={styles["post-form-container"]}
            >
                <form
                    action={changeModal}
                    className={styles["post-form"]}
                    onClick={evt => {
                        evt.stopPropagation()
                    }}
                >
                    <div id={styles.profile}></div>
                    <p id={styles.name}>{username}</p>
                    <Image
                        id={styles.exit}
                        onClick={onExitClick}
                        src="/exit.svg"
                        alt="exit"
                        width={50}
                        height={50}
                        style={{
                            cursor: "pointer",
                        }}
                    />
                    <textarea
                        name="bio"
                        ref={textareaRef}
                        id={styles.text}
                        //onChange={}

                        style={{
                            backgroundColor: "transparent",
                            border: "1px solid black",
                            outline: "none",
                            resize: "none",
                            fontSize: "1.25rem",
                            padding: "0.75rem 1rem",
                        }}
                    />
                    <div id={styles["attach-button"]}>
                        <label
                            htmlFor="attach-button"
                            style={{
                                cursor: "pointer",
                                userSelect: "none",
                            }}
                        >
                            <input
                                name="picture"
                                id="attach-button"
                                type="file"
                                accept="image/*"
                                onChange={evt => {
                                    if (
                                        !evt.target.files ||
                                        !evt.target.files[0]
                                    )
                                        return
                                    setPreviewSrc(evt.target.files[0])
                                }}
                                style={{ display: "none" }}
                            />
                            <Image
                                src="/camera.svg"
                                alt="edit profile picture"
                                width={120}
                                height={60}
                            />
                        </label>
                    </div>
                    {previewSrc ? (
                        <div
                            id={styles.preview}
                            className={styles.attachment}
                            style={{
                                width: "max-content",
                            }}
                        >
                            <img
                                src={URL.createObjectURL(previewSrc)}
                                alt="image preview"
                                style={{
                                    cursor: "pointer",
                                }}
                            />
                            <div
                                onClick={removeAttachment}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                                    display: "grid",
                                    placeItems: "center",
                                }}
                            >
                                <Image
                                    src="/exit.svg"
                                    alt="remove attachment"
                                    width={40}
                                    height={40}
                                    style={{
                                        filter: "brightness(0) invert(1)",
                                    }}
                                />
                            </div>
                        </div>
                    ) : null}
                    <p
                        id={styles.count}
                        style={{ margin: 0 }}
                    >{`${charCount}/${charLimit}`}</p>
                    <input
                        type="submit"
                        value="Save"
                        id={styles.send}
                        style={{
                            borderRadius: "9999px",
                            border: "none",
                            fontSize: "24px",
                            padding: "0.5rem 2rem",
                            backgroundColor: "#c2d9d1",
                            cursor: "pointer",
                        }}
                    />
                </form>
            </div>
        )
    }
)
