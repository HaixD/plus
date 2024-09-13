export type PostProps = {
    profilePicture: string
    username: string
    content: string
    likes: number
    image: string
}

export function Post({
    profilePicture,
    username,
    content,
    likes,
    image,
}: Readonly<PostProps>) {
    return <div></div>
}
