import Link, { LinkProps } from "next/link";

export default function Page() {    
    return (
        <>
            <h1>Your Account</h1>
            <div
                style={{
                    justifySelf: "stretch",
                    display: "grid",
                    gap: "1rem"
                }}
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
        <Link className="setting-option" {...props}>
            <span>{text}</span>
            <span>{">"}</span>
        </Link>
    )
}