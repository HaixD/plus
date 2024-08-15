"use client"

import Link from "next/link";
import styles from "./styles.module.css"
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { PostForm } from "./PostForm";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const charLimit = 300

    const pathname = usePathname()
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
            <PostForm ref={postFormRef} charLimit={charLimit} onExitClick={hidePostForm}/>
        </>
    );
}