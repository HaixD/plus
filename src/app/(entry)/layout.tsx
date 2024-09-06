import styles from "./styles.module.css";
import Image from "next/image";
import { ReactNode } from "react";

export default function Layout({
    children
}: Readonly<{
    children: ReactNode
}>) {
    return (
        <main id={styles.page}>
            <Image 
                src="/logo1.png" 
                alt="logo" 
                width={338} 
                height={338}
                id={styles.logo}
            />

            <div className={styles.bodylayout}>
                {children}
            </div>
        </main>
    )
}