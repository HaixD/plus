"use server"

import { readdir, writeFile } from "fs/promises"
import { redirect } from "next/navigation"
import path from "path"
import { getUserID } from "./users"
import { cookies } from "next/headers"
import { posts } from "@/database/schema/posts"
import { db } from "@/database/drizzle"
import { accounts, profiles } from "@/database/schema/users"
import { eq } from "drizzle-orm"

export async function submitPost(_: any, formData: FormData) {
    const cookieStore = cookies()
    const imageFolder = path.join(process.cwd(), "public", "external")

    const text = formData.get("text") as string | null
    const image = formData.get("image") as Blob | null
    const userID = await getUserID(cookieStore.get("token")?.value)

    if (!userID) redirect("/login")

    if (!text && !image) return { error: "No text or image provided." }

    let filename: string | null = null
    if (image && image.size) {
        if (image.size === 0 || !/^image/.test(image.type))
            return { error: "Image cannot be accepted." }

        const buffer = await image.arrayBuffer()

        const dirLength = (await readdir(imageFolder)).length
        filename = `${dirLength}.${
            image.type.match(/(?<=image\/).*/) ?? "blob"
        }`

        writeFile(path.join(imageFolder, filename), Buffer.from(buffer))
    }

    await db
        .insert(posts)
        .values({ poster: userID, content: text, imagePath: filename })
}

export async function getPost() {
    return db.select({pfp:profiles.picture, content:posts.content, img:posts.imagePath, username:accounts.username}).from(posts).innerJoin(profiles, eq(profiles.id, posts.poster)).innerJoin(accounts, eq(accounts.id, posts.poster))
}