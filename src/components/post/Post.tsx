"use client"
import * as FaIcons from "react-icons/fa"
import Image from "next/image"
import styles from "./styles.module.css"
import { getPost } from "@/actions/posts"
import { DOMAttributes, useEffect, useState } from "react"

export type PostProps = Awaited<ReturnType<typeof getPost>>[number]

export function Post({
    username,
    pfp,
    img: image,
    content,
}: Readonly<PostProps>) {
    const expandPost = () => {}
    const likePost = () => {}
    const bookmarkPost = () => {}

    return (
        <div className={styles.post}>
            {pfp ? (
                <Image src={pfp} alt="" id={styles.pfp} />
            ) : (
                <div id={styles.pfp} />
            )}
            <p id={styles.username}>{username}</p>
            <p id={styles.content}>{content}</p>
            {image ? <Image src={image} alt="" id={styles.content} /> : null}
            <div id={styles.interaction}>
                <Interaction untoggledIcon="FaRegComment" />
                <Interaction untoggledIcon="FaRegHeart" toggledIcon="FaHeart" />
                <Interaction
                    untoggledIcon="FaRegBookmark"
                    toggledIcon="FaBookmark"
                />
            </div>
        </div>
    )
}

function Interaction({
    untoggledIcon,
    toggledIcon,
    onClick,
    initialState = false,
}: Readonly<{
    onClick?: DOMAttributes<HTMLButtonElement>["onClick"]
    untoggledIcon: keyof typeof FaIcons
    toggledIcon?: keyof typeof FaIcons
    initialState?: boolean
}>) {
    const [toggled, setToggled] = useState(false)

    useEffect(() => {
        setToggled(initialState)
    }, [initialState])

    const UntoggledElement = FaIcons[untoggledIcon]
    const ToggledElement = toggledIcon ? FaIcons[toggledIcon] : null

    return (
        <button
            onClick={evt => {
                setToggled(!toggled)

                if (onClick) onClick(evt)
            }}
            className={styles.icon}
        >
            {toggled && ToggledElement ? (
                <ToggledElement />
            ) : (
                <UntoggledElement />
            )}
        </button>
    )
}
