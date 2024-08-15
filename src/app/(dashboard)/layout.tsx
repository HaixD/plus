"use client"

import Link, { LinkProps } from "next/link";
import styles from "./styles.module.css"
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { PostForm } from "./PostForm";
import { Url } from "url";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const charLimit = 300

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
                        <NavLink text="Home" href="/home"/>
                        <NavLink text="Explore" href="/explore"/>
                        <NavLink text="Notifications" href="/notifications"/>
                        <NavLink text="Bookmarks" href="/bookmarks"/>
                        <NavLink text="Profile" href="/profile"/>
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

function NavLink({
    text,
    href,
    ...props
}: Readonly<Exclude<LinkProps, "children"> & {
    text: string
}>) {
    const pathname = usePathname()
    
    return (
        <Link
            href={href}
            style={{
                fontWeight: pathname === href ? "bold" : "normal"
            }}
            {...props}
        >
            {text}
        </Link>
    )
}