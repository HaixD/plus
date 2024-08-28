import { forwardRef, HTMLAttributes } from "react"

type PopupContainerProps = {
    isVisible?: boolean
} & HTMLAttributes<HTMLDivElement>

export const PopupContainer = forwardRef<HTMLDivElement, PopupContainerProps>(function Modal({
    isVisible=false,
    style={},
    children,
    ...props
}, ref) {
    return (
        <div 
            style={{
                position: "fixed",
                width: "100%",
                height: "100vh",
                display: isVisible ? "flex" : "none",
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                cursor: "pointer",
                top: 0,
                justifyContent: "center",
                alignItems: "center",
                ...style
            }}
            {...props}
        >
            <div
                style={{
                    backgroundColor: "var(--background-color-popup)",
                    borderRadius: "var(--border-radius-medium)",
                    cursor: "default",
                    padding: "var(--padding-large)",
                    width: "55vw",
                    maxWidth: "55vw"
                }}
            >
                {children}
            </div>
        </div>
    )
})