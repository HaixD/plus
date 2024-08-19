import "./style.css"
import styles from "./styles.module.css"
import Image from "next/image";
import { ReactNode } from "react";

export default function Layout({
    children
}: Readonly<{
    children: ReactNode
}>) {
    return (
        <main id={styles.container}>
            <Image 
                src="/logo1.png" 
                alt="logo" 
                width={338} 
                height={338}
                style={{
                    display: "block",
                    justifySelf: "center",
                    alignSelf: "center"
                }}
            />
            <div id={styles.content}>
                {children}
            </div>
        </main>
    )
}