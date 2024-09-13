import Image from "next/image"
import styles from "./styles.module.css"

export default function Page() {
    return (
        <div>
            <div id={styles.logo}>
                <Image src="/logo1.png" alt="logo" width={60} height={60} />
                <p>For You</p>
            </div>
        </div>
    )
}
