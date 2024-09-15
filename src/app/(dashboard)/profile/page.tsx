"use client"

import styles from "./profile.module.css"
import Image from "next/image"

import { PostForm } from "./EditBio"

import { useEffect, useRef, useState } from "react"
import { Profile } from "@/models/Profile"
import { getProfile } from "@/actions/users"

export default function Page() {
    const charLimit = 300

    const postFormRef = useRef<HTMLDivElement>(null)
    const [profile, profileSetter] = useState<Profile>({
        username: "",
        bio: "",
        picture: "",
    })

    useEffect(() => {
        hidePostForm()

        getProfile().then(value => {
            profileSetter(value)
        })
    }, [])

    const showPostForm = () => {
        if (!postFormRef.current) return

        postFormRef.current.style.display = "flex"
    }

    const hidePostForm = () => {
        if (!postFormRef.current) return

        postFormRef.current.style.display = "none"

        getProfile().then(value => {
            profileSetter(value)
        })
    }

    return (
        <>
            <div>
                <div className={styles.maincontainer}>
                    <div className={styles.imagecontainer}> </div>
                    <Image
                        className={styles.iconprofile}
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
                    <p style={{ gridArea: "username" }}>@{profile.username}</p>
                    <p style={{ gridArea: "bio" }}>{profile.bio}</p>
                    <p style={{ gridArea: "date" }}>Joined 2024, August 16</p>
                </div>
                <div className={styles.buttoncontainer}>
                    <a href="placeholder1">Posts</a>
                    <a href="placeholder2">Likes</a>
                    <a href="placeholder3">Bookmarks</a>
                </div>
            </div>
            <PostForm
                ref={postFormRef}
                charLimit={charLimit}
                onExitClick={hidePostForm}
                username={profile.username}
            />
        </>
    )
}
