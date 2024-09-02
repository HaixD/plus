import styles from "./styles.module.css";
import Image from "next/image";
import { ReactNode } from "react";
import "./styles.css"

export default function Layout({
    children
}: Readonly<{
    children: ReactNode
}>) {
    return (
        <main className={styles.main}
        //External CSS not applied correctly
        style={{
            minHeight: "100vh",
            display: "grid",
            gridTemplateColumns: "70vw auto"
        }}
        >
            <Image 
                src="/logo1.png" 
                alt="logo" 
                width={338} 
                height={338}
                id="logostyle"
            />

            <div className={styles.bodylayout}
            >
                {children}
            </div>
        </main>
    )
}