import styles from "./styles.module.css"
import Link, { LinkProps } from "next/link";

export default function Page() {
    
    return (
        <>
            <h1>Your Account</h1>
            <div className={styles["setting-options"]}>
                <SettingOption href="/settings/username" text="Change Username"/>
                <SettingOption href="/settings/password" text="Change Password"/>
            </div>
        </>
    )
}

function SettingOption({
    text,
    ...props
}: Readonly<Exclude<LinkProps, "children">> & {
    text: string
}) {
    return (
        <Link {...props}>
            <span>{text}</span>
            <span>{">"}</span>
        </Link>
    )
}