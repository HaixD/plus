import styles from "./styles.module.css"
import Link, { LinkProps } from "next/link";

export default function Page() {    
    return (
        <>
            <h1 id={styles.title}>Your Account</h1>
            <div id= {styles.accountlayout}
            >
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
        <Link className={styles["setting-option"]} {...props}>
            <span>{text}</span>
            <span>{">"}</span>
        </Link>
    )
}