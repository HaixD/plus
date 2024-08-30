import "./style.css"
import Image from "next/image";
import { ReactNode } from "react";

export default function Layout({
    children
}: Readonly<{
    children: ReactNode
}>) {
    return (
        <main 
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
                style={{
                    display: "block",
                    placeSelf: "center"
                }}
            />
            <div
                style={{
                    backgroundColor: "white",
                    paddingInline: "4rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-evenly"
                }}
            >
                {children}
            </div>
        </main>
    )
}