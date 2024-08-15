"use client"

import Link from "next/link";
import styles from "./styles.module.css"
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChangeEventHandler, MouseEventHandler, useEffect, useRef, useState } from "react";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const charLimit = 300

    const pathname = usePathname()
    const [charCount, setCharCount] = useState(0)
    const [previewSrc, setPreviewSrc] = useState<Blob | null>(null)

    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const postFormRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        hidePostForm()
    }, [])
    
    const showPostForm = () => {
        if (!postFormRef.current) return
        
        postFormRef.current.style.display = "flex"
    }

    const hidePostForm = () => {
        if (!postFormRef.current) return
        
        postFormRef.current.style.display = "none"
    }

    const addAttachment = () => {
        const fileInput = document.createElement("input")
        fileInput.type = "file"
        fileInput.accept = "image/*"

        fileInput.addEventListener("change", () => {
            if (!fileInput.files || !fileInput.files[0]) return
            setPreviewSrc(fileInput.files[0])
        })

        fileInput.click()
    }

    const removeAttachment = () => {
        setPreviewSrc(null)
    }

    const onTextChange: ChangeEventHandler<HTMLTextAreaElement> = (evt) => {
        evt.target.value = evt.target.value.slice(0, charLimit)
        setCharCount(evt.target.value.length)
    }

    const submitPost = () => {
        if (!textareaRef.current || (!previewSrc && !textareaRef.current.value)) {
            console.log("BAD")
            return
        }
        
        const data = {
            text: textareaRef.current.value,
            attachment: previewSrc
        }

        console.log("SEND", data)
    }
    
    return (
        <>
            <div className={styles["page-container"]}>
                <div className={styles.navbar}>
                    <nav className={styles.navlinks}>
                        <Link
                            href="/home"
                            style={{
                                fontWeight: pathname === "/home" ? "bold" : "normal"
                            }}
                        >
                            Home
                        </Link>
                        <Link
                            href="/explore"
                            style={{
                                fontWeight: pathname === "/explore" ? "bold" : "normal"
                            }}
                        >
                            Explore
                        </Link>
                        <Link
                            href="/notifications"
                            style={{
                                fontWeight: pathname === "/notifications" ? "bold" : "normal"
                            }}
                        >
                            Notifications
                        </Link>
                        <Link
                            href="/bookmarks"
                            style={{
                                fontWeight: pathname === "/bookmarks" ? "bold" : "normal"
                            }}
                        >
                            Bookmarks
                        </Link>
                        <Link
                            href="/profile"
                            style={{
                                fontWeight: pathname === "/profile" ? "bold" : "normal"
                            }}
                        >
                            Profile
                        </Link>
                    </nav>
                    <button
                        onClick={showPostForm}
                        style={{
                            margin: "auto",
                            width: "80%",
                            borderRadius: "9999px",
                            border: "none",
                            fontSize: "36px",
                            padding: "1rem 0 ",
                            backgroundColor: "#c2d9d1",
                            cursor: "pointer"
                        }}
                    >
                        Post
                    </button>
                    <Link
                        href="#"
                        style={{
                            marginTop: "auto",
                            marginLeft: "auto",
                            marginRight: "2rem",
                            marginBottom: "2rem"
                        }}
                    >
                        <Image src="/settings.svg" alt="settings" width={50} height={50} />
                    </Link>
                </div>
                <div>{children}</div>
                <div></div>
            </div>
            <div 
                ref={postFormRef} 
                onClick={hidePostForm}
                className={styles["post-form-container"]}
            >
                <div className={styles["post-form"]} onClick={(evt) => { evt.stopPropagation() }}>
                    <div id={styles.profile}></div>
                    <p id={styles.name}>username1</p>
                    <Image 
                        id={styles.exit} 
                        onClick={hidePostForm}
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
                    <button
                        id={styles["attach-button"]}
                        onClick={addAttachment}
                        style={{
                            width: "fit-content",
                            height: "fit-content",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                        }}
                    >
                        <Image src="/placeholderimage.svg" alt="add image" width={50} height={50}/>
                    </button>
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
                    <button
                        id={styles.send}
                        onClick={submitPost}
                        style={{
                            borderRadius: "9999px",
                            border: "none",
                            fontSize: "24px",
                            padding: "0.5rem 2rem",
                            backgroundColor: "#c2d9d1",
                            cursor: "pointer"
                        }}
                    >
                        Send
                    </button>
                </div>
            </div>
        </>
    );
}
