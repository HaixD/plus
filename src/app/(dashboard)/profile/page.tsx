"use client"
import profile from "./profile.module.css"
import Image from "next/image"

import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";

import { PostForm } from "./EditBio";

//these are a tad bit suspicious I daresay
import { useLocalStorage } from "usehooks-ts";
import { submitPost as action, createBioModal, changeBioModal, SuccessfulLoginResponse, ChangeBioResponse } from "@/app/actions";

import styles from "./profile.module.css"

import { ChangeEventHandler, FormEventHandler, forwardRef, useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";

export default function Page({
    children,}: Readonly<{ children: React.ReactNode;
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
        //test

        const [account, setAccount] = useLocalStorage<SuccessfulLoginResponse>("account", { token: "", username: "" })

        //bio?
        //const [text, setText] = useState("")

        const [biography, setBio] = useLocalStorage<ChangeBioResponse>("biography", {error: "", pfp: "", bio: "" })


        const [previewSrc, setPreviewSrc] = useState<Blob | null>(null)

        const textareaRef = useRef<HTMLTextAreaElement>(null)


        //HELP ME 

        useEffect(() => {
            setUsername(account.username)
        }, [account])

        //not sure how to link bio and pfp

        const [username, setUsername] = useState("")

        //const [bio, setBio] = useState("")

        const [profilepicture, setpfp] = useState("")

        useEffect(() => {
            setBio(biography.bio)
        }, [biography])

        useEffect(() => {
            setProfilePicture(biography.pfp)
        }, [biography])

    return (
        <> <div>

        <div className={profile.maincontainer}> 
            <div className={profile.imagecontainer}> </div>
                <Image className={profile.iconprofile} style= {{gridArea: "profpic"}}
                src="/logo1.png" alt="logo" width={120} height={120} />

                <div 
                    onClick={showPostForm} 
                    style={{justifySelf: "flex-end", cursor: 'pointer', gridArea: "edit"  }}
                >
                <Image
                    src="/edit.svg"
                    alt="Edit"
                    width={30}
                    height={30}
                />
                
                </div>
            
                <p style={{gridArea: "username"}}>@{username}</p> 

                <p style={{gridArea: "bio"}}>{bio}</p>

                <p style={{gridArea: "date"}}>Joined 2024, August 16</p>
        </div>

        <div className={profile.buttoncontainer}>
            <a href="placeholder1">Posts</a>
            <a href="placeholder2">Likes</a>
            <a href="placeholder3">Bookmarks</a>
        </div>

        </div>
        <PostForm ref={postFormRef} charLimit={charLimit} onExitClick={hidePostForm}/>

        </>
    )
}