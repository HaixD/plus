"use client"

import profile from "./profile.module.css"
import Image from "next/image"

import { PostForm } from "./EditBio"

import { useEffect, useRef } from "react"
import { useAccount } from "@/util/useAccount"

export default function Page() {
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

    const [account, _] = useAccount()

    return (
        <>
            <div>
                <div className={profile.maincontainer}>
                    <div className={profile.imagecontainer}> </div>
                    <Image
                        className={profile.iconprofile}
                        style={{ gridArea: "profpic" }}
                        src="/logo1.png"
                        alt="logo"
                        width={120}
                        height={120}
                    />

                    <div
                        onClick={showPostForm}
                        style={{
                            justifySelf: "flex-end",
                            cursor: "pointer",
                            gridArea: "edit",
                        }}
                    >
                        <Image
                            src="/edit.svg"
                            alt="Edit"
                            width={30}
                            height={30}
                        />
                    </div>
                    <p style={{ gridArea: "username" }}>@{account.username}</p>
                    <p style={{ gridArea: "bio" }}>{account.bio}</p>
                    <p style={{ gridArea: "date" }}>Joined 2024, August 16</p>
                </div>
                <div className={profile.buttoncontainer}>
                    <a href="placeholder1">Posts</a>
                    <a href="placeholder2">Likes</a>
                    <a href="placeholder3">Bookmarks</a>
                </div>
            </div>
            <PostForm
                ref={postFormRef}
                charLimit={charLimit}
                onExitClick={hidePostForm}
            />
        </>
    )
}
