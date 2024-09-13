"use client"

import Link, { LinkProps } from "next/link"
import styles from "./styles.module.css"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { PostForm } from "./PostForm"
import { useRouter } from "next/navigation"
import { useLocalStorage } from "usehooks-ts"
import { logout } from "@/actions/users"

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const charLimit = 300

    const router = useRouter()
    const [postFormVisible, setPostFormVisible] = useState(false)
    const [settingsMenuVisible, setSettingsMenuVisible] = useState(false)

    useEffect(() => {
        hidePostForm()
    }, [])

    const showPostForm = () => setPostFormVisible(true)
    const hidePostForm = () => setPostFormVisible(false)

    const showSettingsMenu = () => setSettingsMenuVisible(true)
    const hideSettingsMenu = () => setSettingsMenuVisible(false)
    const toggleSettingsMenu = () =>
        setSettingsMenuVisible(!settingsMenuVisible)

    return (
        <>
            <div id={styles["page-container"]} onClick={hideSettingsMenu}>
                <div id={styles.navbar}>
                    <nav id={styles.navlinks}>
                        <NavLink text="Home" href="/home" />
                        <NavLink text="Explore" href="/explore" />
                        <NavLink text="Notifications" href="/notifications" />
                        <NavLink text="Bookmarks" href="/bookmarks" />
                        <NavLink text="Profile" href="/profile" />
                    </nav>
                    <div id={styles["extra-options"]}>
                        <button
                            id={styles["post-button"]}
                            onClick={showPostForm}
                            className="row-button"
                        >
                            Post
                        </button>
                        <div
                            id={styles["settings-menu"]}
                            style={{
                                display: settingsMenuVisible ? "grid" : "none",
                            }}
                        >
                            <Link
                                href="/settings"
                                style={{ textDecoration: "none" }}
                            >
                                <Image
                                    src="/account.svg"
                                    alt="Your Account"
                                    width={50}
                                    height={50}
                                />
                                <p>Your Account</p>
                            </Link>
                            <button
                                style={{ textDecoration: "none" }}
                                onClick={async () => logout()}
                            >
                                <Image
                                    src="/logout.svg"
                                    alt="Log Out"
                                    width={50}
                                    height={50}
                                />
                                <p>Log Out</p>
                            </button>
                        </div>
                        <Image
                            id={styles["settings-button"]}
                            src="/settings.svg"
                            alt="settings"
                            width={50}
                            height={50}
                            onClick={evt => {
                                evt.stopPropagation()
                                toggleSettingsMenu()
                            }}
                        />
                    </div>
                </div>
                <div>{children}</div>
                <div />
            </div>
            <PostForm
                isVisible={postFormVisible}
                charLimit={charLimit}
                onExitClick={hidePostForm}
            />
        </>
    )
}

function NavLink({
    text,
    href,
    ...props
}: Readonly<
    Exclude<LinkProps, "children" | "className"> & {
        text: string
    }
>) {
    const pathname = usePathname()

    return (
        <Link
            href={href}
            className={pathname === href ? styles.selected : undefined}
            {...props}
        >
            {text}
        </Link>
    )
}
