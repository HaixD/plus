export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div
            style={{
                display: "grid",
                justifyItems: "stretch",
                width: "100%",
                marginInline: "auto"
            }}
        >
            {children}
        </div>
    )
}