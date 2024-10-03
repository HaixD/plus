import Image from "next/image"
import styles from "./styles.module.css"
import { Post } from "@/components/post/Post"
import { getPost } from "@/actions/posts"

export default async function Page() {
    const content = await getPost()

    return (
        <div>
            <div id={styles.logo}>
                <Image src="/logo1.png" alt="logo" width={60} height={60} />
                <p>For You</p>
            </div>
            <Post {...content[0]} />
        </div>
    )
}
