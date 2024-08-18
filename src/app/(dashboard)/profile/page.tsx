import profile from "./profile.module.css"
import Image from "next/image"

export default function Page() {
    return (
        <> <div>

        <div className={profile.maincontainer}> 
            <div className={profile.imagecontainer}> </div>
                <Image className={profile.iconprofile} style= {{gridArea: "profpic"}}
                src="/logo1.png" alt="logo" width={120} height={120} />

                <Image className={profile.iconprofile} style= {{justifySelf: "flex-end", gridArea: "edit"}}
                src="/edit.svg" alt="edit" width={30} height={30} />
            
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
        </>
    )
}