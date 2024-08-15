import styles from "./styles.module.css"

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div id={styles.container}>
            {children}
        </div>
    )
}