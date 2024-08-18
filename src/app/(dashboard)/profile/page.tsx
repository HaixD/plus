"use client"
import profile from "./profile.module.css"
import Image from "next/image"

import Link, { LinkProps } from "next/link";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { PostForm } from "./EditBio";


export default function Page({
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
            
                <p style={{gridArea: "username"}}>@Username</p> 

                <p style={{gridArea: "bio"}}>Lorem ipsum dolor sit amet consectetur adipisciping elit. Magnam quis delectus volupatum.</p>

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